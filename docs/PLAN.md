# Project plan

Working status/roadmap doc for `clients-front`. Mirrors the structure of the sibling backend
repo's `docs/PLAN.md` (`~/IdeaProjects/clients-service`).

## Done so far

- **Backend integration.** Clients, Phones, Addresses, and Projects are wired to the real
  Spring Boot backend via `lib/api/*.ts` (`BACKEND_API_URL`). Auth (`lib/api/auth.ts`) still
  targets an in-memory mock array pending the backend's `User`/auth vertical.
- **Docker packaging.** Multi-stage `Dockerfile` (`node:22-alpine`, `output: "standalone"`),
  `compose.yaml` (reaches `clients-service` on the host via `host.docker.internal`),
  `.dockerignore`, `.env.example`. Documented in `README.md` under "Docker".
- **Branding.** Placeholder `agency@web`/`agency.test` replaced with `camedina@web`/
  `camedina.com` across marketing/auth pages and mock user data.
- **CI + image publishing via GitHub Actions.** `.github/workflows/ci-cd.yml`: a `lint-and-build`
  job (`npm run lint` + `npm run build`) gates every push/PR to `main`; on push to `main` only, a
  `publish-image` job builds the existing multi-stage `Dockerfile` and pushes it to GHCR
  (`ghcr.io/alpoh/camedina-clients-front`, tagged `latest` + commit SHA) using the built-in
  `GITHUB_TOKEN` — no registry secrets needed for this part. Documented in `README.md` under
  "CI/CD".

## Suggested next steps

Roughly in the order they unblock each other; not a hard commitment, just a proposed path —
revisit as priorities change.

1. **Actually deploy the published image to a running host.** The image lands in GHCR on every
   `main` push, but nothing pulls/runs it yet. Target host still TBD (e.g. a VPS via SSH +
   `docker compose pull && up -d`, a managed container platform, etc.) — should mirror whatever
   the backend's own GitHub Actions CD (`clients-service` `docs/PLAN.md` step 2) settles on,
   since both images likely deploy to the same place. Will need secrets (deploy-target
   credentials) added via GitHub Actions repo secrets, never committed.
2. **Wire real auth**, once the backend's `User`/auth vertical is available — replace
   `lib/api/auth.ts`'s mock array with calls to the real register/login endpoints, keeping
   `lib/session.ts` (JWT cookie via `jose`) as-is.

## How to update this doc

Check off / rewrite "Done so far" and trim "Suggested next steps" as work lands — treat it as
living, not a one-time snapshot.
