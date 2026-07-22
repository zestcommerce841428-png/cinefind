import { NextResponse } from "next/server";
import { searchPeople } from "@/lib/tmdb";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ results: [] });

  const data = await searchPeople(query);
  const results = data.results.slice(0, 8).map((p) => ({
    id: p.id,
    title: p.name,
    year: p.known_for_department ?? "",
    poster_path: p.profile_path,
  }));
  return NextResponse.json({ results });
}
