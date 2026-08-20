import { describe, expect, it } from "vitest";
import {
  backdropUrl,
  buildSrcSet,
  posterSrcSet,
  posterUrl,
  profileUrl,
  youtubeEmbedUrl,
  youtubeThumbnailUrl,
} from "./images";

describe("image URL builders", () => {
  it("builds a sized TMDB URL", () => {
    expect(posterUrl("/abc.jpg", 342)).toBe(
      "https://image.tmdb.org/t/p/w342/abc.jpg",
    );
  });

  it("normalises paths that arrive without a leading slash", () => {
    expect(posterUrl("abc.jpg", 185)).toBe(
      "https://image.tmdb.org/t/p/w185/abc.jpg",
    );
  });

  it.each([null, undefined, ""])("returns null for %s", (path) => {
    expect(posterUrl(path)).toBeNull();
    expect(profileUrl(path)).toBeNull();
    expect(backdropUrl(path)).toBeNull();
  });

  it("supports the original backdrop size", () => {
    expect(backdropUrl("/b.jpg", "original")).toBe(
      "https://image.tmdb.org/t/p/original/b.jpg",
    );
  });
});

describe("buildSrcSet", () => {
  it("emits one candidate per width with its descriptor", () => {
    expect(buildSrcSet("/a.jpg", [92, 154])).toBe(
      "https://image.tmdb.org/t/p/w92/a.jpg 92w, https://image.tmdb.org/t/p/w154/a.jpg 154w",
    );
  });

  it("covers the full poster ladder so the browser can pick the cheapest", () => {
    const srcSet = posterSrcSet("/a.jpg");
    expect(srcSet).toContain("92w");
    expect(srcSet).toContain("780w");
  });

  it("returns undefined when there is no image, so no srcSet attribute renders", () => {
    expect(buildSrcSet(null, [92])).toBeUndefined();
  });
});

describe("youtube helpers", () => {
  it("builds a privacy-conscious embed URL", () => {
    expect(youtubeEmbedUrl("abc")).toBe(
      "https://www.youtube.com/embed/abc?modestbranding=1&rel=0",
    );
  });

  it("builds a thumbnail URL for the video facade", () => {
    expect(youtubeThumbnailUrl("abc")).toBe(
      "https://i.ytimg.com/vi/abc/hqdefault.jpg",
    );
  });
});
