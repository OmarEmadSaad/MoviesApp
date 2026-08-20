import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { Header } from "./Header";

describe("Header", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ results: [] }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
      ),
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it("exposes a skip link as the first focusable element", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    await user.tab();
    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveFocus();
  });

  it("marks the active route for sighted and screen reader users", () => {
    renderWithProviders(<Header />, { route: "/movies" });

    const movies = screen.getAllByRole("link", { name: "Movies" })[0];
    expect(movies).toHaveAttribute("aria-current", "page");
  });

  it("does not mark Home active on a sub-route", () => {
    renderWithProviders(<Header />, { route: "/movies" });

    const home = screen.getAllByRole("link", { name: "Home" })[0];
    expect(home).not.toHaveAttribute("aria-current");
  });

  it("hides the mobile panel until the toggle is pressed", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-menu")).toHaveAttribute("hidden");

    await user.click(toggle);
    expect(
      screen.getByRole("button", { name: "Close menu" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("mobile-menu")).not.toHaveAttribute("hidden");
  });

  it("wires the toggle to the panel it controls", () => {
    renderWithProviders(<Header />);

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-controls",
      "mobile-menu",
    );
  });




  it("exposes only the desktop nav until the mobile panel is opened", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    expect(screen.getAllByRole("navigation")).toHaveLength(1);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(
      screen.getByRole("navigation", { name: "Main (mobile)" }),
    ).toBeInTheDocument();
  });

  it("gives the desktop and mobile search inputs distinct ids", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const ids = screen.getAllByRole("combobox").map((input) => input.id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });
});
