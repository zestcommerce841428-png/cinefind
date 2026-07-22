import { NextResponse, type NextRequest } from "next/server";

// In-memory sliding-window rate limiter. This is scoped to a single server
// process/instance — fine for a single container or Vercel's per-region
// isolate under normal traffic, but for multi-instance deployments behind a
// load balancer, swap this for a shared store (Redis/Upstash) so limits are
// enforced consistently across instances.
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;
const hits = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  return `${ip}:${new URL(request.url).pathname}`;
}

function isRateLimited(request: NextRequest): boolean {
  const key = getClientKey(request);
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const RATE_LIMITED_PREFIXES = ["/api/guest/", "/api/search/", "/api/account/", "/api/lists"];

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

  if (RATE_LIMITED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (isRateLimited(request)) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
