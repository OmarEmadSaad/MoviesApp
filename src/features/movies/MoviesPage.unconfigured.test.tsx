import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import App from "@/App";
import MoviesPage from "./MoviesPage";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("with no TMDB token configured", () => {
  it("renders the page instead of crashing the app", async () => {
    vi.stubEnv("VITE_TMDB_TOKEN", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    renderWithProviders(<MoviesPage />, { route: "/movies", path: "/movies" });

    expect(
      await screen.findByRole("heading", { level: 1, name: "Movies" }),
    ).toBeInTheDocument();
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("does not send a request that is guaranteed to fail", async () => {
    vi.stubEnv("VITE_TMDB_TOKEN", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    renderWithProviders(<MoviesPage />, { route: "/movies", path: "/movies" });
    await screen.findByRole("alert");

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows an actionable notice naming the missing variable", async () => {
    vi.stubEnv("VITE_TMDB_TOKEN", "");
    vi.stubGlobal("fetch", vi.fn());

    renderWithProviders(<App />, { route: "/contact-us" });

    expect(
      await screen.findByText("This site is not configured yet."),
    ).toBeInTheDocument();
    expect(screen.getByText("VITE_TMDB_TOKEN")).toBeInTheDocument();
  });

  it("keeps navigation usable so the site is not dead", async () => {
    vi.stubEnv("VITE_TMDB_TOKEN", "");
    vi.stubGlobal("fetch", vi.fn());

    renderWithProviders(<App />, { route: "/contact-us" });

    const nav = await screen.findByRole("navigation", { name: "Main" });
    expect(nav).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Movies" })[0]).toHaveAttribute(
      "href",
      "/movies",
    );
  });

  it("hides the notice once a token is present", async () => {
    vi.stubEnv("VITE_TMDB_TOKEN", "a-real-token");
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

    renderWithProviders(<App />, { route: "/contact-us" });

    await screen.findByRole("navigation", { name: "Main" });
    expect(screen.queryByText("This site is not configured yet.")).toBeNull();
  });
});
