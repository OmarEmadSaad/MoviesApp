export interface TmdbPaginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Keyword {
  id: number;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
  english_name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface MediaSummary {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  popularity?: number;

  title?: string;
  original_title?: string;
  release_date?: string;

  name?: string;
  original_name?: string;
  first_air_date?: string;

  media_type?: "movie" | "tv" | "person";
  character?: string;
  job?: string;
}

export interface MovieSummary extends MediaSummary {
  title: string;
  release_date: string;
}

export interface SeriesSummary extends MediaSummary {
  name: string;
  first_air_date: string;
}

export interface Collection {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: MovieSummary[];
}

export interface MovieDetails extends MovieSummary {
  genres: Genre[];
  runtime: number | null;
  status: string;
  tagline: string | null;
  homepage: string | null;
  imdb_id: string | null;
  budget: number;
  revenue: number;
  original_language: string;
  spoken_languages: SpokenLanguage[];
  production_companies: ProductionCompany[];
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface SeasonSummary {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  still_path: string | null;
  runtime: number | null;
  vote_average: number;
}

export interface SeasonDetails extends SeasonSummary {
  episodes: Episode[];
}

export interface SeriesDetails extends SeriesSummary {
  genres: Genre[];
  episode_run_time: number[];
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: SeasonSummary[];
  networks: Network[];
  status: string;
  type: string;
  tagline: string | null;
  homepage: string | null;
  last_air_date: string | null;
  in_production: boolean;
  original_language: string;
  spoken_languages: SpokenLanguage[];
  created_by: { id: number; name: string; profile_path: string | null }[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order?: number;
  credit_id: string;
  known_for_department: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  credit_id: string;
  known_for_department: string;
}

export interface Credits {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  size: number;
}

export interface ImageInfo {
  file_path: string;
  width: number;
  height: number;
  aspect_ratio: number;
  iso_639_1: string | null;
}

export interface Images {
  backdrops: ImageInfo[];
  posters: ImageInfo[];
  logos: ImageInfo[];
}

export interface ReviewAuthor {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

export interface Review {
  id: string;
  author: string;
  author_details: ReviewAuthor;
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

export interface ExternalIds {
  imdb_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
  wikidata_id: string | null;
  youtube_id: string | null;
  tiktok_id: string | null;
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;

  gender: 0 | 1 | 2 | 3;
  also_known_as: string[];
  homepage: string | null;
  popularity: number;
}

export interface CombinedCredits {
  id: number;
  cast: MediaSummary[];
  crew: MediaSummary[];
}

export type MediaType = "movie" | "tv";
