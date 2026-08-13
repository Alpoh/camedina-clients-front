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
- **CI + real CD via GitHub Actions.** `.github/workflows/ci-cd.yml`: a `lint-and-build` job
  (`npm run lint` + `npm run build`) gates every push/PR to `main`; on push to `main` only, a
  `publish-and-deploy` job builds the existing multi-stage `Dockerfile`, pushes it to ECR
  (`camedina-dev-clients-front`, tagged `latest` + commit SHA), and runs
  `aws ecs update-service --force-new-deployment` on `camedina-dev-clients-front` — auth via
  GitHub OIDC (`camedina-dev-github-app-role`, no stored AWS credentials). Documented in
  `README.md` under "CI/CD". Mirrors `clients-service`'s own `deploy.yml` pattern. The ECS
  Fargate service, ALB, and ECR repo this deploys to are provisioned by the sibling `clients-infra`
  repo (`~/IdeaProjects/clients-infra`) — see its `docs/PLAN.md`/`README.md` for that side.
  First `ci-cd.yml` iteration (lint+build+publish to GHCR) was verified working via a successful
  GitHub Actions run on 2026-08-13; the ECR/ECS version above replaces it and still needs its own
  first-run verification once pushed.

## Suggested next steps

Roughly in the order they unblock each other; not a hard commitment, just a proposed path —
revisit as priorities change.

1. **Verify the ECR/ECS `ci-cd.yml` on a real push to `main`.** The workflow logic mirrors
   `clients-service`'s proven `deploy.yml`, and the AWS side (ECR repo, ECS service, OIDC role)
   is already provisioned by `clients-infra`, but this exact frontend workflow hasn't had a live
   run yet — confirm the image lands in `camedina-dev-clients-front` (ECR) and the ECS service
   actually redeploys.
2. **Wire real auth**, once the backend's `User`/auth vertical is available — replace
   `lib/api/auth.ts`'s mock array with calls to the real register/login endpoints, keeping
   `lib/session.ts` (JWT cookie via `jose`) as-is.

## How to update this doc

Check off / rewrite "Done so far" and trim "Suggested next steps" as work lands — treat it as
living, not a one-time snapshot.
