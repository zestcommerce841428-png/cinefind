export async function register() {
  // Skip during `next build`'s static analysis pass and on the edge runtime
  // (middleware) — only validate once, in the actual Node.js server process.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv } = await import("@/lib/env");
    validateEnv();
  }
}
