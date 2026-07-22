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

export type ExportType = "favorites" | "watchlist" | "ratings";
export const EXPORT_TYPES: ExportType[] = ["favorites", "watchlist", "ratings"];
const MAX_PAGES = 100;

async function fetchAllPages<T>(loader: (page: number) => Promise<{ results: T[]; total_pages: number }>) {
  const first = await loader(1);
  const pages = Math.min(first.total_pages, MAX_PAGES);
  const rest = await Promise.all(Array.from({ length: Math.max(pages - 1, 0) }, (_, i) => loader(i + 2)));
  return [...first.results, ...rest.flatMap((r) => r.results)];
}

export interface ExportRow {
  media_type: "movie" | "tv";
  id: number;
  title: string | undefined;
  release_date: string | undefined;
  vote_average: number;
  your_rating: number | null;
  overview: string;
}

function toRow(item: (MovieSummary | TvSummary) & { rating?: number }, mediaType: "movie" | "tv"): ExportRow {
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

export function toCsv(rows: ExportRow[]) {
  const headers: (keyof ExportRow)[] = [
    "media_type",
    "id",
    "title",
    "release_date",
    "vote_average",
    "your_rating",
    "overview",
  ];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""').replace(/\n/g, " ")}"`;
  const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))];
  return lines.join("\n");
}

export async function fetchExportRows(type: ExportType, sessionId: string): Promise<ExportRow[]> {
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

  return [...movies.map((m) => toRow(m, "movie")), ...tv.map((t) => toRow(t, "tv"))];
}
