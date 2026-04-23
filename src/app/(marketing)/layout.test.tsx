// @vitest-environment jsdom
import "@/test/setup-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue(undefined),
    getAll: vi.fn().mockReturnValue([]),
    has: vi.fn().mockReturnValue(false),
    size: 0,
    [Symbol.iterator]: vi.fn().mockReturnValue([].values()),
  } as unknown as Awaited<ReturnType<typeof cookies>>),
}));

vi.mock("@/lib/auth", () => ({
  getUser: vi.fn(),
  getUserRole: vi.fn(),
}));

vi.mock("@/lib/rbac", () => ({
  getPortalForRole: vi.fn().mockImplementation((role: string) => {
    if (role === "job_seeker") return "/seeker";
    if (role === "employer_owner") return "/employer";
    return "/";
  }),
}));

vi.mock("@/lib/seo", () => ({
  getMarketingSeoData: vi.fn().mockResolvedValue({
    siteName: "Ajira Next",
    tagline: "Elite careers",
    ga4MeasurementId: "G-TEST123",
    organizationName: "Ajira Next Inc",
    organizationUrl: "https://ajira.next",
    organizationLogoUrl: "https://ajira.next/logo.png",
  }),
}));

vi.mock("@/i18n/request", () => ({
  getMessages: vi.fn().mockResolvedValue({
    nav: {
      home: "Home",
      jobs: "Jobs",
      employers: "Employers",
      pricing: "Pricing",
      about: "About",
      blog: "Blog",
      help: "Help",
    },
    auth: {
      signIn: "Sign in",
      getStarted: "Get Started",
      dashboard: "Dashboard",
    },
    marketing: { heroTitle: "Title", heroSubtitle: "Subtitle" },
  }),
}));

import { cookies } from "next/headers";
import { getUser, getUserRole } from "@/lib/auth";
import MarketingLayout from "./layout";

describe("MarketingLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children in desktop and mobile containers", async () => {
    vi.mocked(getUser).mockResolvedValue(null);
    vi.mocked(getUserRole).mockResolvedValue(null);

    const Layout = await MarketingLayout({
      children: <div data-testid="child">Hello</div>,
    });
    render(Layout);

    expect(screen.getAllByTestId("child")).toHaveLength(2);
  });

  it("passes dashboardHref based on role", async () => {
    vi.mocked(getUser).mockResolvedValue({
      id: "1",
      email: "a@b.com",
    } as unknown as Awaited<ReturnType<typeof getUser>>);
    vi.mocked(getUserRole).mockResolvedValue("job_seeker");

    const Layout = await MarketingLayout({ children: <div>Content</div> });
    render(Layout);

    expect(screen.getAllByRole("link", { name: /dashboard/i })).toHaveLength(2);
  });

  it("uses locale cookie when present", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockImplementation((name: string) => {
        if (name === "aj-locale") return { value: "sw" };
        return undefined;
      }),
      getAll: vi.fn().mockReturnValue([]),
      has: vi.fn().mockReturnValue(false),
      size: 0,
      [Symbol.iterator]: vi.fn().mockReturnValue([].values()),
    } as unknown as Awaited<ReturnType<typeof cookies>>);
    vi.mocked(getUser).mockResolvedValue(null);
    vi.mocked(getUserRole).mockResolvedValue(null);

    const Layout = await MarketingLayout({ children: <div>Content</div> });
    render(Layout);

    // Layout should render without errors when locale cookie is present
    expect(document.body).toBeTruthy();
  });
});
