# Implementation plan — `clients-front`

The Next.js workstream for the cross-repo review in
`clients-infra/docs/ARCHITECTURE_IMPROVEMENTS.md` (`~/IdeaProjects/clients-infra`). Gap IDs
(`G1`…`G21`) and phase numbers refer to that document. Sibling plans live in
`clients-infra/docs/IMPLEMENTATION_PLAN.md` and `clients-service/docs/IMPLEMENTATION_PLAN.md`.

`docs/PLAN.md` remains this repo's working status doc; this file covers the architectural changes
only. Everything below inherits `CLAUDE.md`'s conventions: `@/*` imports only, strict TypeScript, no
`any`, Server Components by default, backend access confined to `"server-only"` / `"use server"`
modules, colocated Vitest tests, and no abstractions for cases that don't exist yet.

**The BFF boundary does not move.** Every change below preserves the property that the browser never
holds a backend token and never talks to `clients-service` directly — that's the strongest thing
about the current architecture and none of this is worth trading for it.

---

## Phase 0 — Correctness (~2 hours)

### 0.1 A health route for the ECS container health check (G5)

Fargate ignores the Dockerfile `HEALTHCHECK`; the infra plan adds a
`ContainerDefinition.HealthCheck` pointing at `/api/health`, which doesn't exist yet.

`app/api/health/route.ts`:

```ts
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ status: "ok" }, { status: 200 });
}
```

Deliberately *not* checking the backend: if it were a deep check, a backend outage would make ECS
kill healthy frontend tasks, turning a partial outage into a total one. Keep it shallow and let the
backend's own health check speak for the backend.

Add it to `proxy.ts`'s matcher exclusions so the auth middleware doesn't touch it, and point the
ALB target group's `HealthCheckPath` at it (currently `/`, the marketing page — which works but
renders a full page for every health probe).

### 0.2 The `Secure` cookie / plain-HTTP trap (G2)

`lib/session.ts` and `lib/api/http.ts` both set `secure: process.env.NODE_ENV === "production"`.
That's the correct code — but the ALB is HTTP-only today, so browsers **silently drop those cookies
on the deployed environment**. Login appears to succeed and then nothing is logged in.

The real fix is infra Phase 1 (CloudFront + ACM). Nothing to change here except awareness — and a
note in `README.md` so the failure mode isn't rediscovered from scratch. Once TLS lands, also flip
`sameSite` to `"strict"` for the session cookie if no cross-site entry flow needs `"lax"`.

---

## Phase 2 — Identity consolidation (~2 days)

Implements ADR-004. Closes G4 and the frontend half of G7. This is the biggest change in this repo.

### 2.1 Delete `lib/mock-data/users.ts`

It is currently the only source of role, display name and `clientId`, which means a real backend
account can't log in without a matching hardcoded entry — the split-brain identity model the shared
doc flags as G4.

Once `clients-service` exposes `role`/`name`/`clientId` (as JWT claims and via
`GET /api/v1/auth/me`), the flow becomes:

1. `login` server action → `POST /api/v1/auth/login` → backend JWT.
2. `setBackendToken(token)` as today.
3. `GET /api/v1/auth/me` with that token → `{ id, email, role, name, clientId }`.
4. `createSession(...)` from **that** response, not from a local lookup.

`lib/api/auth.ts` grows a `me(token?: string)`; `app/actions/auth.ts` calls it between steps 2 and
3. The existing "pass the token explicitly rather than relying on the cookie being visible later in
the same action" trick in `createClient` applies here too, for the same reason.

Delete the seeded demo accounts, or convert them into a backend seed migration / a `make seed`
script that registers them for real. `docs/PLAN.md`'s next-step 1 disappears with this change.

### 2.2 Simplify the session cookie

Once the backend token carries `role` and `clientId`, the app-level session is duplicated state that
can drift. Two options:

1. **Keep both cookies, shrink the session payload** to `{ userId, role, expiresAt }` (already
   nearly true) and treat the backend token as authoritative for anything else. Smallest change;
   `proxy.ts` keeps working unchanged because it only needs `role`.
2. **Drop the app session entirely** and derive everything from the backend token — decode its
   claims server-side in `dal.ts`. One cookie, one source of truth, no possibility of drift. The
   cost: `proxy.ts` (Edge runtime) must decode the backend JWT without verifying it, which is fine
   for a redirect decision but must never be the only check — the backend still enforces
   authorisation on every call.

**Recommend option 2**, gated on Phase 2.5 refresh tokens landing first (otherwise the whole session
dies after an hour with no recovery). It removes an entire class of "the cookie says admin, the
token says client" bug.

### 2.3 Handle expiry properly (G7)

Today a 7-day session cookie outlives a 1-hour backend JWT, so a `401` surfaces from whichever page
happens to call the backend next — the failure is invisible until it isn't.

Once the backend has refresh tokens:

- Store the refresh token in its own httpOnly cookie with the longer lifetime.
- In `lib/api/http.ts`'s `request()`, on a `401` from the backend: call `POST /api/v1/auth/refresh`
  once, rewrite the token cookie, retry the original request once, and only then give up. Guard
  against recursion with a flag on the retry.
- On refresh failure, clear both cookies and `redirect("/login")`.

Add an explicit test in `lib/api/http.test.ts` for the refresh-once-then-retry path — it's exactly
the kind of logic that breaks silently.

### 2.4 Show authorisation errors as authorisation errors

With `@PreAuthorize` live in the backend, `403` becomes a real response. `ApiError` already carries
`status`; add an `apiGetOrForbidden` companion to `apiGetOrNull`, and render a proper "you don't
have access to this" state rather than the generic `error.tsx` boundary.

---

## Phase 3 — Async job UX (~2 days)

The user-visible half of the queue work. The frontend never touches SQS — it talks to
`clients-service`, which returns `202 Accepted` and a job id.

### 3.1 Bulk client import

- `app/admin/imports/page.tsx` — a Client Component file input posting to a server action.
- `app/actions/imports.ts` (`"use server"`) — `POST /api/v1/imports` (multipart), returns the job id
  from the `Location` header, `redirect`s to `/admin/imports/{id}`.
- `app/admin/imports/[jobId]/page.tsx` — Server Component rendering the current status, wrapping a
  small Client Component that polls `GET /api/v1/imports/{id}` via a route handler every 2 s until
  the status is terminal.
- A progress bar driven by `processedRows / totalRows`, and a table of per-row errors on completion.

Polling through a route handler (`app/api/imports/[jobId]/route.ts`) rather than direct client
fetches keeps the backend token server-side — the BFF boundary again.

If you want to demonstrate something beyond polling, a Server-Sent Events route handler streaming
job progress is a genuinely better UX and a nice showcase; `ReadableStream` in a route handler is
about 20 lines. Polling first, SSE as a follow-up.

### 3.2 Project report export

Same shape: a "Download report" button → `POST /api/v1/projects/{id}/report` → 202 → poll → a
presigned S3 URL. Reuse whatever job-status component 3.1 produces rather than building a second
one — but only extract the shared component once there are actually two callers.

### 3.3 Activity feed

The worker writes `activity_feed` rows from domain events. Render them on `/portal` and
`/admin/clients/[clientId]` — a visible, obviously-async feature that makes the whole event backbone
demonstrable in the UI instead of only in CloudWatch. Worth building for that reason alone.

---

## Phase 4 — Observability (~1 day)

### 4.1 Correlation ID propagation (G10)

In `proxy.ts`, generate a `X-Request-Id` (`crypto.randomUUID()`) per request when absent and set it
on the forwarded request headers. In `lib/api/http.ts`'s `request()`, read it from `headers()` and
attach it to every backend call. The backend puts it in its MDC and carries it into the outbox, so
one id spans browser → BFF → API → queue → worker.

### 4.2 Structured logging (G11)

Next.js server logs currently go to stdout as plain text. A tiny `lib/logger.ts` emitting JSON
(`{ level, msg, requestId, route, durationMs }`) — `pino` if a dependency is acceptable, a 15-line
`console.log(JSON.stringify(...))` wrapper if not — makes CloudWatch Logs Insights queryable.
Given `CLAUDE.md`'s "no abstractions for cases that don't exist yet", start with the wrapper.

Log every backend call's duration and status in `request()`; that alone answers "is the page slow
because of us or because of the backend".

### 4.3 Tracing

`@vercel/otel` (or the OTel Node SDK) with the OTLP exporter pointed at `localhost:4317`, where the
infra plan's ADOT sidecar listens. `fetch` is auto-instrumented, so the BFF → backend hop shows up
on the X-Ray service map as a real edge.

---

## Phase 6 — Contract, testing, edge (ongoing)

### 6.1 Generate the API client from OpenAPI (G12)

`lib/types/*.ts` hand-duplicates the backend's DTOs while springdoc publishes a live OpenAPI 3.1
spec. Drift is currently silent and only shows up at runtime.

```bash
npm i -D openapi-typescript
npx openapi-typescript ../clients-service/docs/openapi.json -o lib/types/api.d.ts
```

- The backend's CI commits `docs/openapi.json` (see its plan, "Contract test").
- An `npm run generate:api` script; either commit the generated file (simplest, reviewable diffs) or
  regenerate at build time.
- A CI step that regenerates and fails on an uncommitted diff — the cheap contract test.
- Migrate `lib/api/*.ts` to the generated types incrementally; keep the hand-written domain types
  where they add genuine app-level meaning beyond the wire shape.

This turns a whole class of integration bug into a TypeScript compile error, and it's a concrete
answer to "how do you keep frontend and backend in sync?".

### 6.2 Playwright E2E (G17)

Nothing currently exercises browser → front → back. One happy path against the docker-compose stack
in CI: log in → create a client → add a project → change its status → see the activity feed entry
the worker produced. That last step is a real end-to-end async assertion, not a mock.

Vitest stays for unit/component work; Playwright covers what `CLAUDE.md` correctly says Vitest
can't — async Server Components and full page rendering.

### 6.3 CDN-aware caching (G3)

Once CloudFront is in front (infra Phase 1):

- Verify `/_next/static/*` returns `x-cache: Hit from cloudfront` on a second request. Next.js
  content-hashes those filenames, so they're immutable and safe to cache aggressively.
- Make sure nothing user-specific leaks into a cacheable response — audit any route with `revalidate`
  or `force-static` for per-user data. The default cache behaviour is `CachingDisabled`, so the risk
  is only in routes explicitly opted into caching.
- `next.config.ts` is currently just `output: "standalone"`. Consider adding a `headers()` block for
  app-level security headers as defence in depth, even with CloudFront's response headers policy in
  place.

### 6.4 Smaller items

| Item | Notes |
|---|---|
| `proxy.ts` has no test | The root `proxy.ts` (Next 16's rename of `middleware.ts` — correct for the pinned `next@16.3.0`) is the only thing enforcing route-level auth, and nothing tests it. A silently-inactive or mis-matched proxy is a security bug Vitest would never catch today. Add tests for each branch: unauthenticated on `/admin` → redirect to `/login`, `client` role on `/admin` → redirect to portal home, authenticated on `/login` → redirect home. |
| `SESSION_SECRET` fallback | `lib/session.ts` falls back to `"dev-only-insecure-secret-key"`. Mirror the backend's Phase 0.2 fix: throw at startup when `NODE_ENV === "production"` and the secret is missing or equals the default. |
| Error boundaries | `admin/error.tsx` and `portal/error.tsx` exist; add a root `app/error.tsx` and a `global-error.tsx`. |
| Loading skeletons | `loading.tsx` files are minimal; real skeletons matching each page's layout are cheap and make the app feel built rather than scaffolded. |
| Accessibility pass | `eslint-plugin-jsx-a11y` in the flat config, plus keyboard-nav and focus-state checks on the forms. Reads well on a portfolio. |
| Bundle analysis | `@next/bundle-analyzer` once, to confirm nothing heavy leaked into a Client Component. |
| Node version | `@types/node` is `^20` while `docs/PLAN.md` notes Node 20.15 blocked `jsdom`. Pinning CI and the Dockerfile to Node 22 LTS would let `jsdom` back in and matches `node:22-alpine` in the Dockerfile — worth aligning. |

---

## Sequencing

```
Phase 0 (2 h) ──> Phase 2 (2 d) ──> Phase 3 (2 d) ──> Phase 4 (1 d)
                       ▲                                    │
      backend Phase 2 ─┘              6.1 / 6.2 any time ───┘
```

Phase 2 is blocked on the backend shipping `role`/`clientId` claims, `/auth/me` and refresh tokens.
Phase 3 is blocked on the backend's async job endpoints. Phase 6.1 (generated API client) can start
as soon as the backend commits `docs/openapi.json` and is worth doing early — it makes every
subsequent change safer.

## How to update this doc

Same convention as `docs/PLAN.md`: strike finished items, fold the detail into `README.md`/
`CLAUDE.md` once it's how the app actually works, and keep the gap IDs so this file stays aligned
with `clients-infra/docs/ARCHITECTURE_IMPROVEMENTS.md`.
