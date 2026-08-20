import { describe, expect, it } from "vitest";
import {
  breadcrumbJsonLd,
  itemListJsonLd,
  movieJsonLd,
  personJsonLd,
  seriesJsonLd,
  websiteJsonLd,
} from "./jsonld";
import {
  credits,
  movieDetails,
  personDetails,
  seriesDetails,
} from "@/test/factories";

describe("movieJsonLd", () => {
  const { cast, crew } = credits();

  it("describes the film with the fields Google documents for Movie", () => {
    const schema = movieJsonLd(movieDetails(), cast, crew);

    expect(schema).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Movie",
      name: "Fight Club",
      datePublished: "1999-10-15",
      duration: "PT2H19M",
      inLanguage: "en",
      genre: ["Drama", "Thriller"],
    });
  });

  it("names the director and writers from the crew, not the cast", () => {
    const schema = movieJsonLd(movieDetails(), cast, crew) as Record<
      string,
      { name: string }[]
    >;

    expect(schema.director.map((p) => p.name)).toEqual(["David Fincher"]);
    expect(schema.author.map((p) => p.name)).toEqual(["Jim Uhls"]);
  });

  it("gives every credited person a resolvable URL", () => {
    const schema = movieJsonLd(movieDetails(), cast, crew) as Record<
      string,
      { url: string }[]
    >;

    expect(schema.actor[0].url).toMatch(/\/person\/819\/edward-norton$/);
  });

  it("includes an aggregate rating when there are votes", () => {
    const schema = movieJsonLd(movieDetails(), cast, crew) as Record<
      string,
      Record<string, number>
    >;

    expect(schema.aggregateRating).toMatchObject({
      ratingValue: 8.4,
      ratingCount: 27000,
      bestRating: 10,
    });
  });

  it("omits the rating entirely when nobody has voted", () => {
    const schema = movieJsonLd(
      movieDetails({ vote_count: 0, vote_average: 0 }),
      cast,
      crew,
    );

    expect(schema).not.toHaveProperty("aggregateRating");
  });

  it("omits fields TMDB has no value for rather than emitting nulls", () => {
    const schema = movieJsonLd(
      movieDetails({ runtime: null, genres: [], poster_path: null, overview: "" }),
      [],
      [],
    );

    expect(schema).not.toHaveProperty("duration");
    expect(schema).not.toHaveProperty("genre");
    expect(schema).not.toHaveProperty("image");
    expect(schema).not.toHaveProperty("description");
    expect(JSON.stringify(schema)).not.toContain("null");
  });
});

describe("seriesJsonLd", () => {
  it("emits TVSeries with season and episode counts", () => {
    const schema = seriesJsonLd(seriesDetails(), credits().cast);

    expect(schema).toMatchObject({
      "@type": "TVSeries",
      name: "Breaking Bad",
      startDate: "2008-01-20",
      numberOfSeasons: 5,
      numberOfEpisodes: 62,
    });
  });

  it("sets an end date only for a finished show", () => {
    expect(seriesJsonLd(seriesDetails())).toHaveProperty(
      "endDate",
      "2013-09-29",
    );
    expect(
      seriesJsonLd(seriesDetails({ in_production: true })),
    ).not.toHaveProperty("endDate");
  });

  it("credits the creator as a linked entity", () => {
    const schema = seriesJsonLd(seriesDetails()) as Record<
      string,
      { name: string; url: string }[]
    >;

    expect(schema.creator[0].name).toBe("Vince Gilligan");
    expect(schema.creator[0].url).toMatch(/\/person\/66633\/vince-gilligan$/);
  });
});

describe("personJsonLd", () => {
  it("emits Person with the biographical facts", () => {
    expect(personJsonLd(personDetails())).toMatchObject({
      "@type": "Person",
      name: "Brad Pitt",
      birthDate: "1963-12-18",
      birthPlace: "Shawnee, Oklahoma, USA",
      jobTitle: "Acting",
    });
  });

  it("omits deathday for a living person", () => {
    expect(personJsonLd(personDetails())).not.toHaveProperty("deathDate");
  });
});

describe("breadcrumbJsonLd", () => {
  it("numbers positions from one and absolutises each item", () => {
    const schema = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Movies", path: "/movies" },
    ]) as Record<string, { position: number; item: string }[]>;

    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].item).toMatch(/^https?:\/\/.+\/movies$/);
  });
});

describe("itemListJsonLd", () => {
  it("numbers the grid so the list order is explicit", () => {
    const schema = itemListJsonLd("Popular", [
      { id: 1, title: "One", path: "/movie/1/one", image: null },
      { id: 2, title: "Two", path: "/movie/2/two", image: "/img.jpg" },
    ]) as Record<string, number | { position: number; image?: string }[]>;

    expect(schema.numberOfItems).toBe(2);
    expect((schema.itemListElement as { position: number }[])[1].position).toBe(2);
  });
});

describe("websiteJsonLd", () => {
  it("declares the site search action", () => {
    const schema = websiteJsonLd() as Record<string, Record<string, unknown>>;

    expect(schema["@type"]).toBe("WebSite");
    expect(schema.potentialAction["@type"]).toBe("SearchAction");
  });
});
