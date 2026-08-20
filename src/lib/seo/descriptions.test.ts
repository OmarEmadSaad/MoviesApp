import { describe, expect, it } from "vitest";
import {
  movieDescription,
  personDescription,
  seriesDescription,
} from "./descriptions";
import {
  movieDetails,
  personDetails,
  seriesDetails,
} from "@/test/factories";

const MAX_LENGTH = 156; 

describe("movieDescription", () => {
  it("names the film and its distinguishing facts before the synopsis", () => {
    const result = movieDescription(movieDetails(), "David Fincher");
    expect(result).toContain("Fight Club");
    expect(result).toContain("1999");
    expect(result).toContain("Drama");
    expect(result).toContain("2h 19m");
    expect(result).toContain("directed by David Fincher");
  });

  it("stays within meta description length", () => {
    const result = movieDescription(
      movieDetails({ overview: "x".repeat(500) }),
      "David Fincher",
    );
    expect(result.length).toBeLessThanOrEqual(MAX_LENGTH);
  });

  it("degrades gracefully when TMDB has almost nothing", () => {
    const sparse = movieDetails({
      overview: "",
      runtime: null,
      genres: [],
      release_date: "",
    });
    expect(movieDescription(sparse)).toBe("Fight Club.");
  });
});

describe("seriesDescription", () => {
  it("includes season count and genre", () => {
    const result = seriesDescription(seriesDetails());
    expect(result).toContain("Breaking Bad");
    expect(result).toContain("5 seasons");
    expect(result).toContain("Drama");
  });

  it("pluralises a single season correctly", () => {
    const result = seriesDescription(seriesDetails({ number_of_seasons: 1 }));
    expect(result).toContain("1 season)");
  });
});

describe("personDescription", () => {
  it("leads with role and birthplace", () => {
    const result = personDescription(personDetails());
    expect(result).toContain("Brad Pitt");
    expect(result).toContain("acting");
    expect(result).toContain("Shawnee, Oklahoma, USA");
  });

  it("works for a person with no biography", () => {
    const result = personDescription(personDetails({ biography: "" }));
    expect(result).toContain("Brad Pitt");
    expect(result.length).toBeLessThanOrEqual(MAX_LENGTH);
  });
});
