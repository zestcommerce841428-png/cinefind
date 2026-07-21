import { NextResponse } from "next/server";
import { createRequestToken } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { request_token } = await createRequestToken();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const redirectTo = `${siteUrl}/api/auth/callback`;

  const approveUrl = `https://www.themoviedb.org/authenticate/${request_token}?redirect_to=${encodeURIComponent(
    redirectTo
  )}`;

  return NextResponse.redirect(approveUrl);
}
