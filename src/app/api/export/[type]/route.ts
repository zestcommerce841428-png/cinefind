import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import {
  getAccountDetails,
  getFavoriteMovies,
  getFavoriteTv,
  getWatchlistMovies,
  getWatchlistTv,
  getRatedMovies,
  getRatedTv,
} from "@/lib/tmdb";
import type { MovieSummary, TvSummary } from "@/lib/tmdb/types";

type ExportType = "favorites" | "watchlist" | "ratings";
const VALID_TYPES: ExportType[] = ["favorites", "watchlist", "ratings"];
const MAX_PAGES = 10;

async function fetchAllPages<T>(loader: (page: number) => Promise<{ results: T[]; total_pages: number }>) {
  const first = await loader(1);
  const pages = Math.min(first.total_pages, MAX_PAGES);
  const rest = await Promise.all(
    Array.from({ length: Math.max(pages - 1, 0) }, (_, i) => loader(i + 2))
  );
  return [...first.results, ...rest.flatMap((r) => r.results)];
}

function toRow(item: (MovieSummary | TvSummary) & { rating?: number }, mediaType: "movie" | "tv") {
  const isMovie = mediaType === "movie";
  const movie = item as MovieSummary & { rating?: number };
  const tv = item as TvSummary & { rating?: number };
  return {
    media_type: mediaType,
    id: item.id,
    title: isMovie ? movie.title : tv.name,
    release_date: isMovie ? movie.release_date : tv.first_air_date,
    vote_average: item.vote_average,
    your_rating: item.rating ?? null,
    overview: item.overview,
  };
}

function toCsv(rows: ReturnType<typeof toRow>[]) {
  const headers = ["media_type", "id", "title", "release_date", "vote_average", "your_rating", "overview"];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/\n/g, " ")}"`;
  const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h as keyof typeof r])).join(","))];
  return lines.join("\n");
}

export async function GET(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!VALID_TYPES.includes(type as ExportType)) {
    return NextResponse.json({ error: "Unknown export type" }, { status: 404 });
  }

  const sessionId = await getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const format = new URL(request.url).searchParams.get("format") === "csv" ? "csv" : "json";
  const account = await getAccountDetails(sessionId);

  let movies: MovieSummary[];
  let tv: TvSummary[];
  if (type === "favorites") {
    [movies, tv] = await Promise.all([
      fetchAllPages((p) => getFavoriteMovies(account.id, sessionId, p)),
      fetchAllPages((p) => getFavoriteTv(account.id, sessionId, p)),
    ]);
  } else if (type === "watchlist") {
    [movies, tv] = await Promise.all([
      fetchAllPages((p) => getWatchlistMovies(account.id, sessionId, p)),
      fetchAllPages((p) => getWatchlistTv(account.id, sessionId, p)),
    ]);
  } else {
    [movies, tv] = await Promise.all([
      fetchAllPages((p) => getRatedMovies(account.id, sessionId, p)),
      fetchAllPages((p) => getRatedTv(account.id, sessionId, p)),
    ]);
  }

  const rows = [...movies.map((m) => toRow(m, "movie")), ...tv.map((t) => toRow(t, "tv"))];

  if (format === "csv") {
    return new NextResponse(toCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="cinefind-${type}.csv"`,
      },
    });
  }

  return new NextResponse(JSON.stringify(rows, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="cinefind-${type}.json"`,
    },
  });
}
