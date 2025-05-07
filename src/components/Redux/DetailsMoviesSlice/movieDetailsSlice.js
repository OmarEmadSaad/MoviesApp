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
      // console.log(video);

      if (video) {
        return `https://www.youtube.com/embed/${video.key}?modestbranding=1&autohide=1&showinfo=0`;
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getMovieReviews = createAsyncThunk(
  "/getMovieReviews",
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
        `https://api.themoviedb.org/3/movie/${i}/reviews?language=en-US`,
        config
      );
      if (!req.ok) {
        throw new Error("faild to fetch data");
      }
      const res = await req.json();
      return res.results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getMovieVideos = createAsyncThunk(
  "/getMovieVideos",
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
      return res.results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMoviecollection = createAsyncThunk(
  "/getMoviecollection",
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
        `https://api.themoviedb.org/3/collection/${i}?language=en-US`,
        config
      );
      if (!req.ok) {
        throw new Error("faild to fetch data");
      }
      const res = await req.json();
      console.log(1111111111, res);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getMovieRecommendatios = createAsyncThunk(
  "/getMovieRecommendatios",
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
        `https://api.themoviedb.org/3/movie/${i}/recommendations`,

        config
      );
      if (!req.ok) {
        throw new Error("faild to fetch data");
      }
      const res = await req.json();
      return res.results;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getMovieImages = createAsyncThunk(
  "/getMovieImages",
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
        `https://api.themoviedb.org/3/movie/${i}/images`,
        config
      );
      if (!req.ok) {
        throw new Error("faild to fetch data");
      }
      const res = await req.json();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getMovieKeywords = createAsyncThunk(
  "/getMovieKeywords",
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
        `https://api.themoviedb.org/3/movie/${i}/keywords`,

        config
      );
      if (!req.ok) {
        throw new Error("faild to fetch data");
      }
      const res = await req.json();
      return res.keywords;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getMovieSocialLinks = createAsyncThunk(
  "/getMovieSocialLinks",
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
        `https://api.themoviedb.org/3/movie/${i}/external_ids`,

        config
      );
      if (!req.ok) {
        throw new Error("faild to fetch data");
      }
      const res = await req.json();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getpersondetails = createAsyncThunk(
  "/getpersondetails",
  async (personId, thankapi) => {
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
        `https://api.themoviedb.org/3/person/${personId}`,
        config
      );
      if (!req.ok) {
        throw new Error("faild to fetch data");
      }
      const res = await req.json();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getpersonSocialLinks = createAsyncThunk(
  "/getpersonSocialLinks",
  async (personId, thankapi) => {
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
        `https://api.themoviedb.org/3/person/${personId}/external_ids`,
        config
      );
      if (!req.ok) {
        throw new Error("faild to fetch data");
      }
      const res = await req.json();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getpersonMovieCredits = createAsyncThunk(
  "/getpersonMovieCredits",
  async (personId, thankapi) => {
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
        `https://api.themoviedb.org/3/person/${personId}/movie_credits`,
        config
      );
      if (!req.ok) {
        throw new Error("faild to fetch data");
      }
      const res = await req.json();
      return res.cast;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMoviebySearch = createAsyncThunk(
  "/getMoviebySearch",
  async (movieName, thankapi) => {
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
        `https://api.themoviedb.org/3/search/movie?query=${movieName}`,
        config
      );
      if (!req.ok) {
        throw new Error("faild to fetch data");
      }
      const res = await req.json();
      return res.results;
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
  arrangecrewacordingtorole: [],

  MovieReviews: [],
  MovieReviewsLoading: true,
  MovieReviewsError: "",

  movievideos: [],
  movievideosLoading: true,
  movievideosError: "",
  movieImages: [],
  movieImagesLoading: true,
  movieImagesError: "",
  movieCollection: [],
  movieCollectionLoading: true,
  movieCollectionError: "",
  movieRecommendations: [],
  movieRecommendationsLoading: true,
  movieRecommendationsError: "",
  movieKeywords: [],
  movieKeywordsLoading: true,
  movieKeywordsError: "",

  MovieSocialLinks: [],
  MovieSocialLinksLoading: true,
  MovieSocialLinksError: "",

  persondetails: [],
  persondetailsLoading: true,
  persondetailsError: "",
  personSocialLinks: [],
  personSocialLinksLoading: true,
  personSocialLinksError: "",

  personMovieCredits: [],
  personMovieCreditsLoading: true,
  personMovieCreditsError: "",

  MoviebySearch: [],
  MoviebySearchLoading: true,
  MoviebySearchError: "",
};

const movieDetailSlice = createSlice({
  name: "movieDetails",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getMoviebySearch.pending, (state) => {
      state.MoviebySearchLoading = true;
    });
    builder.addCase(getMoviebySearch.fulfilled, (state, action) => {
      state.MoviebySearchLoading = false;
      state.MoviebySearch = action.payload;
    });
    builder.addCase(getMoviebySearch.rejected, (state, action) => {
      (state.MoviebySearchLoading = false),
        (state.MoviebySearchError = action.payload);
    });

    builder.addCase(getpersonMovieCredits.pending, (state) => {
      state.personMovieCreditsLoading = true;
    });
    builder.addCase(getpersonMovieCredits.fulfilled, (state, action) => {
      state.personMovieCreditsLoading = false;
      state.personMovieCredits = action.payload;
    });
    builder.addCase(getpersonMovieCredits.rejected, (state, action) => {
      (state.personMovieCreditsLoading = false),
        (state.personMovieCreditsError = action.payload);
    });

    builder.addCase(getpersonSocialLinks.pending, (state) => {
      state.personSocialLinksLoading = true;
    });
    builder.addCase(getpersonSocialLinks.fulfilled, (state, action) => {
      state.personSocialLinksLoading = false;
      state.personSocialLinks = action.payload;
    });
    builder.addCase(getpersonSocialLinks.rejected, (state, action) => {
      (state.personSocialLinksLoading = false),
        (state.personSocialLinksError = action.payload);
    });

    builder.addCase(getpersondetails.pending, (state) => {
      state.persondetailsLoading = true;
    });
    builder.addCase(getpersondetails.fulfilled, (state, action) => {
      state.persondetailsLoading = false;
      state.persondetails = action.payload;
    });
    builder.addCase(getpersondetails.rejected, (state, action) => {
      (state.persondetailsLoading = false),
        (state.persondetailsError = action.payload);
    });

    builder.addCase(getMovieSocialLinks.pending, (state) => {
      state.MovieSocialLinksLoading = true;
    });
    builder.addCase(getMovieSocialLinks.fulfilled, (state, action) => {
      state.MovieSocialLinksLoading = false;
      state.MovieSocialLinks = action.payload;
    });
    builder.addCase(getMovieSocialLinks.rejected, (state, action) => {
      (state.MovieSocialLinksLoading = false),
        (state.MovieSocialLinksError = action.payload);
    });

    builder.addCase(getMovieKeywords.pending, (state) => {
      state.movieKeywordsLoading = true;
    });
    builder.addCase(getMovieKeywords.fulfilled, (state, action) => {
      (state.movieKeywordsLoading = false),
        (state.movieKeywords = action.payload);
    });
    builder.addCase(getMovieKeywords.rejected, (state, action) => {
      (state.movieKeywordsLoading = false),
        (state.movieKeywordsLoading = action.payload);
    });

    builder.addCase(getMovieRecommendatios.pending, (state) => {
      state.movieRecommendationsLoading = true;
    });
    builder.addCase(getMovieRecommendatios.fulfilled, (state, action) => {
      state.movieRecommendationsLoading = false;
      state.movieRecommendations = action.payload;
    });
    builder.addCase(getMovieRecommendatios.rejected, (state, action) => {
      state.movieRecommendationsLoading = false;
      state.movieRecommendationsError = action.payload;
    });

    builder.addCase(getMoviecollection.pending, (state) => {
      state.movieCollectionLoading = true;
    });
    builder.addCase(getMoviecollection.fulfilled, (state, action) => {
      state.movieCollectionLoading = false;

      state.movieCollection = action.payload;
    });
    builder.addCase(getMoviecollection.rejected, (state, action) => {
      state.movieCollectionLoading = false;
      state.movieCollectionError = action.payload;
    });

    builder.addCase(getMovieImages.pending, (state) => {
      state.movieImagesLoading = true;
    });
    builder.addCase(getMovieImages.fulfilled, (state, action) => {
      state.movieImagesLoading = false;
      state.movieImages = action.payload;
    });
    builder.addCase(getMovieImages.rejected, (state, action) => {
      state.movieImagesLoading = false;
      state.movieImagesError = action.payload;
    });

    builder.addCase(getMovieVideos.pending, (state) => {
      state.movievideosLoading = true;
    });
    builder.addCase(getMovieVideos.fulfilled, (state, action) => {
      state.movievideosLoading = false;

      state.movievideos = action.payload;
    });
    builder.addCase(getMovieVideos.rejected, (state, action) => {
      state.movievideosLoading = false;
      state.movievideosError = action.payload;
    });

    builder.addCase(getMovieReviews.pending, (state) => {
      state.MovieReviewsLoading = true;
    });
    builder.addCase(getMovieReviews.fulfilled, (state, action) => {
      state.MovieReviewsLoading = false;

      state.MovieReviews = action.payload;
    });
    builder.addCase(getMovieReviews.rejected, (state, action) => {
      state.MovieReviewsLoading = false;
      state.MovieReviewsError = action.payload;
    });

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
      state.topbilledcast = action.payload.cast;
      state.moviecrew = action.payload.crew;
      state.arrangecrewacordingtorole = action.payload.crew.reduce(
        (acc, person) => {
          if (!acc[person.department]) {
            acc[person.department] = [];
          }
          acc[person.department].push(person);
          return acc;
        },
        {}
      );
    });
    builder.addCase(getMovieCastDetails.rejected, (state, action) => {
      state.moviecastDetailsLoading = false;
      state.moviecastDetailsError = action.payload;
    });
  },
});

export const onemoviedetails = movieDetailSlice.reducer;

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// export const getMovieDetails = createAsyncThunk(
//   "/getmoviedetails",
//   async (i, thankapi) => {
//     const { rejectWithValue } = thankapi;
//     try {
//       const config = {
//         method: "get",
//         headers: {
//           Authorization:
//             "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
//           accept: "application/json",
//         },
//       };
//       const req = await fetch(
//         `https://api.themoviedb.org/3/movie/${i}`,
//         config
//       );
//       if (!req.ok) {
//         throw new Error("failed to fetch your request");
//       }
//       const res = await req.json();
//       return res;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const getMovieCastDetails = createAsyncThunk(
//   "/getmovieCastdetails",
//   async (i, thankapi) => {
//     const { rejectWithValue } = thankapi;

//     try {
//       const config = {
//         method: "get",
//         headers: {
//           Authorization:
//             "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
//           accept: "application/json",
//         },
//       };

//       const req = await fetch(
//         `https://api.themoviedb.org/3/movie/${i}/credits?language=en-US`,
//         config
//       );

//       if (!req.ok) {
//         throw new Error("failed to fetch your request");
//       }

//       const res = await req.json();
//       return res;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const getMovieTrialVideo = createAsyncThunk(
//   "/getMovieTrialVideo",
//   async (i, thankapi) => {
//     const { rejectWithValue } = thankapi;
//     try {
//       const config = {
//         method: "get",
//         headers: {
//           Authorization:
//             "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
//           accept: "application/json",
//         },
//       };

//       const req = await fetch(
//         `https://api.themoviedb.org/3/movie/${i}/videos?language=en-US`,
//         config
//       );
//       if (!req.ok) {
//         throw new Error("faild to fetch data");
//       }
//       const res = await req.json();
//       const video = await res.results.find((result) => {
//         return result.type === "Trailer";
//       });

//       if (video) {
//         return `https://www.youtube.com/embed/${video.key}`;
//       }
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
// export const getMovieReviews = createAsyncThunk(
//   "/getMovieReviews",
//   async (i, thankapi) => {
//     const { rejectWithValue } = thankapi;
//     try {
//       const config = {
//         method: "get",
//         headers: {
//           Authorization:
//             "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
//           accept: "application/json",
//         },
//       };

//       const req = await fetch(
//         `https://api.themoviedb.org/3/movie/${i}/reviews?language=en-US`,
//         config
//       );
//       if (!req.ok) {
//         throw new Error("faild to fetch data");
//       }
//       const res = await req.json();
//       return res.results;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
// export const getMovieVideos = createAsyncThunk(
//   "/getMovieVideos",
//   async (i, thankapi) => {
//     const { rejectWithValue } = thankapi;
//     try {
//       const config = {
//         method: "get",
//         headers: {
//           Authorization:
//             "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
//           accept: "application/json",
//         },
//       };

//       const req = await fetch(
//         `https://api.themoviedb.org/3/movie/${i}/videos?language=en-US`,
//         config
//       );
//       if (!req.ok) {
//         throw new Error("faild to fetch data");
//       }
//       const res = await req.json();
//       return res.results;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const getMoviecollection = createAsyncThunk(
//   "/getMoviecollection",
//   async (i, thankapi) => {
//     const { rejectWithValue } = thankapi;
//     try {
//       const config = {
//         method: "get",
//         headers: {
//           Authorization:
//             "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
//           accept: "application/json",
//         },
//       };

//       const req = await fetch(
//         `https://api.themoviedb.org/3/collection/${i}?language=en-US`,
//         config
//       );
//       if (!req.ok) {
//         throw new Error("faild to fetch data");
//       }
//       const res = await req.json();
//       return res;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
// export const getMovieRecommendatios = createAsyncThunk(
//   "/getMovieRecommendatios",
//   async (i, thankapi) => {
//     const { rejectWithValue } = thankapi;
//     try {
//       const config = {
//         method: "get",
//         headers: {
//           Authorization:
//             "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
//           accept: "application/json",
//         },
//       };

//       const req = await fetch(
//         `https://api.themoviedb.org/3/movie/${i}/recommendations`,

//         config
//       );
//       if (!req.ok) {
//         throw new Error("faild to fetch data");
//       }
//       const res = await req.json();
//       return res.results;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
// export const getMovieImages = createAsyncThunk(
//   "/getMovieImages",
//   async (i, thankapi) => {
//     const { rejectWithValue } = thankapi;
//     try {
//       const config = {
//         method: "get",
//         headers: {
//           Authorization:
//             "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
//           accept: "application/json",
//         },
//       };

//       const req = await fetch(
//         `https://api.themoviedb.org/3/movie/${i}/images`,
//         config
//       );
//       if (!req.ok) {
//         throw new Error("faild to fetch data");
//       }
//       const res = await req.json();
//       return res;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
// export const getMovieKeywords = createAsyncThunk(
//   "/getMovieKeywords",
//   async (i, thankapi) => {
//     const { rejectWithValue } = thankapi;
//     try {
//       const config = {
//         method: "get",
//         headers: {
//           Authorization:
//             "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
//           accept: "application/json",
//         },
//       };

//       const req = await fetch(
//         `https://api.themoviedb.org/3/movie/${i}/keywords`,

//         config
//       );
//       if (!req.ok) {
//         throw new Error("faild to fetch data");
//       }
//       const res = await req.json();
//       return res.keywords;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
// export const getMovieSocialLinks = createAsyncThunk(
//   "/getMovieSocialLinks",
//   async (i, thankapi) => {
//     const { rejectWithValue } = thankapi;
//     try {
//       const config = {
//         method: "get",
//         headers: {
//           Authorization:
//             "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
//           accept: "application/json",
//         },
//       };

//       const req = await fetch(
//         `https://api.themoviedb.org/3/movie/${i}/external_ids`,

//         config
//       );
//       if (!req.ok) {
//         throw new Error("faild to fetch data");
//       }
//       const res = await req.json();
//       return res;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const getpersondetails = createAsyncThunk(
//   "/getpersondetails",
//   async (personId, thankapi) => {
//     const { rejectWithValue } = thankapi;
//     try {
//       const config = {
//         method: "get",
//         headers: {
//           Authorization:
//             "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
//           accept: "application/json",
//         },
//       };

//       const req = await fetch(
//         `https://api.themoviedb.org/3/person/${personId}`,
//         config
//       );
//       if (!req.ok) {
//         throw new Error("faild to fetch data");
//       }
//       const res = await req.json();
//       return res;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
// export const getpersonSocialLinks = createAsyncThunk(
//   "/getpersonSocialLinks",
//   async (personId, thankapi) => {
//     const { rejectWithValue } = thankapi;
//     try {
//       const config = {
//         method: "get",
//         headers: {
//           Authorization:
//             "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
//           accept: "application/json",
//         },
//       };

//       const req = await fetch(
//         `https://api.themoviedb.org/3/person/${personId}/external_ids`,
//         config
//       );
//       if (!req.ok) {
//         throw new Error("faild to fetch data");
//       }
//       const res = await req.json();
//       return res;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
// export const getpersonMovieCredits = createAsyncThunk(
//   "/getpersonMovieCredits",
//   async (personId, thankapi) => {
//     const { rejectWithValue } = thankapi;
//     try {
//       const config = {
//         method: "get",
//         headers: {
//           Authorization:
//             "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MDdmZGZlYWU0OGU4N2U0NTQ4YTM5ZmZkZjczYmU3NiIsIm5iZiI6MTc0NTYwMzQ2OC42MDcsInN1YiI6IjY4MGJjYjhjOGJjZWE2NmE4NmFiMDQ0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fcri0wbTR6owlEOMJmZVOYPPUKpPm2vHqUCwEtqGAw8",
//           accept: "application/json",
//         },
//       };

//       const req = await fetch(
//         `https://api.themoviedb.org/3/person/${personId}/movie_credits`,
//         config
//       );
//       if (!req.ok) {
//         throw new Error("faild to fetch data");
//       }
//       const res = await req.json();
//       return res.cast;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const searchMovieByName = createAsyncThunk(
//   "/searchMovieByName",
//   async (query, { rejectWithValue }) => {
//     try {
//       const config = {
//         method: "get",
//         headers: {
//           Authorization: "Bearer YOUR_TOKEN_HERE",
//           accept: "application/json",
//         },
//       };
//       const req = await fetch(
//         `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
//           query
//         )}&language=en-US&page=1`,
//         config
//       );
//       if (!req.ok) throw new Error("failed to search movies");
//       const res = await req.json();
//       return res.results;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const initialState = {
//   movieDetails: {},
//   movieDetailsLoading: false,
//   movieDetailsError: "",

//   moviecastDetails: [],
//   moviecastDetailsLoading: false,
//   moviecastDetailsError: "",

//   movievideotrailerUrl: "",
//   movievideotrailerUrlLoading: true,
//   movievideotrailerUrlError: "",

//   topbilledcast: [],
//   moviecrew: [],
//   movie: [],
//   arrangecrewacordingtorole: [],

//   MovieReviews: [],
//   MovieReviewsLoading: true,
//   MovieReviewsError: "",

//   movievideos: [],
//   movievideosLoading: true,
//   movievideosError: "",
//   movieImages: [],
//   movieImagesLoading: true,
//   movieImagesError: "",
//   movieCollection: [],
//   movieCollectionLoading: true,
//   movieCollectionError: "",
//   movieRecommendations: [],
//   movieRecommendationsLoading: true,
//   movieRecommendationsError: "",
//   movieKeywords: [],
//   movieKeywordsLoading: true,
//   movieKeywordsError: "",

//   MovieSocialLinks: [],
//   MovieSocialLinksLoading: true,
//   MovieSocialLinksError: "",

//   persondetails: [],
//   persondetailsLoading: true,
//   persondetailsError: "",
//   personSocialLinks: [],
//   personSocialLinksLoading: true,
//   personSocialLinksError: "",

//   personMovieCredits: [],
//   personMovieCreditsLoading: true,
//   personMovieCreditsError: "",

//   searchMovieByName: [],
//   searchMovieByNameLoading: true,
//   searchMovieByNameError: "",
// };

// const movieDetailSlice = createSlice({
//   name: "movieDetails",
//   initialState,

//   extraReducers: (builder) => {
//     builder.addCase(searchMovieByName.pending, (state) => {
//       state.MoviebySearchLoading = true;
//     });
//     builder.addCase(searchMovieByName.fulfilled, (state, action) => {
//       state.MoviebySearchLoading = false;
//       state.MoviebySearch = action.payload;
//     });
//     builder.addCase(searchMovieByName.rejected, (state, action) => {
//       (state.MoviebySearchLoading = false),
//         (state.MoviebySearchError = action.payload);
//     });

//     builder.addCase(getpersonMovieCredits.pending, (state) => {
//       state.personMovieCreditsLoading = true;
//     });
//     builder.addCase(getpersonMovieCredits.fulfilled, (state, action) => {
//       state.personMovieCreditsLoading = false;
//       state.personMovieCredits = action.payload;
//     });
//     builder.addCase(getpersonMovieCredits.rejected, (state, action) => {
//       (state.personMovieCreditsLoading = false),
//         (state.personMovieCreditsError = action.payload);
//     });

//     builder.addCase(getpersonSocialLinks.pending, (state) => {
//       state.personSocialLinksLoading = true;
//     });
//     builder.addCase(getpersonSocialLinks.fulfilled, (state, action) => {
//       state.personSocialLinksLoading = false;
//       state.personSocialLinks = action.payload;
//     });
//     builder.addCase(getpersonSocialLinks.rejected, (state, action) => {
//       (state.personSocialLinksLoading = false),
//         (state.personSocialLinksError = action.payload);
//     });

//     builder.addCase(getpersondetails.pending, (state) => {
//       state.persondetailsLoading = true;
//     });
//     builder.addCase(getpersondetails.fulfilled, (state, action) => {
//       state.persondetailsLoading = false;
//       state.persondetails = action.payload;
//     });
//     builder.addCase(getpersondetails.rejected, (state, action) => {
//       (state.persondetailsLoading = false),
//         (state.persondetailsError = action.payload);
//     });

//     builder.addCase(getMovieSocialLinks.pending, (state) => {
//       state.MovieSocialLinksLoading = true;
//     });
//     builder.addCase(getMovieSocialLinks.fulfilled, (state, action) => {
//       state.MovieSocialLinksLoading = false;
//       state.MovieSocialLinks = action.payload;
//     });
//     builder.addCase(getMovieSocialLinks.rejected, (state, action) => {
//       (state.MovieSocialLinksLoading = false),
//         (state.MovieSocialLinksError = action.payload);
//     });

//     builder.addCase(getMovieKeywords.pending, (state) => {
//       state.movieKeywordsLoading = true;
//     });
//     builder.addCase(getMovieKeywords.fulfilled, (state, action) => {
//       (state.movieKeywordsLoading = false),
//         (state.movieKeywords = action.payload);
//     });
//     builder.addCase(getMovieKeywords.rejected, (state, action) => {
//       (state.movieKeywordsLoading = false),
//         (state.movieKeywordsLoading = action.payload);
//     });

//     builder.addCase(getMovieRecommendatios.pending, (state) => {
//       state.movieRecommendationsLoading = true;
//     });
//     builder.addCase(getMovieRecommendatios.fulfilled, (state, action) => {
//       state.movieRecommendationsLoading = false;
//       state.movieRecommendations = action.payload;
//     });
//     builder.addCase(getMovieRecommendatios.rejected, (state, action) => {
//       state.movieRecommendationsLoading = false;
//       state.movieRecommendationsError = action.payload;
//     });

//     builder.addCase(getMoviecollection.pending, (state) => {
//       state.movieCollectionLoading = true;
//     });
//     builder.addCase(getMoviecollection.fulfilled, (state, action) => {
//       state.movieCollectionLoading = false;

//       state.movieCollection = action.payload;
//     });
//     builder.addCase(getMoviecollection.rejected, (state, action) => {
//       state.movieCollectionLoading = false;
//       state.movieCollectionError = action.payload;
//     });

//     builder.addCase(getMovieImages.pending, (state) => {
//       state.movieImagesLoading = true;
//     });
//     builder.addCase(getMovieImages.fulfilled, (state, action) => {
//       state.movieImagesLoading = false;
//       state.movieImages = action.payload;
//     });
//     builder.addCase(getMovieImages.rejected, (state, action) => {
//       state.movieImagesLoading = false;
//       state.movieImagesError = action.payload;
//     });

//     builder.addCase(getMovieVideos.pending, (state) => {
//       state.movievideosLoading = true;
//     });
//     builder.addCase(getMovieVideos.fulfilled, (state, action) => {
//       state.movievideosLoading = false;

//       state.movievideos = action.payload;
//     });
//     builder.addCase(getMovieVideos.rejected, (state, action) => {
//       state.movievideosLoading = false;
//       state.movievideosError = action.payload;
//     });

//     builder.addCase(getMovieReviews.pending, (state) => {
//       state.MovieReviewsLoading = true;
//     });
//     builder.addCase(getMovieReviews.fulfilled, (state, action) => {
//       state.MovieReviewsLoading = false;

//       state.MovieReviews = action.payload;
//     });
//     builder.addCase(getMovieReviews.rejected, (state, action) => {
//       state.MovieReviewsLoading = false;
//       state.MovieReviewsError = action.payload;
//     });

//     builder.addCase(getMovieTrialVideo.pending, (state) => {
//       state.movievideotrailerUrlLoading = true;
//     });
//     builder.addCase(getMovieTrialVideo.fulfilled, (state, action) => {
//       state.movievideotrailerUrlLoading = false;
//       state.movievideotrailerUrl = action.payload;
//     });

//     builder.addCase(getMovieTrialVideo.rejected, (state, action) => {
//       state.movievideotrailerUrlLoading = false;
//       state.movievideotrailerUrlError = action.payload;
//     });

//     builder.addCase(getMovieDetails.pending, (state) => {
//       state.movieDetailsLoading = true;
//     });
//     builder.addCase(getMovieDetails.fulfilled, (state, action) => {
//       state.movieDetailsLoading = false;
//       state.movieDetails = action.payload;
//     });
//     builder.addCase(getMovieDetails.rejected, (state, action) => {
//       state.movieDetailsLoading = false;
//       state.movieDetailsError = action.payload;
//     });
//     builder.addCase(getMovieCastDetails.pending, (state) => {
//       state.moviecastDetailsLoading = true;
//     });
//     builder.addCase(getMovieCastDetails.fulfilled, (state, action) => {
//       state.moviecastDetails = action.payload;
//       state.moviecastDetailsLoading = false;
//       state.topbilledcast = action.payload.cast.slice(0, 8);
//       state.moviecrew = action.payload.crew;
//       state.arrangecrewacordingtorole = action.payload.crew.reduce(
//         (acc, person) => {
//           if (!acc[person.department]) {
//             acc[person.department] = [];
//           }
//           acc[person.department].push(person);
//           return acc;
//         },
//         {}
//       );
//     });
//     builder.addCase(getMovieCastDetails.rejected, (state, action) => {
//       state.moviecastDetailsLoading = false;
//       state.moviecastDetailsError = action.payload;
//     });
//   },
// });

// export const onemoviedetails = movieDetailSlice.reducer;
