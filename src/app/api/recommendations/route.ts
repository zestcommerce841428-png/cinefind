import { NextResponse } from "next/server";
import { getMovieRecommendations, getTvRecommendations } from "@/lib/tmdb";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");
  if ((type !== "movie" && type !== "tv") || !id) {
    return NextResponse.json({ results: [] }, { status: 400 });
  }

  const data = type === "movie" ? await getMovieRecommendations(id) : await getTvRecommendations(id);
  return NextResponse.json({ results: data.results.slice(0, 12) });
}
