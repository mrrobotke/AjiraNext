// @vitest-environment jsdom
import "@/test/setup-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MobileNavDrawer } from "./MobileNavDrawer";

describe("MobileNavDrawer", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("does not render when closed", () => {
    render(<MobileNavDrawer open={false} onClose={vi.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders when open", () => {
    render(<MobileNavDrawer open onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Navigation menu")).toBeInTheDocument();
  });

  it("locks body overflow when open", () => {
    render(<MobileNavDrawer open onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body overflow on unmount", () => {
    const { unmount } = render(<MobileNavDrawer open onClose={vi.fn()} />);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("calls onClose when backdrop clicked", () => {
    const onClose = vi.fn();
    render(<MobileNavDrawer open onClose={onClose} />);
    const backdrop = screen.getByRole("dialog").firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    render(<MobileNavDrawer open onClose={onClose} />);
    fireEvent.click(screen.getByLabelText(/close menu/i));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<MobileNavDrawer open onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders sign-in and get-started CTAs when anonymous", () => {
    render(<MobileNavDrawer open onClose={vi.fn()} />);
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /get started/i }),
    ).toBeInTheDocument();
  });

  it("renders dashboard CTA when authenticated", () => {
    render(
      <MobileNavDrawer
        open
        onClose={vi.fn()}
        user={{ email: "a@b.com" }}
        dashboardHref="/seeker"
      />,
    );
    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
  });
});
