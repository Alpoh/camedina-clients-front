This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

### Environment variables

Copy `.env.local.example` to `.env.local` and fill it in — `SESSION_SECRET` (falls back to an
insecure dev-only default if unset) and `BACKEND_API_URL` (defaults to `http://localhost:8080`,
the [`clients-service`](../clients-service) Spring Boot backend).

## Docker

Build and run the production image directly:

```bash
docker build -t clients-front .
docker run --rm -p 3000:3000 \
  -e SESSION_SECRET=<your-secret> \
  -e BACKEND_API_URL=http://host.docker.internal:8080 \
  clients-front
```

Or via Compose, which reads a plain `.env` file (distinct from `.env.local`/`.env.local.example`,
which only `next dev` reads):

```bash
cp .env.example .env   # fill in SESSION_SECRET
docker compose up --build
```

`compose.yaml` reaches a `clients-service` backend running on the host via `host.docker.internal`
(mapped through `extra_hosts` for Linux compatibility) rather than starting it itself — that
backend has its own separate repo, Dockerfile, and `compose.yaml`. The image uses Next.js's
`output: "standalone"` build (see `next.config.ts`) on a multi-stage Alpine base, with a
`HEALTHCHECK` against the public `/` route.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
