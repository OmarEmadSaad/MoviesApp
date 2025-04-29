import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export const getMovieDetails = createAsyncThunk(
  "/getmoviedetails",
  async (i, thankapi) => {
    const { rejectWithValue } = thankapi;
    try {
      const config = {
        method: "get",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
          accept: "application/json",
        },
      };
      const req = await fetch(
        `https://api.themoviedb.org/3/movie/${i}`,
        config
      );
      if (!req.ok) {
        throw new Error("failed to fetch your request");
      }
      const res = await req.json();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMovieCastDetails = createAsyncThunk(
  "/getmovieCastdetails",
  async (i, thankapi) => {
    const { rejectWithValue } = thankapi;

    try {
      const config = {
        method: "get",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
          accept: "application/json",
        },
      };

      const req = await fetch(
        `https://api.themoviedb.org/3/movie/${i}/credits?language=en-US`,
        config
      );

      if (!req.ok) {
        throw new Error("failed to fetch your request");
      }

      const res = await req.json();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMovieTrialVideo = createAsyncThunk(
  "/getMovieTrialVideo",
  async (i, thankapi) => {
    const { rejectWithValue } = thankapi;
    try {
      const config = {
        method: "get",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
          accept: "application/json",
        },
      };

      const req = await fetch(
        `https://api.themoviedb.org/3/movie/${i}/videos?language=en-US`,
        config
      );
      if (!req.ok) {
        throw new Error("faild to fetch data");
      }
      const res = await req.json();
      const video = await res.results.find((result) => {
        return result.type === "Trailer";
      });

      if (video) {
        return `https://www.youtube.com/embed/${video.key}`;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const initialState = {
  movieDetails: {},
  movieDetailsLoading: false,
  movieDetailsError: "",
  moviecastDetails: [],
  moviecastDetailsLoading: false,
  moviecastDetailsError: "",
  movievideotrailerUrl: "",
  movievideotrailerUrlLoading: true,
  movievideotrailerUrlError: "",
  topbilledcast: [],
  moviecrew: [],
  movie: [],
};

const movieDetailSlice = createSlice({
  name: "movieDetails",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getMovieTrialVideo.pending, (state) => {
      state.movievideotrailerUrlLoading = true;
    });
    builder.addCase(getMovieTrialVideo.fulfilled, (state, action) => {
      state.movievideotrailerUrlLoading = false;
      state.movievideotrailerUrl = action.payload;
    });

    builder.addCase(getMovieTrialVideo.rejected, (state, action) => {
      state.movievideotrailerUrlLoading = false;
      state.movievideotrailerUrlError = action.payload;
    });

    builder.addCase(getMovieDetails.pending, (state) => {
      state.movieDetailsLoading = true;
    });
    builder.addCase(getMovieDetails.fulfilled, (state, action) => {
      state.movieDetailsLoading = false;
      state.movieDetails = action.payload;
    });
    builder.addCase(getMovieDetails.rejected, (state, action) => {
      state.movieDetailsLoading = false;
      state.movieDetailsError = action.payload;
    });
    builder.addCase(getMovieCastDetails.pending, (state) => {
      state.moviecastDetailsLoading = true;
    });
    builder.addCase(getMovieCastDetails.fulfilled, (state, action) => {
      state.moviecastDetails = action.payload;
      state.moviecastDetailsLoading = false;
      state.topbilledcast = action.payload.cast.slice(0, 8);
      state.moviecrew = action.payload.crew;
    });
    builder.addCase(getMovieCastDetails.rejected, (state, action) => {
      state.moviecastDetailsLoading = false;
      state.moviecastDetailsError = action.payload;
    });
  },
});

export const onemoviedetails = movieDetailSlice.reducer;
