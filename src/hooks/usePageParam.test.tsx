import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { buildPageHref, usePageParam } from "./usePageParam";

function read(url: string) {
  const { result } = renderHook(() => usePageParam(500), {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
    ),
  });
  return result.current;
}

describe("usePageParam", () => {
  it("reads a valid page", () => {
    expect(read("/movies?page=7")).toBe(7);
  });

  it("defaults to page one when absent", () => {
    expect(read("/movies")).toBe(1);
  });

  it.each(["?page=0", "?page=-3", "?page=abc", "?page="])(
    "clamps %s to page one",
    (query) => {
      expect(read(`/movies${query}`)).toBe(1);
    },
  );

  it("clamps above TMDB's ceiling", () => {
    expect(read("/movies?page=9999")).toBe(500);
  });

  it("truncates a fractional page", () => {
    expect(read("/movies?page=3.7")).toBe(3);
  });
});

describe("buildPageHref", () => {
  it("keeps page one canonical at the bare path", () => {
    expect(buildPageHref("/movies", 1)).toBe("/movies");
    expect(buildPageHref("/movies", 2)).toBe("/movies?page=2");
  });
});
