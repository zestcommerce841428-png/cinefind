import { NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ results: [] });

  const data = await searchMulti(query);
  const results = data.results
    .filter((r) => r.media_type !== undefined)
    .slice(0, 8)
    .map((r) => {
      const isMovie = r.media_type === "movie";
      const isPerson = r.media_type === "person";
      const movie = r as { title?: string; release_date?: string; poster_path: string | null };
      const tv = r as { name?: string; first_air_date?: string; poster_path: string | null };
      const person = r as { name?: string; profile_path: string | null };
      return {
        id: r.id,
        mediaType: r.media_type,
        title: isPerson ? person.name : isMovie ? movie.title : tv.name,
        year: isPerson
          ? undefined
          : (isMovie ? movie.release_date : tv.first_air_date)?.slice(0, 4),
        posterPath: isPerson ? person.profile_path : movie.poster_path,
      };
    });
  return NextResponse.json({ results });
}
