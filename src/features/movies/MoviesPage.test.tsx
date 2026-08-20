import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import MoviesPage from "./MoviesPage";
import { movieSummary } from "@/test/factories";

const results = [
  movieSummary({ id: 1, title: "First Film" }),
  movieSummary({ id: 2, title: "Second Film" }),
];

function stubDiscover() {
  const fetchMock = vi.fn(
    async (_input: RequestInfo | URL) =>
      new Response(
        JSON.stringify({
          results,
          page: 1,
          total_pages: 500,
          total_results: 10000,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("MoviesPage", () => {
  beforeEach(() => {
    stubDiscover();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the catalogue grid", async () => {
    renderWithProviders(<MoviesPage />, { route: "/movies", path: "/movies" });

    expect(
      await screen.findByRole("heading", { name: "First Film" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Movies" }),
    ).toBeInTheDocument();
  });


  it("reads the requested page from the URL", async () => {
    const fetchMock = stubDiscover();
    renderWithProviders(<MoviesPage />, {
      route: "/movies?page=4",
      path: "/movies",
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toContain("page=4");
    const nav = await screen.findByRole("navigation", {
      name: "Movies pagination",
    });
    expect(within(nav).getByText(/Page/)).toHaveTextContent("Page 4 of 500");
  });

  it("declares a page-specific canonical URL", async () => {
    renderWithProviders(<MoviesPage />, {
      route: "/movies?page=4",
      path: "/movies",
    });

    await waitFor(() => {
      const canonical = document.querySelector("link[rel='canonical']");
      expect(canonical?.getAttribute("href")).toMatch(/\/movies\?page=4$/);
    });
  });

  it("keeps page one canonical at the bare path", async () => {
    renderWithProviders(<MoviesPage />, { route: "/movies", path: "/movies" });

    await waitFor(() => {
      const canonical = document.querySelector("link[rel='canonical']");
      expect(canonical?.getAttribute("href")).toMatch(/\/movies$/);
    });
  });

  it("gives each page a distinct title so results are not duplicates", async () => {
    const { unmount } = renderWithProviders(<MoviesPage />, {
      route: "/movies",
      path: "/movies",
    });
    await waitFor(() => expect(document.title).toBe("Movies | React Movies"));
    unmount();

    renderWithProviders(<MoviesPage />, {
      route: "/movies?page=9",
      path: "/movies",
    });
    await waitFor(() =>
      expect(document.title).toBe("Movies - page 9 | React Movies"),
    );
  });

  it("emits an ItemList so the grid is machine-readable", async () => {
    renderWithProviders(<MoviesPage />, { route: "/movies", path: "/movies" });

    await waitFor(() => {
      const scripts = [
        ...document.querySelectorAll("script[type='application/ld+json']"),
      ].map((node) => JSON.parse(node.textContent ?? "{}"));

      const itemList = scripts.find((schema) => schema["@type"] === "ItemList");
      expect(itemList?.itemListElement).toHaveLength(2);
      expect(itemList.itemListElement[0].url).toMatch(/\/movie\/1\/first-film$/);

      const breadcrumb = scripts.find(
        (schema) => schema["@type"] === "BreadcrumbList",
      );
      expect(breadcrumb?.itemListElement).toHaveLength(2);
    });
  });

  it("renders pagination as links to adjacent pages", async () => {
    renderWithProviders(<MoviesPage />, {
      route: "/movies?page=3",
      path: "/movies",
    });

    await waitFor(() =>
      expect(
        screen.getByRole("link", { name: "Go to next page" }),
      ).toHaveAttribute("href", "/movies?page=4"),
    );
  });

  it("shows an error state when TMDB fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 })),
    );

    renderWithProviders(<MoviesPage />, { route: "/movies", path: "/movies" });

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("shows an empty state rather than a bare grid when a page has no results", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({ results: [], page: 1, total_pages: 1, total_results: 0 }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          ),
      ),
    );

    renderWithProviders(<MoviesPage />, { route: "/movies", path: "/movies" });

    expect(
      await screen.findByText("No movies on this page"),
    ).toBeInTheDocument();
  });
});
