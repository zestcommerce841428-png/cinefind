import { tmdbFetch } from "./fetcher";
import type {
  Credits,
  Episode,
  Images,
  Keyword,
  PaginatedResponse,
  Review,
  SeasonSummary,
  TvDetails,
  TvSummary,
  Video,
  WatchProviderResponse,
} from "./types";

export const getTvDetails = (id: number | string) => tmdbFetch<TvDetails>(`/tv/${id}`);

export const getTvCredits = (id: number | string) => tmdbFetch<Credits>(`/tv/${id}/aggregate_credits`);

export const getTvVideos = (id: number | string) =>
  tmdbFetch<{ id: number; results: Video[] }>(`/tv/${id}/videos`);

export const getTvImages = (id: number | string) =>
  tmdbFetch<Images & { id: number }>(`/tv/${id}/images`, {
    params: { include_image_language: "en,null" },
  });

export const getTvReviews = (id: number | string, page = 1) =>
  tmdbFetch<PaginatedResponse<Review> & { id: number }>(`/tv/${id}/reviews`, { params: { page } });

export const getTvSimilar = (id: number | string, page = 1) =>
  tmdbFetch<PaginatedResponse<TvSummary>>(`/tv/${id}/similar`, { params: { page } });

export const getTvRecommendations = (id: number | string, page = 1) =>
  tmdbFetch<PaginatedResponse<TvSummary>>(`/tv/${id}/recommendations`, { params: { page } });

export const getTvKeywords = (id: number | string) =>
  tmdbFetch<{ id: number; results: Keyword[] }>(`/tv/${id}/keywords`);

export const getTvWatchProviders = (id: number | string) =>
  tmdbFetch<WatchProviderResponse>(`/tv/${id}/watch/providers`, { revalidate: 86400 });

export const getTvExternalIds = (id: number | string) =>
  tmdbFetch<{ imdb_id: string | null; facebook_id: string | null; instagram_id: string | null; twitter_id: string | null }>(
    `/tv/${id}/external_ids`
  );

export const getTvContentRatings = (id: number | string) =>
  tmdbFetch<{ id: number; results: { iso_3166_1: string; rating: string }[] }>(`/tv/${id}/content_ratings`);

export const getTvSeasonDetails = (id: number | string, seasonNumber: number) =>
  tmdbFetch<SeasonSummary & { episodes: Episode[] }>(`/tv/${id}/season/${seasonNumber}`);

export const getTvEpisodeDetails = (id: number | string, seasonNumber: number, episodeNumber: number) =>
  tmdbFetch<Episode & { credits: Credits }>(
    `/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`,
    { params: { append_to_response: "credits" } }
  );

export const getTvEpisodeCredits = (id: number | string, seasonNumber: number, episodeNumber: number) =>
  tmdbFetch<Credits>(`/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}/credits`);

export const getTvEpisodeImages = (id: number | string, seasonNumber: number, episodeNumber: number) =>
  tmdbFetch<{ stills: Images["backdrops"] }>(
    `/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}/images`
  );

export const getPopularTv = (page = 1) =>
  tmdbFetch<PaginatedResponse<TvSummary>>("/tv/popular", { params: { page } });

export const getTopRatedTv = (page = 1) =>
  tmdbFetch<PaginatedResponse<TvSummary>>("/tv/top_rated", { params: { page } });

export const getAiringTodayTv = (page = 1) =>
  tmdbFetch<PaginatedResponse<TvSummary>>("/tv/airing_today", { params: { page } });

export const getOnTheAirTv = (page = 1) =>
  tmdbFetch<PaginatedResponse<TvSummary>>("/tv/on_the_air", { params: { page } });

export const getLatestTv = () => tmdbFetch<TvDetails>("/tv/latest", { revalidate: 3600 });

export const getTvGenres = () =>
  tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/tv/list", { revalidate: 86400 });

export const getTvCertifications = () =>
  tmdbFetch<{ certifications: Record<string, { certification: string; meaning: string; order: number }[]> }>(
    "/certification/tv/list",
    { revalidate: 86400 }
  );

export const getTvTranslations = (id: number | string) =>
  tmdbFetch<{
    id: number;
    translations: { iso_3166_1: string; iso_639_1: string; name: string; english_name: string }[];
  }>(`/tv/${id}/translations`);

export const getTvAlternativeTitles = (id: number | string) =>
  tmdbFetch<{ id: number; results: { iso_3166_1: string; title: string; type: string }[] }>(
    `/tv/${id}/alternative_titles`
  );

export interface TvAccountStates {
  id: number;
  favorite: boolean;
  rated: boolean | { value: number };
  watchlist: boolean;
}

export const getTvAccountStates = (id: number | string, sessionId: string) =>
  tmdbFetch<TvAccountStates>(`/tv/${id}/account_states`, {
    params: { session_id: sessionId },
    revalidate: 0,
  });

export interface EpisodeGroup {
  id: string;
  name: string;
  description: string;
  episode_count: number;
  group_count: number;
  network: { id: number; name: string; logo_path: string | null } | null;
  type: number;
}

export const getTvEpisodeGroups = (id: number | string) =>
  tmdbFetch<{ id: number; results: EpisodeGroup[] }>(`/tv/${id}/episode_groups`);

export interface EpisodeGroupDetails extends EpisodeGroup {
  groups: {
    id: string;
    name: string;
    order: number;
    episodes: { id: number; name: string; episode_number: number; season_number: number; air_date: string | null; still_path: string | null; overview: string; vote_average: number }[];
  }[];
}

export const getEpisodeGroupDetails = (id: string) =>
  tmdbFetch<EpisodeGroupDetails>(`/tv/episode_group/${id}`);
