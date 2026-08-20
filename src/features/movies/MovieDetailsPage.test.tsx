import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import MovieDetailsPage from "./MovieDetailsPage";
import { credits, movieDetails, review } from "@/test/factories";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function stubTmdb(overrides: Record<string, unknown> = {}) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input instanceof Request ? input.url : input);
    if ("failDetails" in overrides && !/\/(credits|videos|images|keywords|reviews|recommendations|external_ids)/.test(url)) {
      return json({ status_message: "Not found" }, 404);
    }
    if (url.includes("/credits")) return json(overrides.credits ?? credits());
    if (url.includes("/videos")) {
      return json({
        results: overrides.videos ?? [
          {
            id: "v1",
            key: "trailerkey",
            name: "Official Trailer",
            site: "YouTube",
            type: "Trailer",
            official: true,
            size: 1080,
          },
        ],
      });
    }
    if (url.includes("/images")) return json({ backdrops: [], posters: [], logos: [] });
    if (url.includes("/keywords")) return json({ keywords: [{ id: 1, name: "boxing" }] });
    if (url.includes("/reviews")) {
      return json({ results: [review()], page: 1, total_pages: 1, total_results: 1 });
    }
    if (url.includes("/recommendations")) {
      return json({ results: [], page: 1, total_pages: 0, total_results: 0 });
    }
    if (url.includes("/external_ids")) {
      return json({
        imdb_id: "tt0137523",
        facebook_id: null,
        instagram_id: null,
        twitter_id: null,
        wikidata_id: "Q190050",
        youtube_id: null,
        tiktok_id: null,
      });
    }
    return json(overrides.movie ?? movieDetails());
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function render(route = "/movie/550/fight-club") {
  return renderWithProviders(<MovieDetailsPage />, {
    route,
    path: "/movie/:id/:slug?",
  });
}

describe("MovieDetailsPage", () => {
  beforeEach(() => {
    stubTmdb();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the title as the page's only h1", async () => {
    render();

    const h1 = await screen.findByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Fight Club");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("shows runtime, release date and genres from the real payload", async () => {
    render();

    expect(await screen.findByText("2h 19m")).toBeInTheDocument();
    expect(screen.getByText("15 October 1999")).toBeInTheDocument();
    expect(screen.getByText("Drama")).toBeInTheDocument();
    expect(screen.getByText("Thriller")).toBeInTheDocument();
  });

  it("omits runtime entirely when TMDB has none", async () => {
    stubTmdb({ movie: movieDetails({ runtime: null }) });
    render();

    await screen.findByRole("heading", { level: 1 });
    expect(screen.queryByText(/NaN/)).toBeNull();
  });

  it("credits the director and links to their page", async () => {
    render();

    const link = await screen.findByRole("link", { name: "David Fincher" });
    expect(link).toHaveAttribute("href", "/person/7467");
  });

  it("fetches the videos endpoint once, not twice", async () => {
    const fetchMock = stubTmdb();
    render();

    await screen.findByRole("heading", { level: 1 });
    await waitFor(() => {
      const videoCalls = fetchMock.mock.calls.filter((call) =>
        String((call[0] as Request).url).includes("/videos"),
      );
      expect(videoCalls).toHaveLength(1);
    });
  });

  it("opens the trailer in a dialog only when asked", async () => {
    const user = userEvent.setup();
    render();

    const button = await screen.findByRole("button", { name: /Play trailer/ });
    expect(document.querySelector("iframe")).toBeNull();

    await user.click(button);
    await waitFor(() =>
      expect(document.querySelector("dialog iframe")).toHaveAttribute(
        "src",
        expect.stringContaining("trailerkey"),
      ),
    );
  });

  it("disables the trailer button when there is no trailer", async () => {
    stubTmdb({ videos: [] });
    render();

    expect(
      await screen.findByRole("button", { name: /No trailer available/ }),
    ).toBeDisabled();
  });

  it("emits Movie structured data built from the actual record", async () => {
    render();

    await waitFor(() => {
      const schemas = [
        ...document.querySelectorAll("script[type='application/ld+json']"),
      ].map((node) => JSON.parse(node.textContent ?? "{}"));

      const movie = schemas.find((schema) => schema["@type"] === "Movie");
      expect(movie).toMatchObject({
        name: "Fight Club",
        datePublished: "1999-10-15",
        duration: "PT2H19M",
        genre: ["Drama", "Thriller"],
      });
      expect(movie.director[0].name).toBe("David Fincher");
      expect(movie.actor.map((actor: { name: string }) => actor.name)).toContain(
        "Brad Pitt",
      );
      expect(movie.aggregateRating.ratingValue).toBe(8.4);
    });
  });

  it("declares a canonical pointing at the slugged URL", async () => {
    render("/movie/550");

    await waitFor(() =>
      expect(
        document.querySelector("link[rel='canonical']")?.getAttribute("href"),
      ).toMatch(/\/movie\/550\/fight-club$/),
    );
  });

  it("builds the meta description from the movie, not a generic string", async () => {
    render();

    await waitFor(() => {
      const description = document
        .querySelector("meta[name='description']")
        ?.getAttribute("content");
      expect(description).toContain("Fight Club");
      expect(description).toContain("directed by David Fincher");
    });
  });

  it("renders an error state for an unknown id instead of redirecting in a loop", async () => {
    stubTmdb({ failDetails: true });
    render("/movie/999999");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Movie not found",
    );
  });

  it("404s on a non-numeric id without calling the API", async () => {
    const fetchMock = stubTmdb();
    renderWithProviders(<MovieDetailsPage />, {
      route: "/movie/not-an-id",
      path: "/movie/:id/:slug?",
    });

    expect(
      await screen.findByRole("heading", { name: /could not find that page/i }),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
