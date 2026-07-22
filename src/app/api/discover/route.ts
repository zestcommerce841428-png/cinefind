import { NextResponse } from "next/server";
import { discoverMovies, discoverTv } from "@/lib/tmdb";
import type { DiscoverMovieParams, DiscoverTvParams } from "@/lib/tmdb/search-discover";

// Generic passthrough used by ListingPage's "Load more" infinite scroll — it
// forwards whatever discover query the page was already built with, just
// bumping the page number, so there's no artificial cap beyond TMDB's own
// (500 pages / ~10,000 results per query).
export async function GET(request: Request) {
  const url = new URL(request.url);
  const mediaType = url.searchParams.get("mediaType");
  if (mediaType !== "movie" && mediaType !== "tv") {
    return NextResponse.json({ error: "mediaType must be 'movie' or 'tv'" }, { status: 400 });
  }

  const params: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    if (key !== "mediaType") params[key] = value;
  });

  const data =
    mediaType === "movie"
      ? await discoverMovies(params as unknown as DiscoverMovieParams)
      : await discoverTv(params as unknown as DiscoverTvParams);

  return NextResponse.json(data);
}
