import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import PersonPage from "./PersonPage";
import { personDetails } from "@/test/factories";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const combinedCredits = {
  id: 287,
  cast: [
    {
      id: 550,
      title: "Fight Club",
      media_type: "movie",
      overview: "",
      poster_path: "/fc.jpg",
      backdrop_path: null,
      release_date: "1999-10-15",
      vote_average: 8.4,
      vote_count: 100,
      popularity: 90,
    },
    {
      id: 1396,
      name: "Breaking Bad",
      media_type: "tv",
      overview: "",
      poster_path: "/bb.jpg",
      backdrop_path: null,
      first_air_date: "2008-01-20",
      vote_average: 8.9,
      vote_count: 200,
      popularity: 50,
    },
  ],
  crew: [],
};

function stub(overrides: Record<string, unknown> = {}) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.includes("/combined_credits")) {
      return json(overrides.credits ?? combinedCredits);
    }
    if (url.includes("/external_ids")) {
      return json({
        imdb_id: "nm0000093",
        facebook_id: null,
        instagram_id: null,
        twitter_id: null,
        wikidata_id: null,
        youtube_id: null,
        tiktok_id: null,
      });
    }
    if (overrides.fail) return json({}, 404);
    return json(overrides.person ?? personDetails());
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function render(route = "/person/287/brad-pitt") {
  return renderWithProviders(<PersonPage />, {
    route,
    path: "/person/:id/:slug?",
  });
}

describe("PersonPage", () => {
  beforeEach(() => stub());
  afterEach(() => vi.unstubAllGlobals());

  it("renders the person's name and biography", async () => {
    render();

    expect(
      await screen.findByRole("heading", { level: 1, name: "Brad Pitt" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/American actor/)).toBeInTheDocument();
  });



  it("separates film and TV credits and links each to the right route", async () => {
    render();

    const films = await screen.findByRole("region", { name: /Film credits/i });
    const tv = screen.getByRole("region", { name: /TV credits/i });

    expect(
      within(films).getByRole("link", { name: "Fight Club" }),
    ).toHaveAttribute("href", "/movie/550/fight-club");
    expect(
      within(tv).getByRole("link", { name: "Breaking Bad" }),
    ).toHaveAttribute("href", "/series/1396/breaking-bad");
  });

  it("renders gender as a word, not TMDB's integer code", async () => {
    render();


    expect(await screen.findByText("Male")).toBeInTheDocument();
    const gender = screen.getByText("Gender").nextElementSibling;
    expect(gender).toHaveTextContent("Male");
  });

  it("formats the birthday as a readable date", async () => {
    render();

    expect(await screen.findByText("18 December 1963")).toBeInTheDocument();
  });

  it("omits facts TMDB has no value for rather than printing placeholders", async () => {
    stub({
      person: personDetails({ place_of_birth: null, deathday: null, birthday: null }),
    });
    render();

    await screen.findByRole("heading", { level: 1 });
    expect(screen.queryByText("Place of birth")).toBeNull();
    expect(screen.queryByText("Died")).toBeNull();
  });



  it("renders quietly for a person with no social accounts", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    stub();
    render();

    await screen.findByRole("heading", { level: 1 });
    expect(alertSpy).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("emits Person structured data from the real record", async () => {
    render();

    await waitFor(() => {
      const schemas = [
        ...document.querySelectorAll("script[type='application/ld+json']"),
      ].map((node) => JSON.parse(node.textContent ?? "{}"));

      const person = schemas.find((schema) => schema["@type"] === "Person");
      expect(person).toMatchObject({
        name: "Brad Pitt",
        birthDate: "1963-12-18",
        birthPlace: "Shawnee, Oklahoma, USA",
        jobTitle: "Acting",
      });
    });
  });

  it("shows an error state for an unknown person", async () => {
    stub({ fail: true });
    render("/person/999999");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Person not found",
    );
  });

  it("shows empty states when a person has no credits", async () => {
    stub({ credits: { id: 1, cast: [], crew: [] } });
    render();

    expect(
      await screen.findByText("No film credits listed for Brad Pitt"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("No TV credits listed for Brad Pitt"),
    ).toBeInTheDocument();
  });
});
