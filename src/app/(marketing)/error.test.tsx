// @vitest-environment jsdom
import "@/test/setup-dom";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MarketingError from "./error";

describe("MarketingError", () => {
  it("renders error message and reset button", () => {
    const mockError = new Error("Test error");
    const mockReset = vi.fn();

    render(<MarketingError error={mockError} reset={mockReset} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /try again/i }),
    ).toBeInTheDocument();
  });

  it("calls reset when button is clicked", () => {
    const mockError = new Error("Test error");
    const mockReset = vi.fn();

    render(<MarketingError error={mockError} reset={mockReset} />);

    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
