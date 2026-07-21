import { NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ results: [] });

  const data = await searchMovies(query);
  const results = data.results.slice(0, 8).map((m) => ({
    id: m.id,
    title: m.title,
    year: m.release_date?.slice(0, 4) ?? "",
    poster_path: m.poster_path,
  }));
  return NextResponse.json({ results });
}
