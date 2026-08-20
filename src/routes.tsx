import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import {
  LegacyMovieRedirect,
  LegacySeriesMediaRedirect,
  LegacyTvRedirect,
} from "@/components/LegacyRedirects";



const Home = lazy(() => import("@/features/home/HomePage"));
const MoviesPage = lazy(() => import("@/features/movies/MoviesPage"));
const MovieDetailsPage = lazy(() => import("@/features/movies/MovieDetailsPage"));
const MovieCreditsPage = lazy(() => import("@/features/movies/MovieCreditsPage"));
const MovieReviewsPage = lazy(() => import("@/features/movies/MovieReviewsPage"));
const CollectionPage = lazy(() => import("@/features/movies/CollectionPage"));
const SeriesPage = lazy(() => import("@/features/series/SeriesPage"));
const SeriesDetailsPage = lazy(() => import("@/features/series/SeriesDetailsPage"));
const SeriesCreditsPage = lazy(() => import("@/features/series/SeriesCreditsPage"));
const SeriesReviewsPage = lazy(() => import("@/features/series/SeriesReviewsPage"));
const SeasonsPage = lazy(() => import("@/features/series/SeasonsPage"));
const SeasonDetailsPage = lazy(() => import("@/features/series/SeasonDetailsPage"));
const SeriesMediaPage = lazy(() => import("@/features/series/SeriesMediaPage"));
const SeriesRecommendationsPage = lazy(
  () => import("@/features/series/SeriesRecommendationsPage"),
);
const PersonPage = lazy(() => import("@/features/person/PersonPage"));
const SearchResultsPage = lazy(() => import("@/features/search/SearchResultsPage"));
const ContactPage = lazy(() => import("@/features/contact/ContactPage"));
const NotFoundPage = lazy(() => import("@/features/NotFoundPage"));

export const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/contact-us", element: <ContactPage /> },

  { path: "/movies", element: <MoviesPage /> },
  { path: "/movie/:id/cast", element: <MovieCreditsPage /> },
  { path: "/movie/:id/reviews", element: <MovieReviewsPage /> },
  { path: "/movie/:id/collection/:collectionId", element: <CollectionPage /> },
  { path: "/movie/:id/:slug?", element: <MovieDetailsPage /> },

  { path: "/series", element: <SeriesPage /> },
  { path: "/series/:id/cast", element: <SeriesCreditsPage /> },
  { path: "/series/:id/reviews", element: <SeriesReviewsPage /> },
  { path: "/series/:id/seasons", element: <SeasonsPage /> },
  { path: "/series/:id/season/:seasonNumber", element: <SeasonDetailsPage /> },
  { path: "/series/:id/media", element: <SeriesMediaPage /> },
  {
    path: "/series/:id/recommendations",
    element: <SeriesRecommendationsPage />,
  },
  { path: "/series/:id/:slug?", element: <SeriesDetailsPage /> },

  { path: "/person/:id/:slug?", element: <PersonPage /> },

  { path: "/search/:scope/:query", element: <SearchResultsPage /> },



  { path: "/tv/:id", element: <LegacyTvRedirect /> },
  { path: "/tv/:id/reviews", element: <LegacyTvRedirect suffix="/reviews" /> },
  {
    path: "/movie/:id/cast_crew",
    element: <LegacyMovieRedirect suffix="/cast" />,
  },
  {
    path: "/movie/:id/movie_review",
    element: <LegacyMovieRedirect suffix="/reviews" />,
  },
  { path: "/series/:id/videos", element: <LegacySeriesMediaRedirect /> },
  { path: "/series/:id/backdrops", element: <LegacySeriesMediaRedirect /> },
  { path: "/series/:id/posters", element: <LegacySeriesMediaRedirect /> },

  { path: "*", element: <NotFoundPage /> },
];
