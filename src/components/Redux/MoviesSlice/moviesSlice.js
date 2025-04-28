import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMovies = createAsyncThunk("movies/fetchMovies", async () => {
  const response = await axios.get(
    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzg4Y2MzZjRlZjBkODYxNmQ1MDdiYmFjNWIxNWJhZiIsIm5iZiI6MTc0NTI1MTQ0MC40NjEsInN1YiI6IjY4MDY2YzcwYzNlOGU3NGI2ZGVlNTliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0ydamGJC2iTKEwwEDGsNBWRyZNe6YEcPdUMS1ZOkjY`,
      },
    }
  );
  return response.data.results.slice(0, 20);
});

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.loading = false;
      state.movies = action.payload;
    });
    builder.addCase(fetchMovies.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default moviesSlice.reducer;
