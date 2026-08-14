# Project plan

Working status/roadmap doc for `clients-front`. Mirrors the structure of the sibling backend
repo's `docs/PLAN.md` (`~/IdeaProjects/clients-service`).

## Done so far

- **Backend integration.** Clients, Phones, Addresses, and Projects are wired to the real
  Spring Boot backend via `lib/api/*.ts` (`BACKEND_API_URL`).
- **Real auth wiring.** `lib/api/auth.ts` now calls the backend's real `POST /api/v1/auth/login`
  and `POST /api/v1/auth/register` (bcrypt-verified, HS256 JWT) instead of checking a local
  password map. The returned token is stored in its own httpOnly `backend_token` cookie
  (`lib/api/http.ts`, `setBackendToken`/`clearBackendToken`), separate from `lib/session.ts`'s
  app-level session cookie, and `apiGet`/`apiPost`/`apiPut`/`apiDelete` attach it as
  `Authorization: Bearer <token>` on every request — required now that the backend's
  `SecurityConfig` enforces `anyRequest().authenticated()` on everything but `auth`/`actuator`.
  `createClient` takes an optional explicit token (rather than relying on the cookie) so the
  signup flow can create the backend `Client` with the token it just received, before that
  token's cookie write is guaranteed visible later in the same action.
  Known gaps, since the backend has no roles/authorities yet (see `docs/API.md`):
  - `lib/mock-data/users.ts`'s `users` array is still the only source of app-level role/name/
    clientId — a real backend `User` (email + password) is necessary but not sufficient to log
    in; the email must *also* have a matching profile entry here.
  - The demo/seed accounts (`dana@camedina.com`, `jordan@acme.test`, etc.) have profile entries
    but no backing backend `User` — each needs to be registered against the backend once
    (`POST /api/v1/auth/register`) with a matching password before it can log in for real. Their
    seeded `clientId`s are also placeholders, not real backend `Client` UUIDs.
  - No token refresh/revocation (matches the backend's current state): the backend JWT expires
    in `security.jwt.expiration` (default 1h) while the app session cookie lasts 7 days, so a
    long-lived app session can start getting `ApiError(401)` from backend calls before the user
    is prompted to log in again.
- **Docker packaging.** Multi-stage `Dockerfile` (`node:22-alpine`, `output: "standalone"`),
  `compose.yaml` (reaches `clients-service` on the host via `host.docker.internal`),
  `.dockerignore`, `.env.example`. Documented in `README.md` under "Docker".
- **Branding.** Placeholder `agency@web`/`agency.test` replaced with `camedina@web`/
  `camedina.com` across marketing/auth pages and mock user data.
- **CI + real CD via GitHub Actions.** `.github/workflows/ci-cd.yml`: a `lint-and-build` job
  (`npm run lint` + `npm run build`) gates every push/PR to `main`; on push to `main` only, a
  `publish-and-deploy` job builds the existing multi-stage `Dockerfile`, pushes it to ECR
  (`camedina-dev-clients-front`, tagged `latest` + commit SHA), and runs
  `aws ecs update-service --force-new-deployment` on `camedina-dev-clients-front` — auth via
  GitHub OIDC (`camedina-dev-github-app-role`, no stored AWS credentials). Documented in
  `README.md` under "CI/CD". Mirrors `clients-service`'s own `deploy.yml` pattern. The ECS
  Fargate service, ALB, and ECR repo this deploys to are provisioned by the sibling `clients-infra`
  repo (`~/IdeaProjects/clients-infra`) — see its `docs/PLAN.md`/`README.md` for that side.
  **Verified working end-to-end on 2026-08-13**: a live push-to-`main` run built the image,
  pushed it to ECR, and force-redeployed the `camedina-dev-clients-front` ECS service
  (GitHub Actions run succeeded). Getting there required two one-time AWS-side fixes in
  `clients-infra` (bootstrap OIDC stack had never been deployed, then its trust policy needed
  updating for GitHub's post-rename id-qualified `sub` claim) plus deploying the
  `service-clients-front` stack itself — all now applied; see `clients-infra`'s `github-oidc.yaml`
  and README for details.
- **Test runner added.** Vitest + React Testing Library, `happy-dom` environment — see `CLAUDE.md`
  ("Testing" section) for conventions and `README.md` for the commands. `npm test` (single run) is
  now a step in `lint-and-build`, before `npm run build`. Environment note: `jsdom` (the
  environment Next.js's own testing guide suggests) hit an unresolved upstream bug on this
  machine's Node 20.15 — `jsdom@28+` bumped `html-encoding-sniffer` to a version that `require()`s
  an ESM-only dependency, which only works on Node `>=20.19`/`>=22.12` (where synchronous
  `require(esm)` is supported); pinning `jsdom` backward just hit the same wall one dependency
  further in (`@asamuzakjp/css-color` → `@csstools/css-calc`). Switched to `happy-dom` instead,
  which has a much lighter dependency tree and isn't affected. Revisit if bumping the local/CI
  Node version ever becomes deliberate — `jsdom` would then be a safe option again, and it's
  slightly closer to real browser behavior for edge cases.
- Also dropped `vite-tsconfig-paths` from the doc's suggested manual setup in favor of Vite 8's
  native `resolve.tsconfigPaths: true` (the plugin now prints a deprecation notice recommending
  exactly that).

## Suggested next steps

Roughly in the order they unblock each other; not a hard commitment, just a proposed path —
revisit as priorities change.

1. **Seed/register the demo accounts against the real backend** (see the known gaps above) so
   the existing demo login flow works end-to-end again, and give them real `Client` records so
   their `clientId`s aren't placeholders.
2. **Decide on token refresh/session UX** once the backend gains a refresh or longer-lived token
   — right now a stale `backend_token` just surfaces as an `ApiError(401)` from whichever page
   happens to call the backend next.

## How to update this doc

Check off / rewrite "Done so far" and trim "Suggested next steps" as work lands — treat it as
living, not a one-time snapshot.
