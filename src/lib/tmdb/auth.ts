import { TMDB_BASE_URL, getReadAccessToken } from "./config";
import { tmdbFetch } from "./fetcher";
import type { MovieSummary, PaginatedResponse, TvSummary } from "./types";

function authHeaders() {
  return {
    Authorization: `Bearer ${getReadAccessToken()}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

export const createRequestToken = () =>
  tmdbFetch<{ success: boolean; expires_at: string; request_token: string }>(
    "/authentication/token/new",
    { revalidate: false }
  );

export const createGuestSession = () =>
  tmdbFetch<{ success: boolean; guest_session_id: string; expires_at: string }>(
    "/authentication/guest_session/new",
    { revalidate: false }
  );

export async function createSession(requestToken: string) {
  const res = await fetch(`${TMDB_BASE_URL}/authentication/session/new`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ request_token: requestToken }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to create TMDB session");
  return res.json() as Promise<{ success: boolean; session_id: string }>;
}

export async function deleteSession(sessionId: string) {
  const res = await fetch(`${TMDB_BASE_URL}/authentication/session`, {
    method: "DELETE",
    headers: authHeaders(),
    body: JSON.stringify({ session_id: sessionId }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to delete TMDB session");
  return res.json() as Promise<{ success: boolean }>;
}

export async function markAsFavorite(
  accountId: number | string,
  sessionId: string,
  mediaType: "movie" | "tv",
  mediaId: number,
  favorite: boolean
) {
  const res = await fetch(
    `${TMDB_BASE_URL}/account/${accountId}/favorite?session_id=${sessionId}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ media_type: mediaType, media_id: mediaId, favorite }),
      cache: "no-store",
    }
  );
  return res.json() as Promise<{ success: boolean; status_message: string }>;
}

export async function addToWatchlist(
  accountId: number | string,
  sessionId: string,
  mediaType: "movie" | "tv",
  mediaId: number,
  watchlist: boolean
) {
  const res = await fetch(
    `${TMDB_BASE_URL}/account/${accountId}/watchlist?session_id=${sessionId}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ media_type: mediaType, media_id: mediaId, watchlist }),
      cache: "no-store",
    }
  );
  return res.json() as Promise<{ success: boolean; status_message: string }>;
}

export async function rateMedia(
  mediaType: "movie" | "tv",
  mediaId: number,
  sessionId: string,
  value: number
) {
  const res = await fetch(
    `${TMDB_BASE_URL}/${mediaType}/${mediaId}/rating?session_id=${sessionId}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ value }),
      cache: "no-store",
    }
  );
  return res.json() as Promise<{ success: boolean; status_message: string }>;
}

export async function rateMediaAsGuest(
  mediaType: "movie" | "tv",
  mediaId: number,
  guestSessionId: string,
  value: number
) {
  const res = await fetch(
    `${TMDB_BASE_URL}/${mediaType}/${mediaId}/rating?guest_session_id=${guestSessionId}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ value }),
      cache: "no-store",
    }
  );
  return res.json() as Promise<{ success: boolean; status_message: string }>;
}

export async function deleteRating(mediaType: "movie" | "tv", mediaId: number, sessionId: string) {
  const res = await fetch(
    `${TMDB_BASE_URL}/${mediaType}/${mediaId}/rating?session_id=${sessionId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
      cache: "no-store",
    }
  );
  return res.json() as Promise<{ success: boolean; status_message: string }>;
}

export interface AccountDetails {
  id: number;
  username: string;
  name: string;
  include_adult: boolean;
  iso_3166_1: string;
  iso_639_1: string;
  avatar: { gravatar: { hash: string }; tmdb: { avatar_path: string | null } };
}

export const getAccountDetails = (sessionId: string) =>
  tmdbFetch<AccountDetails>("/account", { params: { session_id: sessionId }, revalidate: 0 });

export const getFavoriteMovies = (accountId: number | string, sessionId: string, page = 1) =>
  tmdbFetch<PaginatedResponse<MovieSummary>>(`/account/${accountId}/favorite/movies`, {
    params: { session_id: sessionId, page },
    revalidate: 0,
  });

export const getFavoriteTv = (accountId: number | string, sessionId: string, page = 1) =>
  tmdbFetch<PaginatedResponse<TvSummary>>(`/account/${accountId}/favorite/tv`, {
    params: { session_id: sessionId, page },
    revalidate: 0,
  });

export const getWatchlistMovies = (accountId: number | string, sessionId: string, page = 1) =>
  tmdbFetch<PaginatedResponse<MovieSummary>>(`/account/${accountId}/watchlist/movies`, {
    params: { session_id: sessionId, page },
    revalidate: 0,
  });

export const getWatchlistTv = (accountId: number | string, sessionId: string, page = 1) =>
  tmdbFetch<PaginatedResponse<TvSummary>>(`/account/${accountId}/watchlist/tv`, {
    params: { session_id: sessionId, page },
    revalidate: 0,
  });

export const getRatedMovies = (accountId: number | string, sessionId: string, page = 1) =>
  tmdbFetch<PaginatedResponse<MovieSummary>>(`/account/${accountId}/rated/movies`, {
    params: { session_id: sessionId, page },
    revalidate: 0,
  });

export const getRatedTv = (accountId: number | string, sessionId: string, page = 1) =>
  tmdbFetch<PaginatedResponse<TvSummary>>(`/account/${accountId}/rated/tv`, {
    params: { session_id: sessionId, page },
    revalidate: 0,
  });

export interface TmdbList {
  id: number;
  name: string;
  description: string;
  item_count: number;
  favorite_count: number;
  poster_path: string | null;
  iso_639_1: string;
}

export const getAccountLists = (accountId: number | string, sessionId: string, page = 1) =>
  tmdbFetch<PaginatedResponse<TmdbList>>(`/account/${accountId}/lists`, {
    params: { session_id: sessionId, page },
    revalidate: 0,
  });

export interface ListDetails {
  id: number;
  name: string;
  description: string;
  poster_path: string | null;
  items: (MovieSummary | TvSummary)[];
  item_count: number;
}

export const getListDetails = (listId: number | string, page = 1) =>
  tmdbFetch<ListDetails>(`/list/${listId}`, { params: { page }, revalidate: 0 });

export async function createList(sessionId: string, name: string, description = "") {
  const res = await fetch(`${TMDB_BASE_URL}/list?session_id=${sessionId}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name, description, language: "en" }),
    cache: "no-store",
  });
  return res.json() as Promise<{ success: boolean; list_id: number }>;
}

export async function deleteList(listId: number | string, sessionId: string) {
  const res = await fetch(`${TMDB_BASE_URL}/list/${listId}?session_id=${sessionId}`, {
    method: "DELETE",
    headers: authHeaders(),
    cache: "no-store",
  });
  return res.json() as Promise<{ success: boolean }>;
}

export async function addItemToList(
  listId: number | string,
  sessionId: string,
  mediaId: number
) {
  const res = await fetch(`${TMDB_BASE_URL}/list/${listId}/add_item?session_id=${sessionId}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ media_id: mediaId }),
    cache: "no-store",
  });
  return res.json() as Promise<{ success: boolean; status_message: string }>;
}

export async function removeItemFromList(
  listId: number | string,
  sessionId: string,
  mediaId: number
) {
  const res = await fetch(`${TMDB_BASE_URL}/list/${listId}/remove_item?session_id=${sessionId}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ media_id: mediaId }),
    cache: "no-store",
  });
  return res.json() as Promise<{ success: boolean; status_message: string }>;
}
