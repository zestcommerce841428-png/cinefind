import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * On-demand ISR revalidation. Call this after content changes (e.g. a new
 * blog post is published, or you want to force-refresh a stale movie page)
 * without waiting for the time-based revalidate window to expire.
 *
 * Usage: POST /api/revalidate?secret=YOUR_SECRET&path=/movie/550
 *    or: POST /api/revalidate?secret=YOUR_SECRET&tag=blog-posts
 *
 * Requires REVALIDATE_SECRET to be set — without it, the endpoint is disabled.
 */
export async function POST(request: Request) {
  const configuredSecret = process.env.REVALIDATE_SECRET;
  if (!configuredSecret) {
    return NextResponse.json(
      { success: false, message: "REVALIDATE_SECRET is not configured on the server" },
      { status: 501 }
    );
  }

  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  if (secret !== configuredSecret) {
    return NextResponse.json({ success: false, message: "Invalid secret" }, { status: 401 });
  }

  const path = url.searchParams.get("path");
  const tag = url.searchParams.get("tag");

  if (!path && !tag) {
    return NextResponse.json(
      { success: false, message: "Provide a ?path= or ?tag= query parameter" },
      { status: 400 }
    );
  }

  if (path) revalidatePath(path);
  if (tag) revalidateTag(tag, "max");

  return NextResponse.json({ success: true, revalidated: { path, tag }, now: Date.now() });
}
