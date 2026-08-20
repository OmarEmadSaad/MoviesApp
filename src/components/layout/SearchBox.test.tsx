import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { SearchBox } from "./SearchBox";
import { movieSummary } from "@/test/factories";

const currentPath = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return {
    ...actual,
    useNavigate: () => currentPath,
  };
});

function mockSearch(results = [movieSummary()]) {
  return vi.fn(async () =>
    new Response(JSON.stringify({ results, page: 1, total_pages: 1, total_results: results.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

function Harness() {
  return (
    <SearchBox scope="movies" onScopeChange={() => {}} inputIdSuffix="test" />
  );
}

describe("SearchBox", () => {
  beforeEach(() => {
    currentPath.mockClear();
    vi.useRealTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not call the API on every keystroke", async () => {
    const fetchMock = mockSearch();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    renderWithProviders(<Harness />);
    const input = screen.getByRole("combobox");

    await user.type(input, "fight");



    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1), {
      timeout: 2000,
    });
  });

  it("does not search for a single character", async () => {
    const fetchMock = mockSearch();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    renderWithProviders(<Harness />);
    await user.type(screen.getByRole("combobox"), "f");

    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("navigates to the search results page on submit", async () => {
    vi.stubGlobal("fetch", mockSearch());
    const user = userEvent.setup();

    renderWithProviders(<Harness />);
    await user.type(screen.getByRole("combobox"), "fight club{Enter}");

    expect(currentPath).toHaveBeenCalledWith("/search/movies/fight%20club");
  });

  it("ignores an empty submit instead of navigating to a blank query", async () => {
    vi.stubGlobal("fetch", mockSearch());
    const user = userEvent.setup();

    renderWithProviders(<Harness />);
    await user.type(screen.getByRole("combobox"), "   {Enter}");

    expect(currentPath).not.toHaveBeenCalled();
  });

  it("shows suggestions and navigates to the one chosen with the keyboard", async () => {
    vi.stubGlobal("fetch", mockSearch());
    const user = userEvent.setup();

    renderWithProviders(<Harness />);
    const input = screen.getByRole("combobox");
    await user.type(input, "fight");

    const option = await screen.findByRole("option", { name: /Fight Club/ });
    expect(option).toBeInTheDocument();


    await user.keyboard("{ArrowDown}{Enter}");
    expect(currentPath).toHaveBeenCalledWith("/movie/550/fight-club");
  });

  it("wires the combobox to its listbox for assistive tech", async () => {
    vi.stubGlobal("fetch", mockSearch());
    const user = userEvent.setup();

    renderWithProviders(<Harness />);
    const input = screen.getByRole("combobox");
    await user.type(input, "fight");

    await screen.findByRole("listbox");
    await waitFor(() => expect(input).toHaveAttribute("aria-expanded", "true"));
    expect(input).toHaveAttribute("aria-controls");
  });

  it("reports an empty result set rather than showing a blank dropdown", async () => {
    vi.stubGlobal("fetch", mockSearch([]));
    const user = userEvent.setup();

    renderWithProviders(<Harness />);
    await user.type(screen.getByRole("combobox"), "zzzzz");

    expect(await screen.findByText(/No movies match/)).toBeInTheDocument();
  });

  it("surfaces a failed request instead of failing silently", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("nope", { status: 500 })),
    );
    const user = userEvent.setup();

    renderWithProviders(<Harness />);
    await user.type(screen.getByRole("combobox"), "fight");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /Could not load suggestions/,
    );
  });

  it("clears the field with the clear button", async () => {
    vi.stubGlobal("fetch", mockSearch());
    const user = userEvent.setup();

    renderWithProviders(<Harness />);
    const input = screen.getByRole("combobox");
    await user.type(input, "fight");



    await user.click(screen.getByRole("button", { name: /Clear/i }));
    expect(input).toHaveValue("");
  });
});
