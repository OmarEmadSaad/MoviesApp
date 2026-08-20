import { afterEach, describe, expect, it, vi } from "vitest";
import { movieSummary, seriesSummary } from "@/test/factories";

function json(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function stubTmdb() {
  const mock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input instanceof Request ? input.url : input);
    const results = url.includes("/tv/")
      ? [seriesSummary({ id: 1, name: "Server Series" })]
      : [movieSummary({ id: 1, title: "Server Movie" })];
    return json({ results, page: 1, total_pages: 500, total_results: 100 });
  });
  vi.stubGlobal("fetch", mock);
  return mock;
}

async function serverRender(url: string) {
  vi.resetModules();
  const helmet = await import("react-helmet-async");
  const previous = helmet.HelmetProvider.canUseDOM;
  helmet.HelmetProvider.canUseDOM = false;
  try {
    const { render } = await import("@/entry-server");
    return await render(url);
  } finally {
    helmet.HelmetProvider.canUseDOM = previous;
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("server render", () => {
  it("puts real TMDB data into the HTML for /movies", async () => {
    vi.stubEnv("VITE_TMDB_TOKEN", "test-token");
    stubTmdb();

    const { html } = await serverRender("/movies");

    expect(html).toContain("Server Movie");
    expect(html).toMatch(/href="\/movie\/1\/server-movie"/);
    expect(html).toContain("image.tmdb.org");
  });

  it("puts real TMDB data into the HTML for /series", async () => {
    vi.stubEnv("VITE_TMDB_TOKEN", "test-token");
    stubTmdb();

    const { html } = await serverRender("/series");

    expect(html).toContain("Server Series");
    expect(html).toMatch(/href="\/series\/1\/server-series"/);
  });

  it("emits full metadata in the head for a prerendered route", async () => {
    vi.stubEnv("VITE_TMDB_TOKEN", "test-token");
    stubTmdb();

    const { head } = await serverRender("/movies");

    expect(head).toContain("<title");
    expect(head).toContain('name="description"');
    expect(head).toContain('rel="canonical"');
    expect(head).toContain('property="og:title"');
    expect(head).toContain('name="twitter:card"');
    expect(head).toContain("application/ld+json");
  });

  // The root cause of the production outage: getTmdbToken() threw inside
  // prepareHeaders, which propagated out of the render and, in the browser,
  // out of hydration as React #418/#423.
  it("never throws when the token is missing", async () => {
    vi.stubEnv("VITE_TMDB_TOKEN", "");
    stubTmdb();

    await expect(serverRender("/movies")).resolves.toBeDefined();
  });

  it("renders the configuration notice and keeps the chrome when unconfigured", async () => {
    vi.stubEnv("VITE_TMDB_TOKEN", "");
    stubTmdb();

    const { html } = await serverRender("/movies");

    expect(html).toContain("This site is not configured yet.");
    expect(html).toContain("<header");
    expect(html).toContain("<footer");
    expect(html).toContain("<nav");
  });

  it("issues no network request when the token is missing", async () => {
    vi.stubEnv("VITE_TMDB_TOKEN", "");
    const mock = stubTmdb();

    await serverRender("/movies");

    expect(mock).not.toHaveBeenCalled();
  });

  // The Toaster must stay out of the SSR output: its chunk is not loaded at
  // hydration time, so server-rendering it would guarantee a mismatch.
  it("keeps the toast container out of the server HTML", async () => {
    vi.stubEnv("VITE_TMDB_TOKEN", "test-token");
    stubTmdb();

    const { html } = await serverRender("/movies");

    expect(html).not.toContain("Toastify");
  });

  it("resolves lazy route chunks instead of emitting a Suspense fallback", async () => {
    vi.stubEnv("VITE_TMDB_TOKEN", "test-token");
    stubTmdb();

    const { html } = await serverRender("/movies");

    expect(html).not.toContain("Loading page");
    expect(html).toContain('id="main"');
  });
});
