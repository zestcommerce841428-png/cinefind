import { NextResponse } from "next/server";
import { searchTv } from "@/lib/tmdb";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ results: [] });

  const data = await searchTv(query);
  const results = data.results.slice(0, 8).map((t) => ({
    id: t.id,
    title: t.name,
    year: t.first_air_date?.slice(0, 4) ?? "",
    poster_path: t.poster_path,
  }));
  return NextResponse.json({ results });
}
