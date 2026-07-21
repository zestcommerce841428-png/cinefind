import { tmdbFetch } from "./fetcher";
import type {
  Collection,
  Company,
  Image,
  MovieSummary,
  Network,
  PaginatedResponse,
  PersonSummary,
  Review,
  TvSummary,
} from "./types";

export type ExternalIdSource =
  | "imdb_id"
  | "facebook_id"
  | "instagram_id"
  | "tvdb_id"
  | "tiktok_id"
  | "twitter_id"
  | "wikidata_id"
  | "youtube_id";

export interface FindResults {
  movie_results: MovieSummary[];
  tv_results: TvSummary[];
  person_results: PersonSummary[];
  tv_episode_results: unknown[];
  tv_season_results: unknown[];
}

export const findByExternalId = (externalId: string, source: ExternalIdSource = "imdb_id") =>
  tmdbFetch<FindResults>(`/find/${externalId}`, { params: { external_source: source } });

export interface CreditDetails {
  credit_type: string;
  department: string;
  job: string;
  media: (MovieSummary | TvSummary) & { character?: string };
  media_type: "movie" | "tv";
  id: string;
  person: PersonSummary;
}

export const getCreditDetails = (creditId: string) =>
  tmdbFetch<CreditDetails>(`/credit/${creditId}`);

export const getReviewDetails = (reviewId: string) =>
  tmdbFetch<Review & { media_id: number; media_title: string; media_type: "movie" | "tv" }>(
    `/review/${reviewId}`
  );

export const searchMovies = (query: string, page = 1, year?: number) =>
  tmdbFetch<PaginatedResponse<MovieSummary>>("/search/movie", {
    params: { query, page, year, include_adult: false },
    revalidate: 300,
  });

export const searchTv = (query: string, page = 1, firstAirDateYear?: number) =>
  tmdbFetch<PaginatedResponse<TvSummary>>("/search/tv", {
    params: { query, page, first_air_date_year: firstAirDateYear },
    revalidate: 300,
  });

export const searchPeople = (query: string, page = 1) =>
  tmdbFetch<PaginatedResponse<PersonSummary>>("/search/person", {
    params: { query, page },
    revalidate: 300,
  });

export const searchMulti = (query: string, page = 1) =>
  tmdbFetch<PaginatedResponse<MovieSummary | TvSummary | PersonSummary>>("/search/multi", {
    params: { query, page, include_adult: false },
    revalidate: 300,
  });

export const searchCollections = (query: string, page = 1) =>
  tmdbFetch<PaginatedResponse<Collection>>("/search/collection", { params: { query, page } });

export const searchCompanies = (query: string, page = 1) =>
  tmdbFetch<PaginatedResponse<Company>>("/search/company", { params: { query, page } });

export const searchKeywords = (query: string, page = 1) =>
  tmdbFetch<PaginatedResponse<{ id: number; name: string }>>("/search/keyword", {
    params: { query, page },
  });

export interface DiscoverMovieParams {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  without_genres?: string;
  primary_release_year?: number;
  "primary_release_date.gte"?: string;
  "primary_release_date.lte"?: string;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;
  "vote_count.gte"?: number;
  with_original_language?: string;
  with_watch_providers?: string;
  watch_region?: string;
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
  with_keywords?: string;
  with_companies?: string;
  include_adult?: boolean;
  certification?: string;
  "certification.lte"?: string;
  "certification.gte"?: string;
  certification_country?: string;
}

export const discoverMovies = (params: DiscoverMovieParams = {}) =>
  tmdbFetch<PaginatedResponse<MovieSummary>>("/discover/movie", {
    params: { sort_by: "popularity.desc", include_adult: false, ...params },
  });

export interface DiscoverTvParams {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  without_genres?: string;
  first_air_date_year?: number;
  "vote_average.gte"?: number;
  with_original_language?: string;
  with_watch_providers?: string;
  watch_region?: string;
  with_networks?: string;
  with_keywords?: string;
}

export const discoverTv = (params: DiscoverTvParams = {}) =>
  tmdbFetch<PaginatedResponse<TvSummary>>("/discover/tv", {
    params: { sort_by: "popularity.desc", ...params },
  });

export type TrendingMediaType = "all" | "movie" | "tv" | "person";
export type TrendingWindow = "day" | "week";

export const getTrending = (mediaType: TrendingMediaType = "all", window: TrendingWindow = "day", page = 1) =>
  tmdbFetch<PaginatedResponse<MovieSummary | TvSummary | PersonSummary>>(
    `/trending/${mediaType}/${window}`,
    { params: { page } }
  );

export const getCollectionDetails = (id: number | string) =>
  tmdbFetch<Collection>(`/collection/${id}`);

export const getCollectionImages = (id: number | string) =>
  tmdbFetch<{ id: number; backdrops: Image[]; posters: Image[] }>(`/collection/${id}/images`);

export const getCollectionTranslations = (id: number | string) =>
  tmdbFetch<{ id: number; translations: unknown[] }>(`/collection/${id}/translations`);

export const getCompanyDetails = (id: number | string) => tmdbFetch<Company>(`/company/${id}`);

export const getCompanyAlternativeNames = (id: number | string) =>
  tmdbFetch<{ id: number; results: { name: string; type: string }[] }>(
    `/company/${id}/alternative_names`
  );

export const getCompanyImages = (id: number | string) =>
  tmdbFetch<{ id: number; logos: Image[] }>(`/company/${id}/images`);

export const getNetworkDetails = (id: number | string) => tmdbFetch<Network>(`/network/${id}`);

export const getNetworkAlternativeNames = (id: number | string) =>
  tmdbFetch<{ id: number; results: { name: string; type: string }[] }>(
    `/network/${id}/alternative_names`
  );

export const getNetworkImages = (id: number | string) =>
  tmdbFetch<{ id: number; logos: Image[] }>(`/network/${id}/images`);

export const getKeywordDetails = (id: number | string) =>
  tmdbFetch<{ id: number; name: string }>(`/keyword/${id}`);

export const getKeywordMovies = (id: number | string, page = 1) =>
  tmdbFetch<PaginatedResponse<MovieSummary>>(`/keyword/${id}/movies`, { params: { page } });

export const getConfiguration = () =>
  tmdbFetch<{
    images: { base_url: string; secure_base_url: string; poster_sizes: string[]; backdrop_sizes: string[] };
    change_keys: string[];
  }>("/configuration", { revalidate: 86400 });

export const getCountries = () =>
  tmdbFetch<{ iso_3166_1: string; english_name: string; native_name: string }[]>(
    "/configuration/countries",
    { revalidate: 86400 }
  );

export const getLanguages = () =>
  tmdbFetch<{ iso_639_1: string; english_name: string; name: string }[]>(
    "/configuration/languages",
    { revalidate: 86400 }
  );

export const getJobs = () =>
  tmdbFetch<{ department: string; jobs: string[] }[]>("/configuration/jobs", { revalidate: 86400 });

export const getPrimaryTranslations = () =>
  tmdbFetch<string[]>("/configuration/primary_translations", { revalidate: 86400 });

export const getTimezones = () =>
  tmdbFetch<{ iso_3166_1: string; zones: string[] }[]>("/configuration/timezones", {
    revalidate: 86400,
  });

export const getMovieWatchProviderRegions = () =>
  tmdbFetch<{ results: { iso_3166_1: string; english_name: string; native_name: string }[] }>(
    "/watch/providers/regions",
    { revalidate: 86400 }
  );

export const getMovieWatchProvidersList = (watchRegion?: string) =>
  tmdbFetch<{ results: { provider_id: number; provider_name: string; logo_path: string }[] }>(
    "/watch/providers/movie",
    { params: { watch_region: watchRegion }, revalidate: 86400 }
  );

export const getTvWatchProvidersList = (watchRegion?: string) =>
  tmdbFetch<{ results: { provider_id: number; provider_name: string; logo_path: string }[] }>(
    "/watch/providers/tv",
    { params: { watch_region: watchRegion }, revalidate: 86400 }
  );
