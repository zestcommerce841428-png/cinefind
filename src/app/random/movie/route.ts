import { NextResponse } from "next/server";
import { getPopularMovies } from "@/lib/tmdb";

export async function GET(request: Request) {
  const page = Math.floor(Math.random() * 20) + 1;
  const data = await getPopularMovies(page);
  const movie = data.results[Math.floor(Math.random() * data.results.length)];
  return NextResponse.redirect(new URL(movie ? `/movie/${movie.id}` : "/movies", request.url));
}
