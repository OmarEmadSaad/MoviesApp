import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { MediaGrid } from "./MediaGrid";
import { movieSummary } from "@/test/factories";

const items = [
  movieSummary({ id: 1, title: "One" }),
  movieSummary({ id: 2, title: "Two" }),
];

describe("MediaGrid", () => {
  it("renders one list item per result under a labelled list", () => {
    renderWithProviders(
      <MediaGrid items={items} mediaType="movie" label="Popular movies" />,
    );

    const list = screen.getByRole("list", { name: "Popular movies" });
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(list).toBeInTheDocument();
  });

  it("shows skeletons while loading, not the empty state", () => {
    renderWithProviders(
      <MediaGrid items={undefined} mediaType="movie" isLoading label="Movies" />,
    );

    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.queryByText(/Nothing to show/)).toBeNull();
  });

  it("shows an empty state with the caller's copy when there are no results", () => {
    renderWithProviders(
      <MediaGrid
        items={[]}
        mediaType="movie"
        label="Movies"
        emptyTitle="No movies on this page"
      />,
    );

    expect(screen.getByText("No movies on this page")).toBeInTheDocument();
  });

  it("shows an error state with a working retry", async () => {
    const onRetry = vi.fn();
    renderWithProviders(
      <MediaGrid
        items={undefined}
        mediaType="movie"
        isError
        onRetry={onRetry}
        label="Movies"
      />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("prioritises only the leading cards", () => {
    renderWithProviders(
      <MediaGrid
        items={[
          ...items,
          movieSummary({ id: 3, title: "Three" }),
          movieSummary({ id: 4, title: "Four" }),
          movieSummary({ id: 5, title: "Five" }),
        ]}
        mediaType="movie"
        priorityCount={2}
        label="Movies"
      />,
    );

    const loading = [...document.querySelectorAll("img")].map((img) =>
      img.getAttribute("loading"),
    );
    expect(loading).toEqual(["eager", "eager", "lazy", "lazy", "lazy"]);
  });
});
