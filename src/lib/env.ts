import { z } from "zod";

const envSchema = z.object({
  TMDB_API_READ_ACCESS_TOKEN: z
    .string()
    .min(20, "TMDB_API_READ_ACCESS_TOKEN is missing or looks too short to be a real TMDB v4 token"),
  TMDB_API_KEY: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a full URL, e.g. https://example.com")
    .optional(),
  NEXT_PUBLIC_TMDB_IMAGE_BASE: z.string().url().optional(),
  REVALIDATE_SECRET: z.string().optional(),
});

/**
 * Validates required environment variables and fails fast with a clear,
 * actionable error instead of letting the app boot into a broken state
 * where every TMDB call throws a cryptic runtime error.
 */
export function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(
      `\n\nInvalid or missing environment variables:\n${issues}\n\n` +
        "Copy .env.local.example to .env.local and fill in your TMDB credentials.\n"
    );
  }
  return result.data;
}
