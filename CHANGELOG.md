# Changelog

All notable changes to `clients-front`, newest first. See `docs/PLAN.md` for the living
roadmap and `docs/IMPLEMENTATION_PLAN.md` for planned architectural work.

## 2026-08-16

- Merged `docs/IMPLEMENTATION_PLAN.md`'s phased next-steps (Phases 0, 2, 3, 4, 6 — health route,
  identity consolidation, async job UX, observability, contract/testing) into `docs/PLAN.md`'s
  "Suggested next steps". Validated against the codebase: none of that work has landed yet.

## 2026-08-14

- **Real auth wiring.** `lib/api/auth.ts` now calls the backend's real
  `POST /api/v1/auth/{login,register}` (bcrypt + HS256 JWT) instead of a local password map. Token
  stored in its own httpOnly `backend_token` cookie (`lib/api/http.ts`), separate from the
  app-level session cookie, and attached as `Authorization: Bearer` on every backend call.
  Known gap: `lib/mock-data/users.ts` is still the only source of app-level role/name/`clientId`;
  demo accounts aren't yet registered against the backend; no token refresh.
- **Test runner added.** Vitest + React Testing Library, `happy-dom` environment (not `jsdom` —
  hit an unresolved Node <22.12 ESM interop bug locally). `npm test` is now a `lint-and-build` CI
  step, before `npm run build`.

## 2026-08-13

- **CI/CD verified working end-to-end.** `.github/workflows/ci-cd.yml`: `lint-and-build` gates
  every push/PR to `main`; on push to `main`, builds the Docker image, pushes to ECR
  (`camedina-dev-clients-front`), and force-redeploys ECS service `camedina-dev-clients-front` via
  GitHub OIDC (no stored AWS credentials). Required two one-time AWS-side fixes in the sibling
  `clients-infra` repo: deploying the never-applied GitHub OIDC bootstrap stack, then adding
  id-qualified `sub` claims to its trust policy (GitHub appends `@<id>` post-rename/-transfer).

## 2026-08-09

- **Branding resolved.** Placeholder `agency@web`/`agency.test` replaced with real
  `camedina@web`/`camedina.com` across marketing/auth pages and mock user data.
- **Docker packaging added.** Multi-stage `Dockerfile` (`node:22-alpine`,
  `output: "standalone"`), `compose.yaml`, `.dockerignore`, `.env.example`.

## 2026-08-07

- **Backend integration.** Clients, Phones, and Addresses wired to the real Spring Boot backend
  (`lib/api/*.ts`, `BACKEND_API_URL`); mock data for those removed.
