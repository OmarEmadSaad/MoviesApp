import { describe, expect, it } from "vitest";
import { pickTrailer } from "./trailer";
import type { Video } from "@/types/tmdb";

const video = (overrides: Partial<Video>): Video => ({
  id: "1",
  key: "key",
  name: "A video",
  site: "YouTube",
  type: "Trailer",
  official: false,
  size: 1080,
  ...overrides,
});

describe("pickTrailer", () => {
  it("prefers the official trailer over an unofficial one", () => {
    const result = pickTrailer([
      video({ id: "1", key: "fan", official: false }),
      video({ id: "2", key: "official", official: true }),
    ]);
    expect(result?.key).toBe("official");
  });

  it("falls back to any trailer, then to a teaser", () => {
    expect(pickTrailer([video({ key: "any", official: false })])?.key).toBe(
      "any",
    );
    expect(
      pickTrailer([video({ key: "teaser", type: "Teaser" })])?.key,
    ).toBe("teaser");
  });

  it("ignores videos hosted somewhere other than YouTube", () => {
    expect(pickTrailer([video({ site: "Vimeo" })])).toBeNull();
  });

  it("ignores clips and featurettes", () => {
    expect(pickTrailer([video({ type: "Clip" })])).toBeNull();
  });

  it("handles an empty or missing list", () => {
    expect(pickTrailer([])).toBeNull();
    expect(pickTrailer(undefined)).toBeNull();
  });
});
