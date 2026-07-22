import { NextResponse } from "next/server";
import { getConfiguration } from "@/lib/tmdb";

export async function GET() {
  const startedAt = Date.now();
  let tmdbReachable = false;
  let tmdbError: string | undefined;

  try {
    await Promise.race([
      getConfiguration(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000)),
    ]);
    tmdbReachable = true;
  } catch (err) {
    tmdbError = err instanceof Error ? err.message : "Unknown error";
  }

  const body = {
    status: tmdbReachable ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    latencyMs: Date.now() - startedAt,
    checks: {
      tmdb: tmdbReachable ? "ok" : "unreachable",
      ...(tmdbError ? { tmdbError } : {}),
    },
  };

  // 200 even when degraded: the app itself is up (this endpoint is what an
  // uptime monitor / Docker HEALTHCHECK / load balancer probes), it's just
  // upstream TMDB that's unreachable. Consumers should read `status`.
  return NextResponse.json(body, { status: 200 });
}
