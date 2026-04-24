import { renderToStaticMarkup } from "react-dom/server";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  MARKETING_ROUTES,
  OrganizationJsonLd,
  WebSiteJsonLd,
  buildMetadata,
  getMarketingSeoData,
  requireSiteUrl,
  safeJsonLd,
  type MarketingRoute,
  type MarketingSeoData,
} from "./seo";
import { apiPublicFetch } from "./api/public";

vi.mock("./api/public", () => ({
  apiPublicFetch: vi.fn(),
}));

const baseSeoData: MarketingSeoData = {
  siteName: "Ajira Next",
  tagline: "Elite careers",
  ga4MeasurementId: null,
  organizationName: "Ajira Next Inc",
  organizationUrl: "https://ajira.next",
  organizationLogoUrl: "https://ajira.next/logo.png",
};

describe("requireSiteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns NEXT_PUBLIC_SITE_URL with trailing slash stripped", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://ajira.next/");
    expect(requireSiteUrl()).toBe("https://ajira.next");
  });

  it("falls back to localhost in development when env is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VERCEL_ENV", "");
    expect(requireSiteUrl()).toBe("http://localhost:3000");
  });

  it("throws in production when env is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "");
    expect(() => requireSiteUrl()).toThrow(
      "Missing required environment variable: NEXT_PUBLIC_SITE_URL",
    );
  });

  it("throws on Vercel production when env is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(() => requireSiteUrl()).toThrow(
      "Missing required environment variable: NEXT_PUBLIC_SITE_URL",
    );
  });
});

describe("MARKETING_ROUTES", () => {
  it("has the canonical 9 routes with for-employers (not employers)", () => {
    const paths = MARKETING_ROUTES.map((r) => r.path);
    expect(paths).toEqual([
      "/",
      "/jobs",
      "/for-employers",
      "/pricing",
      "/about",
      "/contact",
      "/help",
      "/legal",
      "/blog",
    ]);
    expect(paths).not.toContain("/employers");
  });

  it("every route has a valid MarketingRoute shape", () => {
    const validChangeFrequencies: ReadonlyArray<
      MarketingRoute["changeFrequency"]
    > = ["daily", "weekly", "monthly"];
    for (const route of MARKETING_ROUTES) {
      expect(typeof route.path).toBe("string");
      expect(route.path.startsWith("/")).toBe(true);
      expect(validChangeFrequencies).toContain(route.changeFrequency);
      expect(route.priority).toBeGreaterThanOrEqual(0);
      expect(route.priority).toBeLessThanOrEqual(1);
    }
  });
});

describe("getMarketingSeoData", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns SEO data from API on success", async () => {
    vi.mocked(apiPublicFetch).mockResolvedValue(baseSeoData);

    const result = await getMarketingSeoData();
    expect(result).toEqual(baseSeoData);
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

describe("buildMetadata", () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://ajira.next";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  });

  it("matches the /about (en) snapshot including canonical, OG, Twitter and alternates", () => {
    const meta = buildMetadata({
      title: "About Us",
      description: "Learn about Ajira Next",
      path: "/about",
      locale: "en",
    });

    expect(meta.title).toBe("About Us");
    expect(meta.description).toBe("Learn about Ajira Next");
    expect(meta.alternates?.canonical).toBe("https://ajira.next/about");
    expect(meta.alternates?.languages).toEqual({
      "en-KE": "https://ajira.next/about",
      "sw-KE": "https://ajira.next/about",
      "x-default": "https://ajira.next/about",
    });
    expect(meta.openGraph).toMatchObject({
      type: "website",
      siteName: "Ajira Next",
      locale: "en_KE",
      url: "https://ajira.next/about",
      title: "About Us",
      description: "Learn about Ajira Next",
      images: [{ url: "/og/default.png", width: 1200, height: 630 }],
    });
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      title: "About Us",
      description: "Learn about Ajira Next",
    });
  });

  it("normalizes the root path so canonical is siteUrl + '/'", () => {
    const meta = buildMetadata({
      title: "Home",
      path: "/",
      locale: "en",
    });
    expect(meta.alternates?.canonical).toBe("https://ajira.next/");
  });

  it("strips trailing slashes from non-root paths", () => {
    const meta = buildMetadata({
      title: "Jobs",
      path: "/jobs/",
      locale: "en",
    });
    expect(meta.alternates?.canonical).toBe("https://ajira.next/jobs");
  });

  it("uses og:locale=sw_KE when locale='sw'", () => {
    const meta = buildMetadata({
      title: "Kuhusu",
      path: "/about",
      locale: "sw",
    });
    expect(meta.openGraph).toMatchObject({ locale: "sw_KE" });
  });

  it("falls back to default tagline when description omitted", () => {
    const meta = buildMetadata({
      title: "Home",
      path: "/",
      locale: "en",
    });
    expect(meta.description).toBe("The elite career platform for Africa");
  });

  it("merges caller-supplied openGraph/twitter overrides", () => {
    const meta = buildMetadata({
      title: "Jobs",
      path: "/jobs",
      locale: "en",
      openGraph: { title: "Custom OG Title" },
      twitter: { card: "summary" },
    });
    expect(meta.openGraph).toMatchObject({ title: "Custom OG Title" });
    expect(meta.twitter).toMatchObject({ card: "summary" });
  });
});

describe("safeJsonLd", () => {
  it("escapes < > and & characters into \\uXXXX form", () => {
    const out = safeJsonLd({ text: "<b>foo & bar</b>" });
    expect(out).not.toContain("<");
    expect(out).not.toContain(">");
    expect(out).not.toContain("&");
    expect(out).toContain("\\u003c");
    expect(out).toContain("\\u003e");
    expect(out).toContain("\\u0026");
  });

  it("escapes U+2028 (LINE SEPARATOR) and U+2029 (PARAGRAPH SEPARATOR)", () => {
    const ls = String.fromCodePoint(0x2028);
    const ps = String.fromCodePoint(0x2029);
    const out = safeJsonLd({ text: `a${ls}b${ps}c` });
    expect(out).not.toContain(ls);
    expect(out).not.toContain(ps);
    expect(out).toContain("\\u2028");
    expect(out).toContain("\\u2029");
  });
});

describe("OrganizationJsonLd", () => {
  it("renders a <script type='application/ld+json'> tag", () => {
    const html = renderToStaticMarkup(
      <OrganizationJsonLd data={baseSeoData} />,
    );
    expect(html.startsWith('<script type="application/ld+json">')).toBe(true);
    expect(html.endsWith("</script>")).toBe(true);
  });

  it("escapes a </script> substring in a SEO field", () => {
    const malicious: MarketingSeoData = {
      ...baseSeoData,
      organizationName: "Ajira</script><script>alert(1)</script>",
    };
    const html = renderToStaticMarkup(<OrganizationJsonLd data={malicious} />);
    // The closing tag must only appear once — as the outer script's own
    // closer — and the injected "</script>" must have been escaped.
    const closeCount = html.match(/<\/script>/g)?.length ?? 0;
    expect(closeCount).toBe(1);
    expect(html).toContain("\\u003c/script\\u003e");
    expect(html).not.toMatch(/<script>alert\(1\)<\/script>/);
  });
});

describe("WebSiteJsonLd", () => {
  it("renders a SearchAction payload", () => {
    const html = renderToStaticMarkup(<WebSiteJsonLd data={baseSeoData} />);
    expect(html.startsWith('<script type="application/ld+json">')).toBe(true);
    expect(html).toContain("SearchAction");
    expect(html).toContain("search_term_string");
  });
});
