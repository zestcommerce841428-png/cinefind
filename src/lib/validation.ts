import { NextResponse } from "next/server";
import { z } from "zod";

export const mediaTypeSchema = z.enum(["movie", "tv"]);

export const favoriteBodySchema = z.object({
  mediaType: mediaTypeSchema,
  mediaId: z.number().int().positive(),
  favorite: z.boolean(),
});

export const watchlistBodySchema = z.object({
  mediaType: mediaTypeSchema,
  mediaId: z.number().int().positive(),
  watchlist: z.boolean(),
});

export const rateBodySchema = z.object({
  mediaType: mediaTypeSchema,
  mediaId: z.number().int().positive(),
  value: z.number().min(0.5).max(10),
});

export const deleteRatingBodySchema = z.object({
  mediaType: mediaTypeSchema,
  mediaId: z.number().int().positive(),
});

export const createListBodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(1000).optional().default(""),
});

export const listItemBodySchema = z.object({
  mediaId: z.number().int().positive(),
});

/**
 * Parses and validates a request's JSON body against a zod schema.
 * On success returns the typed data; on failure returns `{ error }` where
 * `error` is a ready-to-return 400 NextResponse — callers should check for
 * and return it immediately.
 */
export async function parseJsonBody<T extends z.ZodTypeAny>(
  request: Request,
  schema: T
): Promise<{ data: z.infer<T>; error?: undefined } | { data?: undefined; error: NextResponse }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { error: NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 }) };
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    return {
      error: NextResponse.json(
        { success: false, message: "Invalid request body", issues: result.error.issues },
        { status: 400 }
      ),
    };
  }

  return { data: result.data };
}
