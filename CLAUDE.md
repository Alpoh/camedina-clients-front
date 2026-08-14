@AGENTS.md

# Code conventions

- **Imports:** always use the `@/*` path alias (configured in `tsconfig.json`) — never relative
  `../` imports, e.g. `@/lib/api/http`, not `../../lib/api/http`. The codebase is 100% aliased
  today; keep it that way.
- **TypeScript:** strict types throughout; avoid `any` — prefer `unknown` + narrowing or a precise
  type. Prefer plain `type` aliases for data shapes, matching `lib/types/*.ts`.
- **Next.js (App Router):** Server Components by default. Mark a file `"use client"` only when it
  needs interactivity/hooks. Anything that touches the backend or secrets stays `"server-only"`
  (see `lib/api/*.ts`) or `"use server"` (see `app/actions/*.ts`) — never call the backend
  directly from a Client Component.
- **Clean code:** no comments that restate what the code does — only comment non-obvious *why*.
  Don't add abstractions, options, or config for cases that don't exist yet in this app.

# Testing

- **Runner:** Vitest + React Testing Library (`happy-dom` environment — not `jsdom`; see
  `vitest.config.mts`'s comment history / `docs/PLAN.md` if reviving `jsdom` ever comes up, it hit
  an unresolved upstream ESM/CJS interop bug on Node <22.12). Run with `npm test` (single run,
  what CI uses) or `npm run test:watch`.
- **Location:** colocate `*.test.ts`/`*.test.tsx` next to the file under test (e.g.
  `app/actions/auth.test.ts`, `components/ui/button.test.tsx`), not in a separate `__tests__` tree.
- **`"server-only"` / `"use server"` modules:** don't import them directly into a test — mock the
  module with `vi.mock` instead (see `app/actions/auth.test.ts` for the pattern: mocking
  `@/lib/api/auth`, `@/lib/api/http`, `@/lib/session`, and `next/navigation`). This also keeps
  action/route tests from needing a real request context (`cookies()`, `headers()`, etc.).
- **Async Server Components:** Vitest can't render these (see Next.js's own testing docs) — don't
  write unit tests for `page.tsx`/`layout.tsx` files that fetch data. Test the pure logic they call
  into instead (`lib/*.ts`, server actions), and rely on manual/E2E testing for the page itself.
