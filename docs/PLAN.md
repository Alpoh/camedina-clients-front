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
  **Verified working end-to-end on 2026-08-13**: a live push-to-`main` run built the image,
  pushed it to ECR, and force-redeployed the `camedina-dev-clients-front` ECS service
  (GitHub Actions run succeeded). Getting there required two one-time AWS-side fixes in
  `clients-infra` (bootstrap OIDC stack had never been deployed, then its trust policy needed
  updating for GitHub's post-rename id-qualified `sub` claim) plus deploying the
  `service-clients-front` stack itself — all now applied; see `clients-infra`'s `github-oidc.yaml`
  and README for details.

## Suggested next steps

Roughly in the order they unblock each other; not a hard commitment, just a proposed path —
revisit as priorities change.

1. **Wire real auth**, once the backend's `User`/auth vertical is available — replace
   `lib/api/auth.ts`'s mock array with calls to the real register/login endpoints, keeping
   `lib/session.ts` (JWT cookie via `jose`) as-is.

## How to update this doc

Check off / rewrite "Done so far" and trim "Suggested next steps" as work lands — treat it as
living, not a one-time snapshot.
