import { describe, expect, it } from "vitest";
import { LOCAL_SITE_URL, resolveSiteUrl } from "./site-url";

describe("resolveSiteUrl", () => {
  it("prefers an explicit origin", () => {
    expect(resolveSiteUrl("https://custom.com", "app.vercel.app")).toBe(
      "https://custom.com",
    );
  });

  it("falls back to the Vercel production host", () => {
    expect(resolveSiteUrl(undefined, "app.vercel.app")).toBe(
      "https://app.vercel.app",
    );
    expect(resolveSiteUrl("", "app.vercel.app")).toBe("https://app.vercel.app");
    expect(resolveSiteUrl("   ", "app.vercel.app")).toBe(
      "https://app.vercel.app",
    );
  });

  it("adds https to a bare host", () => {
    expect(resolveSiteUrl("example.com")).toBe("https://example.com");
  });

  it("keeps an explicit protocol", () => {
    expect(resolveSiteUrl("http://staging.local")).toBe("http://staging.local");
  });

  it("strips trailing slashes", () => {
    expect(resolveSiteUrl("https://example.com///")).toBe("https://example.com");
  });

  it("falls back to localhost when nothing is configured", () => {
    expect(resolveSiteUrl()).toBe(LOCAL_SITE_URL);
    expect(resolveSiteUrl("", "")).toBe(LOCAL_SITE_URL);
  });

  // Canonical, Open Graph, JSON-LD, sitemap and robots all build on this, so
  // an origin-less value would corrupt every absolute URL the site emits.
  it("always returns an absolute origin", () => {
    const inputs: [string | undefined, string | undefined][] = [
      [undefined, undefined],
      ["", ""],
      ["example.com", undefined],
      [undefined, "app.vercel.app"],
      ["https://a.com/", "b.vercel.app"],
    ];
    for (const [explicit, vercel] of inputs) {
      expect(resolveSiteUrl(explicit, vercel)).toMatch(/^https?:\/\/[^/]+$/);
    }
  });
});
