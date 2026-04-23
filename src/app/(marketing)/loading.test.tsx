// @vitest-environment jsdom
import "@/test/setup-dom";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MarketingLoading from "./loading";

describe("MarketingLoading", () => {
  it("renders spinner", () => {
    render(<MarketingLoading />);
    expect(
      screen.getByRole("status", { name: /loading/i }),
    ).toBeInTheDocument();
  });
});
