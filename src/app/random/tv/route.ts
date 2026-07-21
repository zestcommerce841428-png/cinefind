import { NextResponse } from "next/server";
import { getPopularTv } from "@/lib/tmdb";

export async function GET(request: Request) {
  const page = Math.floor(Math.random() * 20) + 1;
  const data = await getPopularTv(page);
  const show = data.results[Math.floor(Math.random() * data.results.length)];
  return NextResponse.redirect(new URL(show ? `/tv/${show.id}` : "/tv", request.url));
}
