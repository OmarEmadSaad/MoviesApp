import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/render";
import { Carousel, CarouselItem } from "./Carousel";

function render() {
  return renderWithProviders(
    <Carousel label="Top cast">
      <CarouselItem>
        <p>One</p>
      </CarouselItem>
      <CarouselItem>
        <p>Two</p>
      </CarouselItem>
    </Carousel>,
  );
}

describe("Carousel", () => {
  it("renders its items exactly once, in the markup", () => {
    render();

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("One")).toBeInTheDocument();
  });

  it("is a labelled, focusable scroll region", () => {
    render();

    const list = screen.getByRole("list", { name: "Top cast" });
    expect(list).toHaveAttribute("tabindex", "0");
  });

  it("labels its arrows with the rail they scroll", () => {
    render();

    expect(
      screen.getByRole("button", { name: "Scroll Top cast left" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Scroll Top cast right" }),
    ).toBeInTheDocument();
  });

  it("disables the left arrow at the start of the rail", () => {
    render();

    expect(
      screen.getByRole("button", { name: "Scroll Top cast left" }),
    ).toBeDisabled();
  });

  it("keeps the arrows out of the tab order, since the rail itself is focusable", () => {
    render();

    expect(
      screen.getByRole("button", { name: "Scroll Top cast right" }),
    ).toHaveAttribute("tabindex", "-1");
  });
});
