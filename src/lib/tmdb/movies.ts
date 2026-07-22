import { tmdbFetch } from "./fetcher";
import type {
  Credits,
  Images,
  Keyword,
  MovieDetails,
  MovieSummary,
  PaginatedResponse,
  Review,
  Video,
  WatchProviderResponse,
} from "./types";

export const getMovieDetails = (id: number | string) =>
  tmdbFetch<MovieDetails>(`/movie/${id}`, { params: { append_to_response: "" } });

export const getMovieCredits = (id: number | string) =>
  tmdbFetch<Credits>(`/movie/${id}/credits`);

export const getMovieVideos = (id: number | string) =>
  tmdbFetch<{ id: number; results: Video[] }>(`/movie/${id}/videos`);

export const getMovieImages = (id: number | string) =>
  tmdbFetch<Images & { id: number }>(`/movie/${id}/images`, {
    params: { include_image_language: "en,null" },
  });

export const getMovieReviews = (id: number | string, page = 1) =>
  tmdbFetch<PaginatedResponse<Review> & { id: number }>(`/movie/${id}/reviews`, {
    params: { page },
  });

export const getMovieSimilar = (id: number | string, page = 1) =>
  tmdbFetch<PaginatedResponse<MovieSummary>>(`/movie/${id}/similar`, { params: { page } });

export const getMovieRecommendations = (id: number | string, page = 1) =>
  tmdbFetch<PaginatedResponse<MovieSummary>>(`/movie/${id}/recommendations`, {
    params: { page },
  });

export const getMovieKeywords = (id: number | string) =>
  tmdbFetch<{ id: number; keywords: Keyword[] }>(`/movie/${id}/keywords`);

export const getMovieWatchProviders = (id: number | string) =>
  tmdbFetch<WatchProviderResponse>(`/movie/${id}/watch/providers`, { revalidate: 86400 });

export const getMovieExternalIds = (id: number | string) =>
  tmdbFetch<{
    imdb_id: string | null;
    facebook_id: string | null;
    instagram_id: string | null;
    twitter_id: string | null;
    wikidata_id: string | null;
  }>(`/movie/${id}/external_ids`);

export const getMovieReleaseDates = (id: number | string) =>
  tmdbFetch<{
    id: number;
    results: { iso_3166_1: string; release_dates: { certification: string; type: number }[] }[];
  }>(`/movie/${id}/release_dates`);

export const getMovieTranslations = (id: number | string) =>
  tmdbFetch<{ id: number; translations: { iso_3166_1: string; iso_639_1: string; name: string; english_name: string }[] }>(
    `/movie/${id}/translations`
  );

export const getMovieLists = (id: number | string, page = 1) =>
  tmdbFetch<PaginatedResponse<{ id: number; name: string; description: string; item_count: number }>>(
    `/movie/${id}/lists`,
    { params: { page } }
  );

export const getPopularMovies = (page = 1) =>
  tmdbFetch<PaginatedResponse<MovieSummary>>("/movie/popular", { params: { page } });

export const getTopRatedMovies = (page = 1) =>
  tmdbFetch<PaginatedResponse<MovieSummary>>("/movie/top_rated", { params: { page } });

export const getNowPlayingMovies = (page = 1, region?: string) =>
  tmdbFetch<PaginatedResponse<MovieSummary>>("/movie/now_playing", { params: { page, region } });

export const getUpcomingMovies = (page = 1) =>
  tmdbFetch<PaginatedResponse<MovieSummary>>("/movie/upcoming", { params: { page } });

export const getLatestMovie = () => tmdbFetch<MovieDetails>("/movie/latest", { revalidate: 3600 });

export const getMovieChanges = (id: number | string) =>
  tmdbFetch<{ changes: { key: string; items: unknown[] }[] }>(`/movie/${id}/changes`, {
    revalidate: 600,
  });

export const getMovieGenres = () =>
  tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/movie/list", {
    revalidate: 86400,
  });

export const getMovieAlternativeTitles = (id: number | string) =>
  tmdbFetch<{ id: number; titles: { iso_3166_1: string; title: string; type: string }[] }>(
    `/movie/${id}/alternative_titles`
  );

export interface AccountStates {
  id: number;
  favorite: boolean;
  rated: boolean | { value: number };
  watchlist: boolean;
}

export const getMovieAccountStates = (id: number | string, sessionId: string) =>
  tmdbFetch<AccountStates>(`/movie/${id}/account_states`, {
    params: { session_id: sessionId },
    revalidate: 0,
  });

export const getMovieCertifications = () =>
  tmdbFetch<{ certifications: Record<string, { certification: string; meaning: string; order: number }[]> }>(
    "/certification/movie/list",
    { revalidate: 86400 }
  );
