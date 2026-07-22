export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  english_name: string;
  name: string;
}

export interface MovieSummary {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  video: boolean;
  media_type?: "movie";
}

export interface TvSummary {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  media_type?: "tv";
}

export interface PersonSummary {
  id: number;
  name: string;
  profile_path: string | null;
  popularity: number;
  known_for_department: string;
  known_for: (MovieSummary | TvSummary)[];
  media_type?: "person";
}

export interface MovieDetails extends MovieSummary {
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  budget: number;
  genres: Genre[];
  homepage: string | null;
  imdb_id: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  runtime: number | null;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string | null;
}

export interface TvDetails extends TvSummary {
  created_by: { id: number; name: string; profile_path: string | null }[];
  episode_run_time: number[];
  genres: Genre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: EpisodeAirInfo | null;
  next_episode_to_air: EpisodeAirInfo | null;
  networks: ProductionCompany[];
  number_of_episodes: number;
  number_of_seasons: number;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: SeasonSummary[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
}

export interface EpisodeAirInfo {
  id: number;
  name: string;
  overview: string;
  air_date: string | null;
  episode_number: number;
  season_number: number;
  runtime: number | null;
}

export interface SeasonSummary {
  id: number;
  name: string;
  overview: string;
  air_date: string | null;
  episode_count: number;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  air_date: string | null;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  id?: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
}

export interface Image {
  file_path: string;
  width: number;
  height: number;
  aspect_ratio: number;
  vote_average: number;
}

export interface Images {
  backdrops: Image[];
  posters: Image[];
  logos: Image[];
}

export interface Review {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  url: string;
}

export interface WatchProviderCountry {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface WatchProviderResponse {
  id: number;
  results: Record<string, WatchProviderCountry>;
}

export interface Keyword {
  id: number;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: MovieSummary[];
}

export interface Company {
  id: number;
  name: string;
  description: string;
  headquarters: string;
  homepage: string;
  logo_path: string | null;
  origin_country: string;
  parent_company: unknown;
}

export interface Network {
  id: number;
  name: string;
  headquarters: string;
  homepage: string;
  logo_path: string | null;
  origin_country: string;
}

export interface Certification {
  certification: string;
  meaning: string;
  order: number;
}
