# Deployment Guide

CineFind is a standard Next.js 16 App Router project with `output: "standalone"` enabled, so it can be deployed to any platform that runs Node.js, or as a static-friendly serverless target.

## Required environment variables

Set these on every platform (see `.env.local.example`):

- `TMDB_API_READ_ACCESS_TOKEN` — TMDB v4 read access token (required for all API calls)
- `TMDB_API_KEY` — TMDB v3 API key (kept for reference/back-compat)
- `NEXT_PUBLIC_SITE_URL` — the public URL of your deployment (used for SEO, sitemap, OAuth callback)
- `NEXT_PUBLIC_TMDB_IMAGE_BASE` — defaults to `https://image.tmdb.org/t/p`

For the TMDB account login flow to work, `NEXT_PUBLIC_SITE_URL` must match the domain you deploy to, since it's used as the OAuth callback URL.

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

A production-ready multi-stage `Dockerfile` and `docker-compose.yml` are included.

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

These all support "deploy from Dockerfile" directly — point the platform at this repo, set the environment variables, and it will build and run the same container.

## Hostinger (shared/Node.js hosting, non-Docker)

If deploying to a Node.js-capable Hostinger plan without Docker:

```bash
npm ci
npm run build
node .next/standalone/server.js
```

Copy `.next/standalone`, `.next/static` (into `.next/standalone/.next/static`), and `public` (into `.next/standalone/public`) to the server, then run `server.js` with a process manager (PM2) behind the hosting panel's Node.js app runner.

## Notes

- All TMDB requests are server-side only (API keys never reach the browser).
- Sitemap (`/sitemap.xml`) and `robots.txt` are generated dynamically and respect `NEXT_PUBLIC_SITE_URL`.
- The TMDB account login callback is `${NEXT_PUBLIC_SITE_URL}/api/auth/callback` — no manual redirect URI registration is needed since TMDB's request-token flow accepts a dynamic `redirect_to` parameter.
