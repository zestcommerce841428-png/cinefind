import { NextResponse } from "next/server";
import { getPopularMovies, discoverMovies } from "@/lib/tmdb";

export async function GET(request: Request) {
  const genre = new URL(request.url).searchParams.get("genre");
  const page = Math.floor(Math.random() * 20) + 1;

  const data = genre
    ? await discoverMovies({ with_genres: genre, page, "vote_count.gte": 50 })
    : await getPopularMovies(page);
  const movie = data.results[Math.floor(Math.random() * data.results.length)];
  return NextResponse.redirect(new URL(movie ? `/movie/${movie.id}` : "/movies", request.url));
}
