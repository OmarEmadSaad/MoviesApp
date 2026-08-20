import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { MediaTabs } from "./MediaTabs";
import type { Images, Video } from "@/types/tmdb";

const videos: Video[] = [
  {
    id: "v1",
    key: "abc",
    name: "Official Trailer",
    site: "YouTube",
    type: "Trailer",
    official: true,
    size: 1080,
  },
  {
    id: "v2",
    key: "def",
    name: "Vimeo clip",
    site: "Vimeo",
    type: "Clip",
    official: false,
    size: 1080,
  },
];

const images: Images = {
  backdrops: [
    { file_path: "/b1.jpg", width: 1920, height: 1080, aspect_ratio: 1.78, iso_639_1: null },
  ],
  posters: [
    { file_path: "/p1.jpg", width: 500, height: 750, aspect_ratio: 0.67, iso_639_1: null },
  ],
  logos: [],
};

function render() {
  return renderWithProviders(
    <MediaTabs videos={videos} images={images} title="Fight Club" />,
  );
}

describe("MediaTabs", () => {
  it("counts only playable YouTube videos", () => {
    render();
    expect(screen.getByRole("tab", { name: "Videos (1)" })).toBeInTheDocument();
  });

  it("exposes a real tab list with one selected tab", () => {
    render();

    expect(
      screen.getByRole("tablist", { name: "Media for Fight Club" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
      "Videos (1)",
    );
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
  });

  it("switches tabs with the arrow keys", async () => {
    const user = userEvent.setup();
    render();

    screen.getByRole("tab", { name: "Videos (1)" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
      "Backdrops (1)",
    );
  });

  it("wraps around at the ends of the tab list", async () => {
    const user = userEvent.setup();
    render();

    screen.getByRole("tab", { name: "Videos (1)" }).focus();
    await user.keyboard("{ArrowLeft}");

    expect(screen.getByRole("tab", { selected: true })).toHaveAccessibleName(
      "Posters (1)",
    );
  });

  it("does not embed a player until the user asks for one", async () => {
    const user = userEvent.setup();
    render();

    expect(document.querySelector("iframe")).toBeNull();

    await user.click(screen.getByRole("button", { name: /Play: Official Trailer/ }));
    expect(document.querySelector("iframe")).toHaveAttribute(
      "src",
      expect.stringContaining("youtube.com/embed/abc"),
    );
  });

  it("gives images alt text naming the title they belong to", async () => {
    const user = userEvent.setup();
    render();

    await user.click(screen.getByRole("tab", { name: "Posters (1)" }));
    expect(
      screen.getByAltText("Poster artwork for Fight Club"),
    ).toBeInTheDocument();
  });

  it("shows an empty state for a tab with no content", () => {
    renderWithProviders(
      <MediaTabs videos={[]} images={undefined} title="Fight Club" />,
    );

    expect(screen.getByText("No videos available")).toBeInTheDocument();
  });
});
