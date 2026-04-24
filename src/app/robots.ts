import type { MetadataRoute } from "next";

import { requireSiteUrl } from "@/lib/seo";

/**
 * AI crawlers are denied site-wide until there is an explicit product
 * decision to expose content for training. Listed here (rather than pulled
 * from a constant) for easy editorial review during content audits.
 */
const AI_BOTS = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "CCBot",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";
  const baseUrl = requireSiteUrl();

  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/seeker",
          "/employer",
          "/onboarding",
          "/auth",
        ],
      },
      ...AI_BOTS.map((bot) => ({
        userAgent: bot,
        disallow: "/" as const,
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
