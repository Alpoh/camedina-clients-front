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
