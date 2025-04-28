import { createSlice } from "@reduxjs/toolkit";

const initialState = { seriesactive: 1 };
const totalPages = 500;

const footerPaginationSeriesSlice = createSlice({
  name: "footerPaginationseriesSlice",
  initialState,
  reducers: {
    next: (state) => {
      if (state.seriesactive < totalPages) {
        state.seriesactive = state.seriesactive + 1;
      }
    },
    prev: (state) => {
      if (state.seriesactive > 1) {
        state.seriesactive = state.seriesactive - 1;
      }
    },
    goToFirstPage: (state) => {
      state.seriesactive = 1;
    },

    goToLastPage: (state) => {
      state.seriesactive = totalPages;
    },
  },
});

export const footerPaginationseries = footerPaginationSeriesSlice.reducer;
export const { next, prev, goToFirstPage, goToLastPage } =
  footerPaginationSeriesSlice.actions;
