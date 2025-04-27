import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./slices/moviesSlice";
import seriesReducer from "./slices/seriesSlice";
import { onepagmoviesapi } from "./slices/moviesPagesSlice";
import { footerPaginationmovies } from "./slices/footerPaginationmoviesSlice";
import { footerPaginationseries } from "./slices/footerPaginationSeriesSlice";
import { onepageseriesapi } from "./slices/seriesPagesSlice";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    series: seriesReducer,
    onepagmoviesapi,
    footerPaginationmovies,
    footerPaginationseries,
    onepageseriesapi,
  },
});
