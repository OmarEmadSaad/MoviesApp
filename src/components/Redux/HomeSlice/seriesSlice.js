import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTvShows = createAsyncThunk(
  "tvShows/fetchTvShows",
  async () => {
    const response = await fetch(
      "https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=1",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzg4Y2MzZjRlZjBkODYxNmQ1MDdiYmFjNWIxNWJhZiIsIm5iZiI6MTc0NTI1MTQ0MC40NjEsInN1YiI6IjY4MDY2YzcwYzNlOGU3NGI2ZGVlNTliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0ydamGJC2iTKEwwEDGsNBWRyZNe6YEcPdUMS1ZOkjY", // ضع هنا مفتاح API الفعلي
        },
      }
    );
    const data = await response.json();
    return data.results.slice(0, 20);
  }
);

const seriesSlice = createSlice({
  name: "seriesSlice",
  initialState: {
    tvShows: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTvShows.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchTvShows.fulfilled, (state, action) => {
      state.status = "loaded";
      state.tvShows = action.payload;
    });
    builder.addCase(fetchTvShows.rejected, (state) => {
      state.status = "error";
    });
  },
});

export default seriesSlice.reducer;
