// @vitest-environment jsdom
import "@/test/setup-dom";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MobileMarketingHeader } from "./MobileMarketingHeader";

describe("MobileMarketingHeader", () => {
  it("renders logo and menu button", () => {
    render(<MobileMarketingHeader />);
    expect(screen.getByLabelText(/open menu/i)).toBeInTheDocument();
  });

  it("shows sign-in CTA when anonymous", () => {
    render(<MobileMarketingHeader />);
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows dashboard CTA when authenticated", () => {
    render(
      <MobileMarketingHeader
        user={{ email: "a@b.com" }}
        dashboardHref="/seeker"
      />,
    );
    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
  });

  it("calls onMenuToggle when menu button clicked", () => {
    const onToggle = vi.fn();
    render(<MobileMarketingHeader onMenuToggle={onToggle} />);
    fireEvent.click(screen.getByLabelText(/open menu/i));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("reflects menuOpen state in aria-label", () => {
    render(<MobileMarketingHeader menuOpen />);
    expect(screen.getByLabelText(/close menu/i)).toBeInTheDocument();
  });
});
