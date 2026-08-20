import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "@/store";
import { tmdbApi } from "./api";
import { credits, movieDetails, movieSummary } from "@/test/factories";

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("tmdbApi", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input instanceof Request ? input.url : input);
      if (url.includes("/videos")) {
        return jsonResponse({ results: [{ id: "v", key: "k", site: "YouTube" }] });
      }
      if (url.includes("/keywords")) {
        return jsonResponse({ keywords: [{ id: 1, name: "boxing" }] });
      }
      if (url.includes("/reviews")) {
        return jsonResponse({ results: [], page: 1, total_pages: 0, total_results: 0 });
      }
      if (url.includes("/credits")) {
        return jsonResponse(credits());
      }
      if (url.includes("/discover/movie")) {
        return jsonResponse({
          results: [movieSummary()],
          page: 1,
          total_pages: 500,
          total_results: 10000,
        });
      }
      return jsonResponse(movieDetails());
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the bearer token and accept header on every request", async () => {
    const store = createStore();
    await store.dispatch(tmdbApi.endpoints.movie.initiate(550));

    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.headers.get("Authorization")).toMatch(/^Bearer .+/);
    expect(request.headers.get("accept")).toBe("application/json");
  });

  it("de-duplicates concurrent identical requests into one fetch", async () => {
    const store = createStore();
    await Promise.all([
      store.dispatch(tmdbApi.endpoints.movieVideos.initiate(550)),
      store.dispatch(tmdbApi.endpoints.movieVideos.initiate(550)),
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("serves a repeat request from cache instead of hitting the network", async () => {
    const store = createStore();
    await store.dispatch(tmdbApi.endpoints.movie.initiate(550));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await store.dispatch(tmdbApi.endpoints.movie.initiate(550));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("caches per argument, so a different id still fetches", async () => {
    const store = createStore();
    await store.dispatch(tmdbApi.endpoints.movie.initiate(550));
    await store.dispatch(tmdbApi.endpoints.movie.initiate(551));

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("unwraps paginated responses to the results array", async () => {
    const store = createStore();
    const result = await store.dispatch(
      tmdbApi.endpoints.movieReviews.initiate(550),
    );

    expect(Array.isArray(result.data)).toBe(true);
  });

  it("unwraps the oddly-shaped keywords response", async () => {
    const store = createStore();
    const result = await store.dispatch(
      tmdbApi.endpoints.movieKeywords.initiate(550),
    );

    expect(result.data).toEqual([{ id: 1, name: "boxing" }]);
  });

  it("keeps paginated list metadata the UI needs", async () => {
    const store = createStore();
    const result = await store.dispatch(
      tmdbApi.endpoints.discoverMovies.initiate(1),
    );

    expect(result.data?.total_pages).toBe(500);
    expect(result.data?.results).toHaveLength(1);
  });

  it("reports a failed request as an error rather than throwing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 404 })),
    );

    const store = createStore();
    const result = await store.dispatch(tmdbApi.endpoints.movie.initiate(1));

    expect(result.isError).toBe(true);
    expect(result.data).toBeUndefined();
  });

  it("escapes the search query so titles with spaces and symbols work", async () => {
    const store = createStore();
    await store.dispatch(
      tmdbApi.endpoints.searchMovies.initiate("fight club & more"),
    );

    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toContain("query=fight%20club%20%26%20more");
  });
});
