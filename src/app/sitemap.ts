import type { MetadataRoute } from "next";

import { apiPublicFetch } from "@/lib/api/public";
import type { PaginatedJobs } from "@/lib/api/types";
import { MARKETING_ROUTES, requireSiteUrl } from "@/lib/seo";

export const revalidate = 3600;

/**
 * Builds the sitemap for the marketing surface.
 *
 * Static routes come from `MARKETING_ROUTES` (the single source of truth in
 * `@/lib/seo`). Each entry emits `alternates.languages` with `en-KE` and
 * `sw-KE` alternates pointing at the same URL in v1 because next-intl is
 * cookie-based. When URL-based locale routing lands (Epic 2+), switch these
 * to per-locale paths.
 *
 * Dynamic `/jobs/[slug]` URLs are enumerated from the public jobs API as a
 * bonus over the #29 spec. Blog slugs are not yet enumerated — see the
 * Epic 5 TODO below.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = requireSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = MARKETING_ROUTES.map((route) => {
    const url = `${siteUrl}${route.path}`;
    return {
      url,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          "en-KE": url,
          "sw-KE": url,
        },
      },
    };
  });

  // TODO(epic-2): emit per-locale hreflang alternates for dynamic job slugs
  // once URL-based locale routing lands. Until then, both locales point at
  // the same URL.
  let jobEntries: MetadataRoute.Sitemap = [];
  try {
    const result = await apiPublicFetch<PaginatedJobs>("/jobs?page_size=1000", {
      next: { revalidate: 3600 },
    });

    jobEntries = result.data.map((job) => {
      // Slugs come from an external data source and are attacker-influenced;
      // `encodeURIComponent` prevents sitemap poisoning via path-segment
      // traversal (e.g. `../admin`) or URL-reserved characters.
      const url = `${siteUrl}/jobs/${encodeURIComponent(job.slug ?? job.id)}`;
      return {
        url,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
        alternates: {
          languages: {
            "en-KE": url,
            "sw-KE": url,
          },
        },
      };
    });
  } catch {
    // Fail open: if the jobs API is unreachable, still emit the static
    // routes rather than returning an empty sitemap or 500.
    jobEntries = [];
  }

  // TODO(epic-5): enumerate blog slugs into the sitemap once the blog CMS
  // adapter is ready.

  return [...staticEntries, ...jobEntries];
}
