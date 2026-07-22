"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Reports Core Web Vitals (LCP, CLS, INP, FCP, TTFB) to the console in
 * development for quick perf sanity checks. In production, wire this up to
 * a real analytics endpoint (e.g. `navigator.sendBeacon('/api/vitals', ...)`
 * or a provider SDK) — the collection point is already centralized here.
 */
export default function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[web-vitals] ${metric.name}:`, Math.round(metric.value), metric.rating);
    }
  });

  return null;
}
