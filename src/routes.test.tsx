import { describe, expect, it } from "vitest";
import { matchRoutes } from "react-router-dom";
import { routes } from "./routes";

function match(pathname: string) {
  const matches = matchRoutes(routes, pathname);
  return matches?.[matches.length - 1]?.route.path;
}

describe("route table", () => {
  it("has exactly one catch-all", () => {
    expect(routes.filter((route) => route.path === "*")).toHaveLength(1);
  });

  it("declares no duplicate paths", () => {
    const paths = routes.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("puts the catch-all last so nothing is stranded behind it", () => {
    expect(routes[routes.length - 1].path).toBe("*");
  });

  it.each([
    ["/", "/"],
    ["/movies", "/movies"],
    ["/series", "/series"],
    ["/contact-us", "/contact-us"],
  ])("matches the static route %s", (pathname, expected) => {
    expect(match(pathname)).toBe(expected);
  });

  it("matches a movie with and without a slug", () => {
    expect(match("/movie/550")).toBe("/movie/:id/:slug?");
    expect(match("/movie/550/fight-club")).toBe("/movie/:id/:slug?");
  });

  it("prefers a named movie sub-route over the slug pattern", () => {
    expect(match("/movie/550/cast")).toBe("/movie/:id/cast");
    expect(match("/movie/550/reviews")).toBe("/movie/:id/reviews");
    expect(match("/movie/550/collection/1")).toBe(
      "/movie/:id/collection/:collectionId",
    );
  });

  it("prefers a named series sub-route over the slug pattern", () => {
    expect(match("/series/1396/cast")).toBe("/series/:id/cast");
    expect(match("/series/1396/seasons")).toBe("/series/:id/seasons");
    expect(match("/series/1396/media")).toBe("/series/:id/media");
    expect(match("/series/1396/season/2")).toBe(
      "/series/:id/season/:seasonNumber",
    );
    expect(match("/series/1396/breaking-bad")).toBe("/series/:id/:slug?");
  });

  it("keeps the legacy URLs routable rather than 404-ing them", () => {
    expect(match("/tv/1396")).toBe("/tv/:id");
    expect(match("/tv/1396/reviews")).toBe("/tv/:id/reviews");
    expect(match("/movie/550/cast_crew")).toBe("/movie/:id/cast_crew");
    expect(match("/movie/550/movie_review")).toBe("/movie/:id/movie_review");
    expect(match("/series/1396/videos")).toBe("/series/:id/videos");
    expect(match("/series/1396/posters")).toBe("/series/:id/posters");
  });

  it("falls through to the catch-all for anything unknown", () => {
    expect(match("/nope")).toBe("*");
    expect(match("/movie")).toBe("*");
  });
});
