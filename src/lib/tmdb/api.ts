import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import {
  TMDB_BASE_URL,
  TMDB_NOT_CONFIGURED,
  getTmdbToken,
  isTmdbConfigured,
} from "./config";
import type {
  Collection,
  CombinedCredits,
  Credits,
  ExternalIds,
  Images,
  Keyword,
  MovieDetails,
  MovieSummary,
  PersonDetails,
  Review,
  SeasonDetails,
  SeriesDetails,
  SeriesSummary,
  TmdbPaginated,
  Video,
} from "@/types/tmdb";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: TMDB_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getTmdbToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("accept", "application/json");
    return headers;
  },
});

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (!isTmdbConfigured()) {
    return {
      error: {
        status: "CUSTOM_ERROR",
        error: TMDB_NOT_CONFIGURED,
        data: TMDB_NOT_CONFIGURED,
      },
    };
  }
  return rawBaseQuery(args, api, extraOptions);
};

export const tmdbApi = createApi({
  reducerPath: "tmdb",
  baseQuery,

  keepUnusedDataFor: 300,
  refetchOnMountOrArgChange: 300,
  endpoints: (builder) => ({
    nowPlayingMovies: builder.query<TmdbPaginated<MovieSummary>, number>({
      query: (page = 1) => `/movie/now_playing?language=en-US&page=${page}`,
    }),
    discoverMovies: builder.query<TmdbPaginated<MovieSummary>, number>({
      query: (page = 1) =>
        `/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&page=${page}`,
    }),
    airingTodaySeries: builder.query<TmdbPaginated<SeriesSummary>, number>({
      query: (page = 1) => `/tv/airing_today?language=en-US&page=${page}`,
    }),
    popularSeries: builder.query<TmdbPaginated<SeriesSummary>, number>({
      query: (page = 1) => `/tv/popular?language=en-US&page=${page}`,
    }),

    movie: builder.query<MovieDetails, number>({
      query: (id) => `/movie/${id}?language=en-US`,
    }),
    movieCredits: builder.query<Credits, number>({
      query: (id) => `/movie/${id}/credits?language=en-US`,
    }),
    movieVideos: builder.query<Video[], number>({
      query: (id) => `/movie/${id}/videos?language=en-US`,
      transformResponse: (response: { results: Video[] }) => response.results,
    }),
    movieImages: builder.query<Images, number>({
      query: (id) => `/movie/${id}/images`,
    }),
    movieKeywords: builder.query<Keyword[], number>({
      query: (id) => `/movie/${id}/keywords`,
      transformResponse: (response: { keywords: Keyword[] }) =>
        response.keywords ?? [],
    }),
    movieReviews: builder.query<Review[], number>({
      query: (id) => `/movie/${id}/reviews?language=en-US`,
      transformResponse: (response: TmdbPaginated<Review>) => response.results,
    }),
    movieRecommendations: builder.query<MovieSummary[], number>({
      query: (id) => `/movie/${id}/recommendations?language=en-US&page=1`,
      transformResponse: (response: TmdbPaginated<MovieSummary>) =>
        response.results,
    }),
    movieExternalIds: builder.query<ExternalIds, number>({
      query: (id) => `/movie/${id}/external_ids`,
    }),
    collection: builder.query<Collection, number>({
      query: (id) => `/collection/${id}?language=en-US`,
    }),

    series: builder.query<SeriesDetails, number>({
      query: (id) => `/tv/${id}?language=en-US`,
    }),
    seriesCredits: builder.query<Credits, number>({
      query: (id) => `/tv/${id}/credits?language=en-US`,
    }),
    seriesVideos: builder.query<Video[], number>({
      query: (id) => `/tv/${id}/videos?language=en-US`,
      transformResponse: (response: { results: Video[] }) => response.results,
    }),
    seriesImages: builder.query<Images, number>({
      query: (id) => `/tv/${id}/images`,
    }),
    seriesKeywords: builder.query<Keyword[], number>({
      query: (id) => `/tv/${id}/keywords`,
      transformResponse: (response: { results: Keyword[] }) =>
        response.results ?? [],
    }),
    seriesReviews: builder.query<Review[], number>({
      query: (id) => `/tv/${id}/reviews?language=en-US&page=1`,
      transformResponse: (response: TmdbPaginated<Review>) => response.results,
    }),
    seriesRecommendations: builder.query<SeriesSummary[], number>({
      query: (id) => `/tv/${id}/recommendations?language=en-US&page=1`,
      transformResponse: (response: TmdbPaginated<SeriesSummary>) =>
        response.results,
    }),
    seriesExternalIds: builder.query<ExternalIds, number>({
      query: (id) => `/tv/${id}/external_ids`,
    }),
    season: builder.query<
      SeasonDetails,
      { seriesId: number; seasonNumber: number }
    >({
      query: ({ seriesId, seasonNumber }) =>
        `/tv/${seriesId}/season/${seasonNumber}?language=en-US`,
    }),

    person: builder.query<PersonDetails, number>({
      query: (id) => `/person/${id}?language=en-US`,
    }),
    personCredits: builder.query<CombinedCredits, number>({
      query: (id) => `/person/${id}/combined_credits?language=en-US`,
    }),
    personExternalIds: builder.query<ExternalIds, number>({
      query: (id) => `/person/${id}/external_ids`,
    }),

    searchMovies: builder.query<MovieSummary[], string>({
      query: (query) =>
        `/search/movie?include_adult=false&language=en-US&query=${encodeURIComponent(query)}`,
      transformResponse: (response: TmdbPaginated<MovieSummary>) =>
        response.results,
    }),
    searchSeries: builder.query<SeriesSummary[], string>({
      query: (query) =>
        `/search/tv?include_adult=false&language=en-US&query=${encodeURIComponent(query)}`,
      transformResponse: (response: TmdbPaginated<SeriesSummary>) =>
        response.results,
    }),
  }),
});

export const {
  useNowPlayingMoviesQuery,
  useDiscoverMoviesQuery,
  useAiringTodaySeriesQuery,
  usePopularSeriesQuery,
  useMovieQuery,
  useMovieCreditsQuery,
  useMovieVideosQuery,
  useMovieImagesQuery,
  useMovieKeywordsQuery,
  useMovieReviewsQuery,
  useMovieRecommendationsQuery,
  useMovieExternalIdsQuery,
  useCollectionQuery,
  useSeriesQuery,
  useSeriesCreditsQuery,
  useSeriesVideosQuery,
  useSeriesImagesQuery,
  useSeriesKeywordsQuery,
  useSeriesReviewsQuery,
  useSeriesRecommendationsQuery,
  useSeriesExternalIdsQuery,
  useSeasonQuery,
  usePersonQuery,
  usePersonCreditsQuery,
  usePersonExternalIdsQuery,
  useSearchMoviesQuery,
  useSearchSeriesQuery,
} = tmdbApi;
