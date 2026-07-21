<div align="center">

# 🎬 CineFind

**A fast, accessible, SEO-first movie & TV discovery platform built on Next.js 16 and the TMDB API.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![MUI](https://img.shields.io/badge/MUI-v9-007FFF?logo=mui)](https://mui.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![TMDB](https://img.shields.io/badge/Powered%20by-TMDB-01D277?logo=themoviedatabase)](https://www.themoviedb.org)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](#license)

[Features](#-features) · [Getting Started](#-getting-started) · [Deployment](#-deployment) · [Architecture](#-architecture)

</div>

---

## Overview

CineFind is a production-grade movie and TV discovery application covering the full breadth of [The Movie Database (TMDB) API](https://developer.themoviedb.org/reference) — over **100 endpoint integrations** across movies, TV, people, search, discovery, watch providers, collections, and account management — wrapped in a fast, accessible, SEO-optimized Next.js 16 App Router frontend built with Material UI v9.

It's designed to be genuinely deployable, not a demo: server-only API keys, ISR caching, dynamic sitemaps, structured data, a Dockerized production build, and deployment recipes for Vercel, Netlify, and any VPS.

## ✨ Features

### Content & Discovery
- **Universal search** — debounced multi-search across movies, TV, and people with tabbed filtering and pagination
- **Advanced discovery** — filter by genre, year, sort order, and watch provider for both movies and TV
- **Full media detail pages** — cast & crew, trailers/videos, photo galleries, reviews, similar titles, recommendations, keywords, alternative titles, translations, watch providers by region
- **TV drill-down** — seasons, episodes, episode groups, content ratings
- **People pages** — biography, full filmography (movies + TV), photo galleries, external IDs
- **Browse hubs** — trending (day/week, all/movie/tv/person), genres, collections, companies, networks, watch-provider directory, content-rating reference by country
- **Find by external ID** — look up any title via its IMDb ID
- **MDX-powered blog/CMS** with RSS feed, fully git-based content

### Accounts & Personalization
- **Real TMDB OAuth session flow** (request token → session), not a mock
- Favorites, watchlists, ratings — synced to your actual TMDB account, with optimistic UI
- **Guest session support** — rate titles anonymously without signing in
- Custom TMDB lists — create, view, and manage

### Advanced Theming Engine
- **72 built-in theme presets** across 8 design families (Classic, Vibrant, Pastel, Dark/Editor, Nature, Cinema, Monochrome, Streaming-inspired)
- Each category drives genuinely distinct **typography, corner radius, spacing density, and elevation style** — not just a color swap (coder-dark themes get monospace headings, Cinema themes get condensed display type, Vibrant/Brand themes get a real glow-on-hover effect)
- Light/dark mode, plus **automatic time-of-day switching**

### Accessibility Suite
- Text scaling, line/letter/word spacing, dyslexia-friendly font, reading mask & guide, narrow column mode
- **Color-vision-deficiency simulation** via real SVG `feColorMatrix` filters (protanopia, deuteranopia, tritanopia, achromatopsia)
- High contrast, invert, grayscale, sepia, saturation/brightness/contrast controls
- Reduced motion, paused carousels, large click targets, big cursor, strong focus rings
- **Focus Mode** (distraction-free reading layout) and **full-page text-to-speech** with play/pause/skip/speed control
- 6 one-click accessibility profiles (Low Vision, Dyslexia, ADHD, Motor, Photosensitive, Senior) — all settings persisted locally

### SEO & Platform
- Dynamic `sitemap.xml` and `robots.txt`, per-page metadata, Open Graph/Twitter cards, JSON-LD structured data (Movie, TVSeries, Person, BlogPosting)
- OpenSearch browser-search integration, blog RSS feed
- Fully responsive, keyboard-accessible, semantic markup with skip links

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack, Server Components) |
| UI | [Material UI v9](https://mui.com) with a custom dynamic theming engine |
| Language | TypeScript |
| Data | [TMDB API](https://developer.themoviedb.org/reference) (v3/v4), server-only fetch with ISR |
| Content | MDX (`next-mdx-remote`) + `gray-matter` for the blog/CMS |
| Auth | TMDB session-based OAuth (request token → session), httpOnly cookies |
| Deployment | Docker (multi-stage, `output: standalone`), Vercel, Netlify |

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A free [TMDB API account](https://www.themoviedb.org/settings/api) (v4 read access token)

### Installation

```bash
git clone https://github.com/<your-username>/cinefind.git
cd cinefind
npm install
```

### Configure environment variables

Copy the example file and fill in your TMDB credentials:

```bash
cp .env.local.example .env.local
```

```env
TMDB_API_KEY=your_tmdb_v3_api_key
TMDB_API_READ_ACCESS_TOKEN=your_tmdb_v4_read_access_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Windows note:** the `dev`/`start` scripts force IPv4-first DNS resolution (`NODE_OPTIONS=--dns-result-order=ipv4first`) to avoid a common `ECONNRESET` issue caused by broken IPv6 routing on some networks when calling `api.themoviedb.org`.

## 📦 Deployment

CineFind builds with `output: "standalone"` and ships with ready-to-use configs:

| Target | How |
|---|---|
| **Vercel** | Import the repo — zero config needed |
| **Netlify** | `netlify.toml` included with `@netlify/plugin-nextjs` |
| **Docker / any VPS** (DigitalOcean, Hostinger, AWS, GCP) | `docker compose up --build`, or use the included `Dockerfile` directly |
| **Node.js hosting** | `npm run build && node .next/standalone/server.js` |

Full instructions, including required environment variables per platform, are in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## 🏗 Architecture

```
src/
├── app/                  # Next.js App Router routes (~80 routes)
│   ├── movie/[id]/       # Movie details + cast/images/videos/reviews/similar sub-pages
│   ├── tv/[id]/          # TV details + seasons/episodes/episode-groups
│   ├── person/[id]/      # Person details, credits, images
│   ├── account/          # Favorites, watchlist, ratings, custom lists
│   ├── api/              # Route handlers: auth, account actions, guest sessions
│   └── blog/             # MDX-powered blog with RSS
├── components/
│   ├── media/            # Cards, rows, carousels, cast/video/review UI
│   ├── global/            # Theme panel, accessibility panel, scroll controls
│   └── layout/            # Navbar, footer, skip link
├── lib/
│   └── tmdb/              # Typed TMDB API client (100+ endpoint functions)
├── theme/                 # 72-preset theming engine, category-driven styling
└── content/blog/          # MDX blog posts
```

The TMDB client (`src/lib/tmdb/`) is organized by domain — `movies.ts`, `tv.ts`, `people.ts`, `search-discover.ts`, `auth.ts` — each exporting typed, cached fetch functions built on a shared `tmdbFetch` wrapper with clear network-vs-API error distinction.

## 🔒 Security

- TMDB API keys are **server-only** — never exposed to the browser
- Sessions use httpOnly, secure, sameSite cookies
- No secrets are committed to the repository (`.env*` is gitignored)

## 📄 License

MIT — see [`LICENSE`](./LICENSE).

## 🙏 Acknowledgements

This product uses the TMDB API but is not endorsed or certified by [TMDB](https://www.themoviedb.org/).

---

<div align="center">
Built with Next.js, MUI, and TMDB.
</div>
