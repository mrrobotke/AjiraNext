import type { MetadataRoute } from "next";

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

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
  const baseUrl = getBaseUrl();

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
