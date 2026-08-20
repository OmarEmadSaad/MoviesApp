import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl, getTmdbToken, isTmdbConfigured } from "./config";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getTmdbToken", () => {
  it("returns the configured token", () => {
    vi.stubEnv("VITE_TMDB_TOKEN", "abc123");
    expect(getTmdbToken()).toBe("abc123");
    expect(isTmdbConfigured()).toBe(true);
  });

  it.each(["", "   "])(
    "returns null rather than throwing for %o",
    (value) => {
      vi.stubEnv("VITE_TMDB_TOKEN", value);
      expect(() => getTmdbToken()).not.toThrow();
      expect(getTmdbToken()).toBeNull();
      expect(isTmdbConfigured()).toBe(false);
    },
  );
});

describe("getSiteUrl", () => {
  it("strips a trailing slash so canonicals never double up", () => {
    vi.stubEnv("VITE_SITE_URL", "https://example.com/");
    expect(getSiteUrl()).toBe("https://example.com");
  });

  it("falls back to localhost when unset", () => {
    vi.stubEnv("VITE_SITE_URL", "");
    expect(getSiteUrl()).toBe("http://localhost:5173");
  });
});

describe("getSiteUrl on Vercel", () => {
  it("falls back to the Vercel production URL when VITE_SITE_URL is unset", () => {
    vi.stubEnv("VITE_SITE_URL", "");
    vi.stubEnv("VITE_VERCEL_PROJECT_PRODUCTION_URL", "movies-app.vercel.app");
    expect(getSiteUrl()).toBe("https://movies-app.vercel.app");
  });

  it("prefers an explicit VITE_SITE_URL over the Vercel fallback", () => {
    vi.stubEnv("VITE_SITE_URL", "https://custom-domain.com");
    vi.stubEnv("VITE_VERCEL_PROJECT_PRODUCTION_URL", "movies-app.vercel.app");
    expect(getSiteUrl()).toBe("https://custom-domain.com");
  });

  it("adds the protocol Vercel omits from its host value", () => {
    vi.stubEnv("VITE_SITE_URL", "");
    vi.stubEnv("VITE_VERCEL_PROJECT_PRODUCTION_URL", "example.vercel.app");
    expect(getSiteUrl()).toMatch(/^https:\/\//);
  });

  it("leaves an explicit http origin alone", () => {
    vi.stubEnv("VITE_SITE_URL", "http://staging.local");
    expect(getSiteUrl()).toBe("http://staging.local");
  });

  it("strips trailing slashes from either source", () => {
    vi.stubEnv("VITE_SITE_URL", "");
    vi.stubEnv("VITE_VERCEL_PROJECT_PRODUCTION_URL", "example.vercel.app///");
    expect(getSiteUrl()).toBe("https://example.vercel.app");
  });

  // Canonical and Open Graph URLs must never be origin-less.
  it("never produces a relative canonical origin", () => {
    for (const [site, vercel] of [
      ["", ""],
      ["", "x.vercel.app"],
      ["https://y.com", ""],
    ]) {
      vi.stubEnv("VITE_SITE_URL", site);
      vi.stubEnv("VITE_VERCEL_PROJECT_PRODUCTION_URL", vercel);
      expect(getSiteUrl()).toMatch(/^https?:\/\/.+/);
    }
  });
});
