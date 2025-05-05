import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getSeriesDetails = createAsyncThunk(
  "series/getSeriesDetails",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzg4Y2MzZjRlZjBkODYxNmQ1MDdiYmFjNWIxNWJhZiIsIm5iZiI6MTc0NTI1MTQ0MC40NjEsInN1YiI6IjY4MDY2YzcwYzNlOGU3NGI2ZGVlNTliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0ydamGJC2iTKEwwEDGsNBWRyZNe6YEcPdUMS1ZOkjY",
        },
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
        options
      );

      if (!response.ok) {
        throw new Error("Failed to fetch series details 😞");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSeriesCastDetails = createAsyncThunk(
  "series/getSeriesCastDetails",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzg4Y2MzZjRlZjBkODYxNmQ1MDdiYmFjNWIxNWJhZiIsIm5iZiI6MTc0NTI1MTQ0MC40NjEsInN1YiI6IjY4MDY2YzcwYzNlOGU3NGI2ZGVlNTliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0ydamGJC2iTKEwwEDGsNBWRyZNe6YEcPdUMS1ZOkjY",
        },
      };
      const req = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/credits?language=en-US`,
        options
      );

      if (!req.ok) {
        throw new Error("Failed to fetch cast details");
      }
      const res = await req.json();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSeriesTrialVideo = createAsyncThunk(
  "series/getSeriesTrialVideo",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzg4Y2MzZjRlZjBkODYxNmQ1MDdiYmFjNWIxNWJhZiIsIm5iZiI6MTc0NTI1MTQ0MC40NjEsInN1YiI6IjY4MDY2YzcwYzNlOGU3NGI2ZGVlNTliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0ydamGJC2iTKEwwEDGsNBWRyZNe6YEcPdUMS1ZOkjY",
        },
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`,
        options
      );

      if (!response.ok) {
        throw new Error("Failed to fetch video trailer");
      }

      const data = await response.json();
      const video = data.results.find((result) => result.type === "Trailer");

      if (video) {
        return `https://www.youtube.com/embed/${video.key}`;
      } else {
        return rejectWithValue("Sorry, no trailer available on YouTube 😞");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSeriesAllVideos = createAsyncThunk(
  "series/getSeriesAllVideos",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzg4Y2MzZjRlZjBkODYxNmQ1MDdiYmFjNWIxNWJhZiIsIm5iZiI6MTc0NTI1MTQ0MC40NjEsInN1YiI6IjY4MDY2YzcwYzNlOGU3NGI2ZGVlNTliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0ydamGJC2iTKEwwEDGsNBWRyZNe6YEcPdUMS1ZOkjY",
        },
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`,
        options
      );

      if (!response.ok) {
        throw new Error("Failed to fetch series videos 😞");
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSeasonDetails = createAsyncThunk(
  "series/getSeasonDetails",
  async ({ seriesId, seasonNumber }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzg4Y2MzZjRlZjBkODYxNmQ1MDdiYmFjNWIxNWJhZiIsIm5iZiI6MTc0NTI1MTQ0MC40NjEsInN1YiI6IjY4MDY2YzcwYzNlOGU3NGI2ZGVlNTliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0ydamGJC2iTKEwwEDGsNBWRyZNe6YEcPdUMS1ZOkjY",
        },
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?language=en-US`,
        options
      );

      if (!response.ok) {
        throw new Error("Failed to fetch season details");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSeriesReviews = createAsyncThunk(
  "series/getSeriesReviews",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzg4Y2MzZjRlZjBkODYxNmQ1MDdiYmFjNWIxNWJhZiIsIm5iZiI6MTc0NTI1MTQ0MC40NjEsInN1YiI6IjY4MDY2YzcwYzNlOGU3NGI2ZGVlNTliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0ydamGJC2iTKEwwEDGsNBWRyZNe6YEcPdUMS1ZOkjY",
        },
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/reviews?language=en-US&page=1`,
        options
      );

      if (!response.ok) {
        throw new Error("Failed to fetch series reviews 😞");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSeriesImages = createAsyncThunk(
  "series/getSeriesImages",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzg4Y2MzZjRlZjBkODYxNmQ1MDdiYmFjNWIxNWJhZiIsIm5iZiI6MTc0NTI1MTQ0MC40NjEsInN1YiI6IjY4MDY2YzcwYzNlOGU3NGI2ZGVlNTliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0ydamGJC2iTKEwwEDGsNBWRyZNe6YEcPdUMS1ZOkjY",
        },
      };
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/images`,
        options
      );

      if (!response.ok) {
        throw new Error("Failed to fetch series images 😞");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSeriesRecommendations = createAsyncThunk(
  "series/getSeriesRecommendations",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzg4Y2MzZjRlZjBkODYxNmQ1MDdiYmFjNWIxNWJhZiIsIm5iZiI6MTc0NTI1MTQ0MC40NjEsInN1YiI6IjY4MDY2YzcwYzNlOGU3NGI2ZGVlNTliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0ydamGJC2iTKEwwEDGsNBWRyZNe6YEcPdUMS1ZOkjY",
        },
      };
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/recommendations?language=en-US&page=1`,
        options
      );

      if (!response.ok) {
        throw new Error("Failed to fetch series recommendations 😞");
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSeriesKeywords = createAsyncThunk(
  "series/getSeriesKeywords",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzg4Y2MzZjRlZjBkODYxNmQ1MDdiYmFjNWIxNWJhZiIsIm5iZiI6MTc0NTI1MTQ0MC40NjEsInN1YiI6IjY4MDY2YzcwYzNlOGU3NGI2ZGVlNTliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0ydamGJC2iTKEwwEDGsNBWRyZNe6YEcPdUMS1ZOkjY",
        },
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/keywords`,
        options
      );

      if (!response.ok) {
        throw new Error("Failed to fetch series keywords 😞");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPersonDetails = createAsyncThunk(
  "person/getPersonDetails",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzg4Y2MzZjRlZjBkODYxNmQ1MDdiYmFjNWIxNWJhZiIsIm5iZiI6MTc0NTI1MTQ0MC40NjEsInN1YiI6IjY4MDY2YzcwYzNlOGU3NGI2ZGVlNTliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0ydamGJC2iTKEwwEDGsNBWRyZNe6YEcPdUMS1ZOkjY",
        },
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/person/${id}?language=en-US`,
        options
      );

      if (!response.ok) {
        throw new Error("Failed to fetch person details 😞");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPersonKnownFor = createAsyncThunk(
  "person/getPersonKnownFor",
  async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzg4Y2MzZjRlZjBkODYxNmQ1MDdiYmFjNWIxNWJhZiIsIm5iZiI6MTc0NTI1MTQ0MC40NjEsInN1YiI6IjY4MDY2YzcwYzNlOGU3NGI2ZGVlNTliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0ydamGJC2iTKEwwEDGsNBWRyZNe6YEcPdUMS1ZOkjY",
        },
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US`,
        options
      );

      if (!response.ok) {
        throw new Error("Failed to fetch person known for 😞");
      }

      const data = await response.json();
      return data.cast.slice(0, 4);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPersonSocialMedia = createAsyncThunk(
  "person/getPersonSocialMedia",
  async (personId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Mzg4Y2MzZjRlZjBkODYxNmQ1MDdiYmFjNWIxNWJhZiIsIm5iZiI6MTc0NTI1MTQ0MC40NjEsInN1YiI6IjY4MDY2YzcwYzNlOGU3NGI2ZGVlNTliZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.o0ydamGJC2iTKEwwEDGsNBWRyZNe6YEcPdUMS1ZOkjY",
        },
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/person/${personId}/external_ids?language=en-US`,
        options
      );

      if (!response.ok) {
        throw new Error("Failed to fetch social media details 😞");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  seriesDetails: null,
  seriesDetailsLoading: false,
  seriesDetailsError: null,

  seriesvideotrailerUrl: null,
  seriesvideotrailerUrlLoading: false,
  seriesvideotrailerUrlError: null,

  seriesAllVideos: [],
  seriesAllVideosLoading: false,
  seriesAllVideosError: null,

  seriescastDetails: { cast: [], crew: [] },
  seriescastDetailsLoading: false,
  seriescastDetailsError: null,

  topbilledcast: [],
  sreiescrew: [],
  series: [],

  seasonDetails: null,
  seasonDetailsLoading: false,
  seasonDetailsError: null,

  seriesReviews: null,
  seriesReviewsLoading: false,
  seriesReviewsError: null,

  seriesImages: null,
  seriesImagesLoading: false,
  seriesImagesError: null,

  recommendations: [],
  recommendationsLoading: false,
  recommendationsError: null,

  seriesKeywords: [],
  seriesKeywordsLoading: false,
  seriesKeywordsError: null,

  PersonDetails: null,
  PersonDetailsLoading: false,
  PersonDetailsError: null,

  PersonKnownFor: [],
  PersonKnownForLoading: false,
  PersonKnownForError: null,

  PersonSocialMedia: null,
  PersonSocialMediaLoading: false,
  PersonSocialMediaError: null,
};

const SeriesDetailsSlice = createSlice({
  name: "SeriesDetails",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getSeriesDetails.pending, (state) => {
        state.seriesDetailsLoading = true;
        state.seriesDetailsError = null;
      })
      .addCase(getSeriesDetails.fulfilled, (state, action) => {
        state.seriesDetailsLoading = false;
        state.seriesDetails = action.payload;
        state.seriesDetailsError = null;
      })
      .addCase(getSeriesDetails.rejected, (state, action) => {
        state.seriesDetailsLoading = false;
        state.seriesDetailsError = action.payload;
      })

      .addCase(getSeriesCastDetails.pending, (state) => {
        state.seriescastDetailsLoading = true;
        state.seriescastDetailsError = null;
      })
      .addCase(getSeriesCastDetails.fulfilled, (state, action) => {
        state.seriescastDetailsLoading = false;
        state.seriescastDetails = action.payload;
        state.seriescastDetailsError = null;
      })
      .addCase(getSeriesCastDetails.rejected, (state, action) => {
        state.seriescastDetailsLoading = false;
        state.seriescastDetailsError = action.payload;
      })

      .addCase(getSeriesTrialVideo.pending, (state) => {
        state.seriesvideotrailerUrlLoading = true;
        state.seriesvideotrailerUrlError = null;
      })
      .addCase(getSeriesTrialVideo.fulfilled, (state, action) => {
        state.seriesvideotrailerUrlLoading = false;
        state.seriesvideotrailerUrl = action.payload;
        state.seriesvideotrailerUrlError = null;
      })
      .addCase(getSeriesTrialVideo.rejected, (state, action) => {
        state.seriesvideotrailerUrlLoading = false;
        state.seriesvideotrailerUrlError = action.payload;
      })

      .addCase(getSeriesAllVideos.pending, (state) => {
        state.seriesAllVideosLoading = true;
        state.seriesAllVideosError = null;
      })
      .addCase(getSeriesAllVideos.fulfilled, (state, action) => {
        state.seriesAllVideosLoading = false;
        state.seriesAllVideos = action.payload;
        state.seriesAllVideosError = null;
      })
      .addCase(getSeriesAllVideos.rejected, (state, action) => {
        state.seriesAllVideosLoading = false;
        state.seriesAllVideosError = action.payload;
      })

      .addCase(getSeasonDetails.pending, (state) => {
        state.seasonDetailsLoading = true;
        state.seasonDetailsError = null;
      })
      .addCase(getSeasonDetails.fulfilled, (state, action) => {
        state.seasonDetailsLoading = false;
        state.seasonDetails = action.payload;
        state.seasonDetailsError = null;
      })
      .addCase(getSeasonDetails.rejected, (state, action) => {
        state.seasonDetailsLoading = false;
        state.seasonDetailsError = action.payload;
      })

      .addCase(getSeriesReviews.pending, (state) => {
        state.seriesReviewsLoading = true;
        state.seriesReviewsError = null;
      })
      .addCase(getSeriesReviews.fulfilled, (state, action) => {
        state.seriesReviewsLoading = false;
        state.seriesReviews = action.payload;
        state.seriesReviewsError = null;
      })
      .addCase(getSeriesReviews.rejected, (state, action) => {
        state.seriesReviewsLoading = false;
        state.seriesReviewsError = action.payload;
      })

      .addCase(getSeriesImages.pending, (state) => {
        state.seriesImagesLoading = true;
        state.seriesImagesError = null;
      })
      .addCase(getSeriesImages.fulfilled, (state, action) => {
        state.seriesImagesLoading = false;
        state.seriesImages = action.payload;
        state.seriesImagesError = null;
      })
      .addCase(getSeriesImages.rejected, (state, action) => {
        state.seriesImagesLoading = false;
        state.seriesImagesError = action.payload;
      })

      .addCase(getSeriesRecommendations.pending, (state) => {
        state.recommendationsLoading = true;
        state.recommendationsError = null;
      })
      .addCase(getSeriesRecommendations.fulfilled, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendations = action.payload;
        state.recommendationsError = null;
      })
      .addCase(getSeriesRecommendations.rejected, (state, action) => {
        state.recommendationsLoading = false;
        state.recommendationsError = action.payload;
      })

      .addCase(getSeriesKeywords.pending, (state) => {
        state.seriesKeywordsLoading = true;
        state.seriesKeywordsError = null;
      })
      .addCase(getSeriesKeywords.fulfilled, (state, action) => {
        state.seriesKeywordsLoading = false;
        state.seriesKeywords = action.payload.results || action.payload;
        state.seriesKeywordsError = null;
      })
      .addCase(getSeriesKeywords.rejected, (state, action) => {
        state.seriesKeywordsLoading = false;
        state.seriesKeywords = [];
        state.seriesKeywordsError = action.payload;
      })

      .addCase(getPersonDetails.pending, (state) => {
        state.PersonDetailsLoading = true;
        state.PersonDetailsError = null;
      })
      .addCase(getPersonDetails.fulfilled, (state, action) => {
        state.PersonDetailsLoading = false;
        state.PersonDetails = action.payload;
        state.PersonDetailsError = null;
      })
      .addCase(getPersonDetails.rejected, (state, action) => {
        state.PersonDetailsLoading = false;
        state.PersonDetails = null;
        state.PersonDetailsError = action.payload;
      })

      .addCase(getPersonKnownFor.pending, (state) => {
        state.PersonKnownForLoading = true;
        state.PersonKnownForError = null;
      })
      .addCase(getPersonKnownFor.fulfilled, (state, action) => {
        state.PersonKnownForLoading = false;
        state.PersonKnownFor = action.payload;
        state.PersonKnownForError = null;
      })
      .addCase(getPersonKnownFor.rejected, (state, action) => {
        state.PersonKnownForLoading = false;
        state.PersonKnownFor = [];
        state.PersonKnownForError = action.payload;
      })

      .addCase(getPersonSocialMedia.pending, (state) => {
        state.PersonSocialMediaLoading = true;
        state.PersonSocialMediaError = null;
      })
      .addCase(getPersonSocialMedia.fulfilled, (state, action) => {
        state.PersonSocialMediaLoading = false;
        state.PersonSocialMedia = action.payload;
        state.PersonSocialMediaError = null;
      })
      .addCase(getPersonSocialMedia.rejected, (state, action) => {
        state.PersonSocialMediaLoading = false;
        state.PersonSocialMedia = null;
        state.PersonSocialMediaError = action.payload;
      });
  },
});

export const SeriesDetails = SeriesDetailsSlice.reducer;
