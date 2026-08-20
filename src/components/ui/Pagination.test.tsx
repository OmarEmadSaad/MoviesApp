import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { Pagination } from "./Pagination";
import { buildPageHref } from "@/hooks/usePageParam";

function renderPagination(page: number, totalPages = 500) {
  return renderWithProviders(
    <Pagination
      page={page}
      totalPages={totalPages}
      buildHref={(target) => buildPageHref("/movies", target)}
      label="Movies pagination"
    />,
  );
}

describe("Pagination", () => {
  it("renders real links so a crawler can follow them", () => {
    renderPagination(3);

    expect(screen.getByRole("link", { name: "Go to next page" })).toHaveAttribute(
      "href",
      "/movies?page=4",
    );
    expect(
      screen.getByRole("link", { name: "Go to previous page" }),
    ).toHaveAttribute("href", "/movies?page=2");
  });

  it("omits the page parameter for page one to avoid a duplicate URL", () => {
    renderPagination(2);

    expect(
      screen.getByRole("link", { name: "Go to previous page" }),
    ).toHaveAttribute("href", "/movies");
  });

  it("marks prev and next for crawlers", () => {
    renderPagination(3);

    expect(screen.getByRole("link", { name: "Go to next page" })).toHaveAttribute(
      "rel",
      "next",
    );
    expect(
      screen.getByRole("link", { name: "Go to previous page" }),
    ).toHaveAttribute("rel", "prev");
  });

  it("disables backwards navigation on the first page", () => {
    renderPagination(1);

    expect(screen.queryByRole("link", { name: "Go to previous page" })).toBeNull();
    expect(screen.getByLabelText("Go to previous page")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("disables forwards navigation on the last page", () => {
    renderPagination(500);

    expect(screen.queryByRole("link", { name: "Go to next page" })).toBeNull();
    expect(screen.getByLabelText("Go to last page")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("announces the current position", () => {
    renderPagination(7, 42);

    expect(screen.getByText(/Page/)).toHaveTextContent("Page 7 of 42");
    expect(
      screen.getByRole("navigation", { name: "Movies pagination" }),
    ).toBeInTheDocument();
  });
});
