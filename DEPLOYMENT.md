# Deployment Guide

CineFind is a standard Next.js 16 App Router project with `output: "standalone"` enabled, so it can be deployed to any platform that runs Node.js, or as a static-friendly serverless target.

## Pre-deployment checklist

Run this locally before deploying:

```bash
npm run validate   # typecheck + lint + build, in one command
```

CI (`.github/workflows/ci.yml`) runs the same three checks on every push/PR.

## Required environment variables

Set these on every platform (see `.env.local.example`):

- `TMDB_API_READ_ACCESS_TOKEN` — TMDB v4 read access token (**required** — the server fails fast with a clear error at boot if this is missing or malformed, via `src/instrumentation.ts`)
- `TMDB_API_KEY` — TMDB v3 API key (kept for reference/back-compat)
- `NEXT_PUBLIC_SITE_URL` — the public URL of your deployment (used for SEO, sitemap, OAuth callback, security headers)
- `NEXT_PUBLIC_TMDB_IMAGE_BASE` — defaults to `https://image.tmdb.org/t/p`
- `REVALIDATE_SECRET` — optional; enables `POST /api/revalidate?secret=...&path=/movie/550` for on-demand cache purging. Leave unset to disable that endpoint.

For the TMDB account login flow to work, `NEXT_PUBLIC_SITE_URL` must match the domain you deploy to, since it's used as the OAuth callback URL.

**Important**: the env-validation check runs when the server actually starts (not during `next build`), so it's safe to build a Docker image without secrets present and inject them only at container runtime — which is exactly what the included `Dockerfile`/`docker-compose.yml` do.

## Vercel

1. Import the repo in Vercel.
2. Framework preset: Next.js (auto-detected).
3. Add the environment variables above in Project Settings → Environment Variables.
4. Deploy — no extra config needed.

## Netlify

1. `netlify.toml` is already included with `@netlify/plugin-nextjs`.
2. Add environment variables in Site Settings → Environment Variables.
3. Push to your connected branch, or run `netlify deploy --build`.

## Docker (any VPS — DigitalOcean, Hostinger VPS, AWS EC2/ECS, GCP Compute/Cloud Run)

A production-ready multi-stage `Dockerfile` and `docker-compose.yml` are included, with a built-in `HEALTHCHECK` against `/api/health`.

```bash
# Build and run locally
docker compose up --build

# Or build/run manually
docker build -t cinefind .
docker run -p 3000:3000 \
  -e TMDB_API_READ_ACCESS_TOKEN=your_token \
  -e NEXT_PUBLIC_SITE_URL=https://yourdomain.com \
  cinefind
```

Put this behind a reverse proxy (Nginx, Caddy, or Hostinger's built-in proxy) for TLS termination.

### DigitalOcean App Platform / GCP Cloud Run / AWS App Runner

These all support "deploy from Dockerfile" directly — point the platform at this repo, set the environment variables, and it will build and run the same container. Point the platform's health check at `/api/health`.

## Hostinger (shared/Node.js hosting, non-Docker)

If deploying to a Node.js-capable Hostinger plan without Docker:

```bash
npm ci
npm run build
node .next/standalone/server.js
```

Copy `.next/standalone`, `.next/static` (into `.next/standalone/.next/static`), and `public` (into `.next/standalone/public`) to the server, then run `server.js` with a process manager (PM2) behind the hosting panel's Node.js app runner.

## Production hardening already in place

- **Security headers** (CSP, X-Frame-Options, HSTS in production, Referrer-Policy, Permissions-Policy) applied via `next.config.ts`, scoped to exclude `/widget/*` so the embeddable rating widgets still work in third-party `<iframe>`s.
- **`proxy.ts`** (Next 16's renamed `middleware.ts`) rejects cross-origin state-changing requests to `/api/*` (CSRF mitigation) and applies a per-IP sliding-window rate limit to guest-rating, search, account, and list API routes. Note: the rate limiter is in-memory and scoped to a single server process — for multi-instance deployments behind a load balancer, swap it for a shared store (Redis/Upstash).
- **Input validation**: every mutating API route validates its JSON body with `zod` (`src/lib/validation.ts`) and returns a structured 400 on invalid input, instead of trusting unchecked client data.
- **`/api/health`**: returns `{ status: "ok" | "degraded", checks: { tmdb } }` — used by the Dockerfile `HEALTHCHECK` and suitable for uptime monitors / load balancer health probes.
- **On-demand revalidation**: `POST /api/revalidate?secret=...&path=/movie/550` (or `&tag=...`) purges the ISR cache immediately, without waiting for the time-based revalidate window.

## Notes

- All TMDB requests are server-side only (API keys never reach the browser).
- Sitemap (`/sitemap.xml`) and `robots.txt` are generated dynamically and respect `NEXT_PUBLIC_SITE_URL`.
- The TMDB account login callback is `${NEXT_PUBLIC_SITE_URL}/api/auth/callback` — no manual redirect URI registration is needed since TMDB's request-token flow accepts a dynamic `redirect_to` parameter.
