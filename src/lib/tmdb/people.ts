import { tmdbFetch } from "./fetcher";
import type { Images, MovieSummary, PaginatedResponse, PersonSummary, TvSummary } from "./types";

export interface PersonDetails extends PersonSummary {
  also_known_as: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  place_of_birth: string | null;
  adult: boolean;
  imdb_id: string | null;
}

export const getPersonDetails = (id: number | string) => tmdbFetch<PersonDetails>(`/person/${id}`);

export const getPersonMovieCredits = (id: number | string) =>
  tmdbFetch<{ cast: MovieSummary[]; crew: MovieSummary[] }>(`/person/${id}/movie_credits`);

export const getPersonTvCredits = (id: number | string) =>
  tmdbFetch<{ cast: TvSummary[]; crew: TvSummary[] }>(`/person/${id}/tv_credits`);

export const getPersonCombinedCredits = (id: number | string) =>
  tmdbFetch<{ cast: (MovieSummary | TvSummary)[]; crew: (MovieSummary | TvSummary)[] }>(
    `/person/${id}/combined_credits`
  );

export const getPersonImages = (id: number | string) =>
  tmdbFetch<{ id: number; profiles: Images["posters"] }>(`/person/${id}/images`);

export const getPersonExternalIds = (id: number | string) =>
  tmdbFetch<{ imdb_id: string | null; facebook_id: string | null; instagram_id: string | null; twitter_id: string | null }>(
    `/person/${id}/external_ids`
  );

export const getPersonTaggedImages = (id: number | string, page = 1) =>
  tmdbFetch<PaginatedResponse<{ id: string; file_path: string; media: MovieSummary | TvSummary }>>(
    `/person/${id}/tagged_images`,
    { params: { page } }
  );

export const getPopularPeople = (page = 1) =>
  tmdbFetch<PaginatedResponse<PersonSummary>>("/person/popular", { params: { page } });

export const getLatestPerson = () => tmdbFetch<PersonDetails>("/person/latest", { revalidate: 3600 });
