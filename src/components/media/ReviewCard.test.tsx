import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { ReviewCard } from "./ReviewCard";
import { review } from "@/test/factories";

const longContent = "word ".repeat(200);

describe("ReviewCard", () => {
  it("shows the author's display name and falls back to the username", () => {
    const { unmount } = renderWithProviders(<ReviewCard review={review()} />);
    expect(screen.getByText("A Critic")).toBeInTheDocument();
    unmount();

    renderWithProviders(
      <ReviewCard
        review={review({
          author_details: {
            name: "",
            username: "anon",
            avatar_path: null,
            rating: null,
          },
        })}
      />,
    );
    expect(screen.getByText("anon")).toBeInTheDocument();
  });

  it("renders the date as a machine-readable time element", () => {
    renderWithProviders(<ReviewCard review={review()} />);

    const time = screen.getByText("1 May 2020");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("dateTime", "2020-05-01T12:00:00.000Z");
  });

  it("does not offer expand/collapse for a short review", () => {
    renderWithProviders(<ReviewCard review={review()} />);

    expect(screen.queryByRole("button", { name: /Show more/ })).toBeNull();
    expect(screen.getByText("A remarkable film.")).toBeInTheDocument();
  });

  it("truncates a long review and expands it on demand", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewCard review={review({ content: longContent })} />);

    const toggle = screen.getByRole("button", { name: "Show more" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(
      screen.getByRole("button", { name: "Show less" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps expansion state per card", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <ReviewCard review={review({ id: "a", content: longContent })} />
        <ReviewCard review={review({ id: "b", content: longContent })} />
      </>,
    );

    const toggles = screen.getAllByRole("button", { name: "Show more" });
    await user.click(toggles[0]);

    expect(screen.getByRole("button", { name: "Show less" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Show more" })).toHaveLength(1);
  });

  it("shows the rating only when asked and only when there is one", () => {
    const { unmount } = renderWithProviders(
      <ReviewCard review={review()} showRating={false} />,
    );
    expect(screen.queryByText("9")).toBeNull();
    unmount();

    renderWithProviders(<ReviewCard review={review()} />);
    expect(screen.getByText("9")).toBeInTheDocument();
  });

  it("renders an initial when the reviewer has no avatar", () => {
    renderWithProviders(<ReviewCard review={review()} />);

    expect(document.querySelector("img")).toBeNull();
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});
