import { NextResponse } from "next/server";
import { searchCompanies } from "@/lib/tmdb";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ results: [] });

  const data = await searchCompanies(query);
  const results = data.results.slice(0, 8).map((c) => ({
    id: c.id,
    title: c.name,
    year: "",
    poster_path: c.logo_path,
  }));
  return NextResponse.json({ results });
}
