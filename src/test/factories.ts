import type {
  Credits,
  MovieDetails,
  MovieSummary,
  PersonDetails,
  Review,
  SeriesDetails,
  SeriesSummary,
} from "@/types/tmdb";

export function movieSummary(
  overrides: Partial<MovieSummary> = {},
): MovieSummary {
  return {
    id: 550,
    title: "Fight Club",
    overview:
      "An insomniac office worker and a devil-may-care soap maker form an underground fight club.",
    poster_path: "/poster.jpg",
    backdrop_path: "/backdrop.jpg",
    release_date: "1999-10-15",
    vote_average: 8.4,
    vote_count: 27000,
    popularity: 60,
    ...overrides,
  };
}

export function seriesSummary(
  overrides: Partial<SeriesSummary> = {},
): SeriesSummary {
  return {
    id: 1396,
    name: "Breaking Bad",
    overview: "A high school chemistry teacher turns to manufacturing drugs.",
    poster_path: "/bb.jpg",
    backdrop_path: "/bb-backdrop.jpg",
    first_air_date: "2008-01-20",
    vote_average: 8.9,
    vote_count: 12000,
    popularity: 90,
    ...overrides,
  };
}

export function movieDetails(
  overrides: Partial<MovieDetails> = {},
): MovieDetails {
  return {
    ...movieSummary(),
    original_title: "Fight Club",
    genres: [
      { id: 18, name: "Drama" },
      { id: 53, name: "Thriller" },
    ],
    runtime: 139,
    status: "Released",
    tagline: "Mischief. Mayhem. Soap.",
    homepage: "https://www.foxmovies.com/movies/fight-club",
    imdb_id: "tt0137523",
    budget: 63000000,
    revenue: 100853753,
    original_language: "en",
    spoken_languages: [
      { iso_639_1: "en", name: "English", english_name: "English" },
    ],
    production_companies: [
      { id: 1, name: "Fox 2000 Pictures", logo_path: null, origin_country: "US" },
    ],
    belongs_to_collection: null,
    ...overrides,
  };
}

export function seriesDetails(
  overrides: Partial<SeriesDetails> = {},
): SeriesDetails {
  return {
    ...seriesSummary(),
    original_name: "Breaking Bad",
    genres: [{ id: 18, name: "Drama" }],
    episode_run_time: [47],
    number_of_seasons: 5,
    number_of_episodes: 62,
    seasons: [
      {
        id: 3572,
        name: "Season 1",
        overview: "The first season.",
        season_number: 1,
        episode_count: 7,
        air_date: "2008-01-20",
        poster_path: "/s1.jpg",
      },
    ],
    networks: [{ id: 174, name: "AMC", logo_path: null }],
    status: "Ended",
    type: "Scripted",
    tagline: "Change the equation.",
    homepage: null,
    last_air_date: "2013-09-29",
    in_production: false,
    original_language: "en",
    spoken_languages: [
      { iso_639_1: "en", name: "English", english_name: "English" },
    ],
    created_by: [{ id: 66633, name: "Vince Gilligan", profile_path: null }],
    ...overrides,
  };
}

export function credits(overrides: Partial<Credits> = {}): Credits {
  return {
    id: 550,
    cast: [
      {
        id: 819,
        name: "Edward Norton",
        character: "The Narrator",
        profile_path: "/en.jpg",
        credit_id: "c1",
        known_for_department: "Acting",
        order: 0,
      },
      {
        id: 287,
        name: "Brad Pitt",
        character: "Tyler Durden",
        profile_path: "/bp.jpg",
        credit_id: "c2",
        known_for_department: "Acting",
        order: 1,
      },
    ],
    crew: [
      {
        id: 7467,
        name: "David Fincher",
        job: "Director",
        department: "Directing",
        profile_path: null,
        credit_id: "c3",
        known_for_department: "Directing",
      },
      {
        id: 7469,
        name: "Jim Uhls",
        job: "Screenplay",
        department: "Writing",
        profile_path: null,
        credit_id: "c4",
        known_for_department: "Writing",
      },
    ],
    ...overrides,
  };
}

export function personDetails(
  overrides: Partial<PersonDetails> = {},
): PersonDetails {
  return {
    id: 287,
    name: "Brad Pitt",
    biography: "An American actor and film producer.",
    birthday: "1963-12-18",
    deathday: null,
    place_of_birth: "Shawnee, Oklahoma, USA",
    profile_path: "/bp.jpg",
    known_for_department: "Acting",
    gender: 2,
    also_known_as: ["William Bradley Pitt"],
    homepage: null,
    popularity: 40,
    ...overrides,
  };
}

export function review(overrides: Partial<Review> = {}): Review {
  return {
    id: "r1",
    author: "critic",
    author_details: {
      name: "A Critic",
      username: "critic",
      avatar_path: null,
      rating: 9,
    },
    content: "A remarkable film.",
    created_at: "2020-05-01T12:00:00.000Z",
    updated_at: "2020-05-01T12:00:00.000Z",
    url: "https://example.com/review",
    ...overrides,
  };
}
