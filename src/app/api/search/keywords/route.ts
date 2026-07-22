import { NextResponse } from "next/server";
import { searchKeywords } from "@/lib/tmdb";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ results: [] });

  const data = await searchKeywords(query);
  const results = data.results.slice(0, 10).map((k) => ({ id: k.id, name: k.name }));
  return NextResponse.json({ results });
}
