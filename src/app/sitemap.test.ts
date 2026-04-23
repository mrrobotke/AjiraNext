import { describe, it, expect, vi, beforeEach } from "vitest";
import sitemap from "./sitemap";
import { apiPublicFetch } from "@/lib/api/public";

vi.mock("@/lib/api/public", () => ({
  apiPublicFetch: vi.fn(),
}));

describe("sitemap", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.NEXT_PUBLIC_BASE_URL = "https://ajira.next";
  });

  it("includes static routes", async () => {
    vi.mocked(apiPublicFetch).mockRejectedValue(new Error("fail"));
    const result = await sitemap();
    expect(result.some((r) => r.url === "https://ajira.next/")).toBe(true);
    expect(result.some((r) => r.url === "https://ajira.next/jobs")).toBe(true);
    expect(result.some((r) => r.url === "https://ajira.next/about")).toBe(true);
  });

  it("includes dynamic job URLs on success", async () => {
    vi.mocked(apiPublicFetch).mockResolvedValue({
      data: [{ id: "1", slug: "senior-engineer" }, { id: "2" }],
      meta: { page: 1, pageSize: 1000, total: 2, totalPages: 1 },
    });
    const result = await sitemap();
    expect(
      result.some((r) => r.url === "https://ajira.next/jobs/senior-engineer"),
    ).toBe(true);
    expect(result.some((r) => r.url === "https://ajira.next/jobs/2")).toBe(
      true,
    );
  });

  it("returns static only when API throws", async () => {
    vi.mocked(apiPublicFetch).mockRejectedValue(new Error("Network error"));
    const result = await sitemap();
    expect(result.every((r) => !r.url.includes("/jobs/"))).toBe(true);
  });

  it("throws when NEXT_PUBLIC_BASE_URL is missing", async () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
    await expect(sitemap()).rejects.toThrow(
      "Missing required environment variable: NEXT_PUBLIC_BASE_URL",
    );
  });
});
