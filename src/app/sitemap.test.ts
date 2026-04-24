import { describe, it, expect, vi, beforeEach } from "vitest";

import { apiPublicFetch } from "@/lib/api/public";

import sitemap from "./sitemap";

vi.mock("@/lib/api/public", () => ({
  apiPublicFetch: vi.fn(),
}));

describe("sitemap", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.NEXT_PUBLIC_SITE_URL = "https://ajira.next";
  });

  it("includes the canonical marketing routes from MARKETING_ROUTES", async () => {
    vi.mocked(apiPublicFetch).mockRejectedValue(new Error("fail"));
    const result = await sitemap();

    expect(result.some((r) => r.url === "https://ajira.next/")).toBe(true);
    expect(result.some((r) => r.url === "https://ajira.next/jobs")).toBe(true);
    expect(
      result.some((r) => r.url === "https://ajira.next/for-employers"),
    ).toBe(true);
    expect(result.some((r) => r.url === "https://ajira.next/about")).toBe(true);
    expect(result.some((r) => r.url === "https://ajira.next/legal")).toBe(true);
    // The legacy /employers path is redirected via next.config.ts, not listed
    // in the sitemap directly.
    expect(result.some((r) => r.url === "https://ajira.next/employers")).toBe(
      false,
    );
  });

  it("emits en-KE and sw-KE hreflang alternates on every static route", async () => {
    vi.mocked(apiPublicFetch).mockRejectedValue(new Error("fail"));
    const result = await sitemap();

    for (const entry of result) {
      expect(entry.alternates?.languages?.["en-KE"]).toBe(entry.url);
      expect(entry.alternates?.languages?.["sw-KE"]).toBe(entry.url);
    }
  });

  it("sets lastModified on every entry", async () => {
    vi.mocked(apiPublicFetch).mockRejectedValue(new Error("fail"));
    const result = await sitemap();
    for (const entry of result) {
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });

  it("includes dynamic job URLs on success with alternates", async () => {
    vi.mocked(apiPublicFetch).mockResolvedValue({
      data: [{ id: "1", slug: "senior-engineer" }, { id: "2" }],
      meta: { page: 1, pageSize: 1000, total: 2, totalPages: 1 },
    });
    const result = await sitemap();

    const slugged = result.find(
      (r) => r.url === "https://ajira.next/jobs/senior-engineer",
    );
    const idOnly = result.find((r) => r.url === "https://ajira.next/jobs/2");
    expect(slugged).toBeDefined();
    expect(idOnly).toBeDefined();
    expect(slugged?.alternates?.languages?.["en-KE"]).toBe(
      "https://ajira.next/jobs/senior-engineer",
    );
    expect(idOnly?.alternates?.languages?.["sw-KE"]).toBe(
      "https://ajira.next/jobs/2",
    );
  });

  it("encodes attacker-influenced slugs to prevent sitemap poisoning", async () => {
    vi.mocked(apiPublicFetch).mockResolvedValue({
      data: [
        { id: "3", slug: "../admin" },
        { id: "4", slug: "foo bar?utm=x" },
      ],
      meta: { page: 1, pageSize: 1000, total: 2, totalPages: 1 },
    });
    const result = await sitemap();

    // `../admin` must never appear raw — it must be percent-encoded.
    const encodedTraversal = result.find(
      (r) =>
        r.url === `https://ajira.next/jobs/${encodeURIComponent("../admin")}`,
    );
    expect(encodedTraversal).toBeDefined();
    expect(result.some((r) => r.url.includes("/jobs/../admin"))).toBe(false);

    // Spaces, `?`, and `=` must be percent-encoded so they don't escape
    // the path segment.
    const encodedSpace = result.find(
      (r) =>
        r.url ===
        `https://ajira.next/jobs/${encodeURIComponent("foo bar?utm=x")}`,
    );
    expect(encodedSpace).toBeDefined();
  });

  it("returns static only when API throws", async () => {
    vi.mocked(apiPublicFetch).mockRejectedValue(new Error("Network error"));
    const result = await sitemap();
    expect(result.every((r) => !r.url.includes("/jobs/"))).toBe(true);
  });

  it("throws when NEXT_PUBLIC_SITE_URL is missing in production", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "");
    try {
      await expect(sitemap()).rejects.toThrow(
        "Missing required environment variable: NEXT_PUBLIC_SITE_URL",
      );
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
