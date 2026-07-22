import { NextResponse } from "next/server";
import { getMovieVideos, getTvVideos } from "@/lib/tmdb";

function pickTrailerKey(videos: { site: string; type: string; key: string; official: boolean }[]) {
  const youtube = videos.filter((v) => v.site === "YouTube");
  const trailer =
    youtube.find((v) => v.type === "Trailer" && v.official) ??
    youtube.find((v) => v.type === "Trailer") ??
    youtube.find((v) => v.type === "Teaser") ??
    youtube[0];
  return trailer?.key ?? null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");
  if ((type !== "movie" && type !== "tv") || !id) {
    return NextResponse.json({ key: null }, { status: 400 });
  }

  const data = type === "movie" ? await getMovieVideos(id) : await getTvVideos(id);
  return NextResponse.json({ key: pickTrailerKey(data.results) });
}
