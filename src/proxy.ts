import { NextResponse, type NextRequest } from "next/server";

// In-memory sliding-window rate limiter. This is scoped to a single server
// process/instance — fine for a single container or Vercel's per-region
// isolate under normal traffic, but for multi-instance deployments behind a
// load balancer, swap this for a shared store (Redis/Upstash) so limits are
// enforced consistently across instances.
const WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

// Read-only browsing/search traffic (autocomplete, command palette, quick
// search) is generously capped — it just proxies public TMDB catalog data,
// so there's no reason to throttle normal usage. Mutating account/list
// endpoints keep a tight cap since they write to a user's TMDB account.
const RATE_LIMITS: { prefix: string; max: number }[] = [
  { prefix: "/api/search/", max: 600 },
  { prefix: "/api/six-degrees", max: 120 },
  { prefix: "/api/recommendations", max: 300 },
  { prefix: "/api/guest/", max: 60 },
  { prefix: "/api/account/", max: 60 },
  { prefix: "/api/lists", max: 60 },
];

function getClientKey(request: NextRequest, prefix: string): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  return `${ip}:${prefix}`;
}

function isRateLimited(request: NextRequest, prefix: string, max: number): boolean {
  const key = getClientKey(request, prefix);
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > max;
}

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function proxy(request: NextRequest) {
  const { pathname } = new URL(request.url);

  // CSRF mitigation: reject cross-origin state-changing requests to our API.
  // Same-origin fetches from the app (and simple GETs) are unaffected.
  if (MUTATING_METHODS.has(request.method) && pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    if (origin) {
      const requestHost = request.headers.get("host");
      const originHost = new URL(origin).host;
      if (requestHost && originHost !== requestHost) {
        return NextResponse.json(
          { success: false, message: "Cross-origin request blocked" },
          { status: 403 }
        );
      }
    }
  }

  const limit = RATE_LIMITS.find((r) => pathname.startsWith(r.prefix));
  if (limit && isRateLimited(request, limit.prefix, limit.max)) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
