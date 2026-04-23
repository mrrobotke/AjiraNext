import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getMarketingSeoData,
  buildMarketingMetadata,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "./seo";
import { apiPublicFetch } from "./api/public";

vi.mock("./api/public", () => ({
  apiPublicFetch: vi.fn(),
}));

describe("getMarketingSeoData", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns SEO data from API on success", async () => {
    const mockData = {
      siteName: "Ajira Next",
      tagline: "Elite careers",
      ga4MeasurementId: "G-123",
      organizationName: "Ajira Next Inc",
      organizationUrl: "https://ajira.next",
      organizationLogoUrl: "https://ajira.next/logo.png",
    };
    vi.mocked(apiPublicFetch).mockResolvedValue(mockData);

    const result = await getMarketingSeoData();
    expect(result).toEqual(mockData);
    expect(apiPublicFetch).toHaveBeenCalledWith("/public/seo-settings", {
      next: { revalidate: 3600 },
    });
  });

  it("returns defaults when API throws", async () => {
    vi.mocked(apiPublicFetch).mockRejectedValue(new Error("Network error"));

    const result = await getMarketingSeoData();
    expect(result.siteName).toBe("Ajira Next");
    expect(result.tagline).toBe("The elite career platform for Africa");
  });
});

describe("buildMarketingMetadata", () => {
  it("builds metadata with title and description", () => {
    const meta = buildMarketingMetadata({
      title: "Jobs",
      description: "Find your next role",
    });
    expect(meta).toEqual({
      title: "Jobs",
      description: "Find your next role",
    });
  });

  it("falls back to default tagline when description omitted", () => {
    const meta = buildMarketingMetadata({ title: "Home" });
    expect(meta.description).toBe("The elite career platform for Africa");
  });
});

describe("buildOrganizationJsonLd", () => {
  it("returns Organization schema", () => {
    const data = {
      siteName: "Ajira Next",
      tagline: "Elite careers",
      ga4MeasurementId: null,
      organizationName: "Ajira Next Inc",
      organizationUrl: "https://ajira.next",
      organizationLogoUrl: "https://ajira.next/logo.png",
    };
    const jsonLd = buildOrganizationJsonLd(data);
    expect(jsonLd["@type"]).toBe("Organization");
    expect(jsonLd.name).toBe("Ajira Next Inc");
    expect(jsonLd.url).toBe("https://ajira.next");
    expect(jsonLd.logo).toBe("https://ajira.next/logo.png");
  });
});

describe("buildWebSiteJsonLd", () => {
  it("returns WebSite schema with search action", () => {
    const data = {
      siteName: "Ajira Next",
      tagline: "Elite careers",
      ga4MeasurementId: null,
      organizationName: "Ajira Next Inc",
      organizationUrl: "https://ajira.next",
      organizationLogoUrl: "https://ajira.next/logo.png",
    };
    const jsonLd = buildWebSiteJsonLd(data);
    expect(jsonLd["@type"]).toBe("WebSite");
    expect(jsonLd.name).toBe("Ajira Next");
    expect(jsonLd.potentialAction["@type"]).toBe("SearchAction");
  });
});
