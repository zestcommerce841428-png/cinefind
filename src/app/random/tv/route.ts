import { NextResponse } from "next/server";
import { getPopularTv, discoverTv } from "@/lib/tmdb";

export async function GET(request: Request) {
  const genre = new URL(request.url).searchParams.get("genre");
  const page = Math.floor(Math.random() * 20) + 1;

  const data = genre
    ? await discoverTv({ with_genres: genre, page })
    : await getPopularTv(page);
  const show = data.results[Math.floor(Math.random() * data.results.length)];
  return NextResponse.redirect(new URL(show ? `/tv/${show.id}` : "/tv", request.url));
}
