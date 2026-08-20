import { describe, expect, it } from "vitest";
import { mediaPath, moviePath, personPath, seriesPath, slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Fight Club")).toBe("fight-club");
  });

  it("strips diacritics so URLs stay ASCII", () => {
    expect(slugify("Amélie")).toBe("amelie");
  });

  it("drops apostrophes rather than turning them into hyphens", () => {
    expect(slugify("Ocean's Eleven")).toBe("oceans-eleven");
    expect(slugify("Ocean\u2019s Eleven")).toBe("oceans-eleven");
  });

  it("collapses punctuation and trims stray hyphens", () => {
    expect(slugify("Mission: Impossible - Fallout")).toBe(
      "mission-impossible-fallout",
    );
    expect(slugify("...Hello!!!")).toBe("hello");
  });

  it("caps length so URLs stay reasonable", () => {
    expect(slugify("a".repeat(200))).toHaveLength(80);
  });

  it("returns an empty string for missing titles", () => {
    expect(slugify(null)).toBe("");
    expect(slugify("")).toBe("");

    expect(slugify("!!!")).toBe("");
  });
});

describe("path builders", () => {
  it("appends the slug when there is a title", () => {
    expect(moviePath(550, "Fight Club")).toBe("/movie/550/fight-club");
    expect(seriesPath(1396, "Breaking Bad")).toBe("/series/1396/breaking-bad");
    expect(personPath(287, "Brad Pitt")).toBe("/person/287/brad-pitt");
  });

  it("falls back to the bare id when the title is unusable", () => {
    expect(moviePath(550)).toBe("/movie/550");
    expect(moviePath(550, "!!!")).toBe("/movie/550");
  });

  it("routes by media type", () => {
    expect(mediaPath("movie", 1, "X")).toBe("/movie/1/x");
    expect(mediaPath("tv", 1, "X")).toBe("/series/1/x");
  });
});
