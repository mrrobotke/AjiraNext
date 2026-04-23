// @vitest-environment jsdom
import "@/test/setup-dom";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MobileMarketingTemplate } from "./MobileMarketingTemplate";

describe("MobileMarketingTemplate", () => {
  it("renders children", () => {
    render(
      <MobileMarketingTemplate>
        <div data-testid="child">Hello</div>
      </MobileMarketingTemplate>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("toggles drawer when menu button clicked", () => {
    render(
      <MobileMarketingTemplate>
        <div>Content</div>
      </MobileMarketingTemplate>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(/open menu/i));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("sets inert on main when drawer is open", () => {
    render(
      <MobileMarketingTemplate>
        <div data-testid="main-content">Content</div>
      </MobileMarketingTemplate>,
    );

    const main = screen.getByTestId("main-content").parentElement;
    expect(main).not.toHaveAttribute("inert");
    fireEvent.click(screen.getByLabelText(/open menu/i));
    expect(main).toHaveAttribute("inert");
  });
});
