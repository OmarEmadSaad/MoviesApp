import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("does not mount its body while closed", () => {
    renderWithProviders(
      <Modal open={false} onClose={() => {}} title="Trailer">
        <iframe title="player" src="https://example.com" />
      </Modal>,
    );

    expect(screen.queryByTitle("player")).toBeNull();
  });

  it("mounts its body and opens the dialog when opened", () => {
    renderWithProviders(
      <Modal open onClose={() => {}} title="Trailer">
        <iframe title="player" src="https://example.com" />
      </Modal>,
    );

    expect(screen.getByTitle("player")).toBeInTheDocument();
    expect(document.querySelector("dialog")?.open).toBe(true);
  });

  it("carries an accessible name", () => {
    renderWithProviders(
      <Modal open onClose={() => {}} title="Fight Club trailer">
        <p>body</p>
      </Modal>,
    );

    expect(document.querySelector("dialog")).toHaveAttribute(
      "aria-label",
      "Fight Club trailer",
    );
  });

  it("closes from the labelled close button", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <Modal open onClose={onClose} title="Trailer">
        <p>body</p>
      </Modal>,
    );

    await user.click(screen.getByRole("button", { name: "Close Trailer" }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("restores page scrolling when it unmounts", () => {
    const { unmount } = renderWithProviders(
      <Modal open onClose={() => {}} title="Trailer">
        <p>body</p>
      </Modal>,
    );

    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
