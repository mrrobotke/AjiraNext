import type { MetadataRoute } from "next";
import { apiPublicFetch } from "@/lib/api/public";
import type { PaginatedJobs } from "@/lib/api/types";

function requireBaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_BASE_URL;
  if (!value) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_BASE_URL",
    );
  }
  return value.replace(/\/$/, "");
}

const staticRoutes: MetadataRoute.Sitemap = [
  { url: "/", changeFrequency: "daily", priority: 1 },
  { url: "/jobs", changeFrequency: "daily", priority: 0.9 },
  { url: "/employers", changeFrequency: "weekly", priority: 0.8 },
  { url: "/about", changeFrequency: "monthly", priority: 0.7 },
  { url: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { url: "/pricing", changeFrequency: "monthly", priority: 0.6 },
  { url: "/blog", changeFrequency: "weekly", priority: 0.6 },
  { url: "/help", changeFrequency: "monthly", priority: 0.5 },
];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = requireBaseUrl();

  const mappedStatic = staticRoutes.map((route) => ({
    ...route,
    url: `${baseUrl}${route.url}`,
  }));

  try {
    const result = await apiPublicFetch<PaginatedJobs>("/jobs?page_size=1000", {
      next: { revalidate: 3600 },
    });

    const jobUrls: MetadataRoute.Sitemap = result.data.map((job) => ({
      url: `${baseUrl}/jobs/${job.slug ?? job.id}`,
      changeFrequency: "daily",
      priority: 0.8,
      lastModified: new Date(),
    }));

    return [...mappedStatic, ...jobUrls];
  } catch {
    return mappedStatic;
  }
}
