import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";

describe("next.config redirects", () => {
  it("permanently redirects legacy /employers paths to /for-employers", async () => {
    expect(nextConfig.redirects).toBeDefined();
    const redirects = await nextConfig.redirects!();

    // The exact-match entry.
    expect(redirects).toContainEqual({
      source: "/employers",
      destination: "/for-employers",
      permanent: true,
    });

    // The sub-path entry so e.g. `/employers/post-a-job` also redirects
    // rather than 404ing.
    expect(redirects).toContainEqual({
      source: "/employers/:path*",
      destination: "/for-employers/:path*",
      permanent: true,
    });

    // Every /employers* redirect must be permanent (308) so search engines
    // move authority to the canonical URL.
    const employersRedirects = redirects.filter((r) =>
      r.source.startsWith("/employers"),
    );
    expect(employersRedirects.length).toBeGreaterThanOrEqual(2);
    for (const entry of employersRedirects) {
      expect(entry.permanent).toBe(true);
    }
  });
});
