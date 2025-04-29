import { createSlice } from "@reduxjs/toolkit";

const initialState = { moviesactive: 1 };
const totalPages = 500;

const footerPaginationmoviesSlice = createSlice({
  name: "footerPaginationSlice",
  initialState,
  reducers: {
    next: (state) => {
      if (state.moviesactive < totalPages) {
        state.moviesactive = state.moviesactive + 1;
      }
    },
    prev: (state) => {
      if (state.moviesactive > 1) {
        state.moviesactive = state.moviesactive - 1;
      }
    },
    goToFirstPage: (state) => {
      state.moviesactive = 1;
    },

    goToLastPage: (state) => {
      state.moviesactive = totalPages;
    },
  },
});

export const footerPaginationmovies = footerPaginationmoviesSlice.reducer;
export const { next, prev, goToFirstPage, goToLastPage } =
  footerPaginationmoviesSlice.actions;
