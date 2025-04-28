import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getseries = createAsyncThunk(
  "series/getseiries",
  async (pagenum, thankapi) => {
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
        `https://api.themoviedb.org/3/tv/popular?language=en-US&page=${pagenum}`,
        config
      );
      if (!req.ok) {
        throw new Error("failed to fetch");
      }
      const res = await req.json();
      return res.results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  onepageseries: [],
  onepageseriesloading: true,
  onepageseriesfailedrequest: "",
};
const seriesSlice = createSlice({
  name: "seriesSlice",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getseries.pending, (state) => {
      state.onepageseriesloading = true;
    });
    builder.addCase(getseries.fulfilled, (state, action) => {
      state.onepageseriesloading = false;
      state.onepageseries = action.payload;
    });
    builder.addCase(getseries.rejected, (state, action) => {
      state.onepageseriesloading = false;

      state.onepageseriesfailedrequest = action.payload;
    });
  },
});

export const onepageseriesapi = seriesSlice.reducer;
