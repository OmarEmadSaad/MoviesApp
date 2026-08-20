import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { MediaCard } from "./MediaCard";
import { movieSummary, seriesSummary } from "@/test/factories";

describe("MediaCard", () => {
  it("renders the title as a heading linking to the slugged detail URL", () => {
    renderWithProviders(
      <MediaCard item={movieSummary()} mediaType="movie" />,
    );

    const heading = screen.getByRole("heading", { name: "Fight Club" });
    expect(within(heading).getByRole("link")).toHaveAttribute(
      "href",
      "/movie/550/fight-club",
    );
  });

  it("uses the series route and name for TV items", () => {
    renderWithProviders(
      <MediaCard item={seriesSummary()} mediaType="tv" />,
    );

    const heading = screen.getByRole("heading", { name: "Breaking Bad" });
    expect(within(heading).getByRole("link")).toHaveAttribute(
      "href",
      "/series/1396/breaking-bad",
    );
  });

  it("shows the release year and rating", () => {
    renderWithProviders(<MediaCard item={movieSummary()} mediaType="movie" />);

    expect(screen.getByText(/1999/)).toBeInTheDocument();
    expect(screen.getByText(/8\.4/)).toBeInTheDocument();
  });

  it("exposes the rating to assistive tech as a single labelled value", () => {
    renderWithProviders(<MediaCard item={movieSummary()} mediaType="movie" />);

    expect(
      screen.getByRole("img", { name: "Rated 8.4 out of 10" }),
    ).toBeInTheDocument();
  });

  it("lazy-loads by default and eagerly loads above-the-fold cards", () => {
    const { unmount } = renderWithProviders(
      <MediaCard item={movieSummary()} mediaType="movie" />,
    );
    expect(document.querySelector("img")).toHaveAttribute("loading", "lazy");
    expect(document.querySelector("img")).toHaveAttribute(
      "fetchpriority",
      "auto",
    );
    unmount();

    renderWithProviders(
      <MediaCard item={movieSummary()} mediaType="movie" priority />,
    );
    expect(document.querySelector("img")).toHaveAttribute("loading", "eager");


    expect(document.querySelector("img")).toHaveAttribute(
      "fetchpriority",
      "high",
    );
  });

  it("serves a responsive srcSet rather than a fixed w500 poster", () => {
    renderWithProviders(<MediaCard item={movieSummary()} mediaType="movie" />);

    const img = document.querySelector("img");
    expect(img?.getAttribute("srcset")).toContain("w92");
    expect(img?.getAttribute("sizes")).toBeTruthy();
  });


  it("renders a labelled placeholder when there is no poster", () => {
    renderWithProviders(
      <MediaCard
        item={movieSummary({ poster_path: null })}
        mediaType="movie"
      />,
    );

    expect(document.querySelector("img")).toBeNull();
    expect(screen.getByText("No image")).toBeInTheDocument();
  });

  it("falls back to a readable title when TMDB has none", () => {
    renderWithProviders(
      <MediaCard
        item={{ ...movieSummary(), title: undefined, name: undefined }}
        mediaType="movie"
      />,
    );

    expect(screen.getByRole("heading", { name: "Untitled" })).toBeInTheDocument();
  });

  it("only shows the synopsis when asked", () => {
    const { unmount } = renderWithProviders(
      <MediaCard item={movieSummary()} mediaType="movie" />,
    );
    expect(screen.queryByText(/insomniac office worker/)).toBeNull();
    unmount();

    renderWithProviders(
      <MediaCard item={movieSummary()} mediaType="movie" showOverview />,
    );
    expect(screen.getByText(/insomniac office worker/)).toBeInTheDocument();
  });
});
