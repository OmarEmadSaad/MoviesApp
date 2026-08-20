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
