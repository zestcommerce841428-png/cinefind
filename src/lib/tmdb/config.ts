export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE =
  process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE ?? "https://image.tmdb.org/t/p";

export type ImageSize =
  | "w45"
  | "w92"
  | "w154"
  | "w185"
  | "w200"
  | "w300"
  | "w342"
  | "w400"
  | "w500"
  | "w780"
  | "w1280"
  | "h632"
  | "original";

export function tmdbImage(path: string | null | undefined, size: ImageSize = "w500") {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getReadAccessToken() {
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "TMDB_API_READ_ACCESS_TOKEN is not set. Copy .env.local.example to .env.local and add your TMDB v4 read access token."
    );
  }
  return token;
}
