import { describe, it, expect, beforeEach, afterEach } from "vitest";

import robots from "./robots";

describe("robots", () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const originalVercelEnv = process.env.VERCEL_ENV;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://ajira.next";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
    process.env.VERCEL_ENV = originalVercelEnv;
  });

  it("disallows everything in non-production", () => {
    process.env.VERCEL_ENV = "preview";
    const result = robots();
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rule.disallow).toBe("/");
  });

  it("allows marketing and blocks internal routes in production", () => {
    process.env.VERCEL_ENV = "production";
    const result = robots();
    expect(Array.isArray(result.rules)).toBe(true);

    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const mainRule = rules.find((r) => r.userAgent === "*");
    expect(mainRule?.allow).toBe("/");
    expect(mainRule?.disallow).toContain("/admin");
    expect(mainRule?.disallow).toContain("/api");
    expect(mainRule?.disallow).toContain("/seeker");
    expect(mainRule?.disallow).toContain("/employer");
    expect(mainRule?.disallow).toContain("/onboarding");
    expect(mainRule?.disallow).toContain("/auth");
  });

  it("blocks AI bots in production", () => {
    process.env.VERCEL_ENV = "production";
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];

    const aiBots = [
      "GPTBot",
      "ClaudeBot",
      "anthropic-ai",
      "PerplexityBot",
      "CCBot",
      "Google-Extended",
    ];
    for (const bot of aiBots) {
      const botRule = rules.find((r) => r.userAgent === bot);
      expect(botRule).toBeDefined();
      expect(botRule?.disallow).toBe("/");
    }
  });

  it("includes sitemap URL derived from NEXT_PUBLIC_SITE_URL", () => {
    process.env.VERCEL_ENV = "production";
    const result = robots();
    expect(result.sitemap).toBe("https://ajira.next/sitemap.xml");
  });

  it("strips trailing slash from NEXT_PUBLIC_SITE_URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://ajira.next/";
    process.env.VERCEL_ENV = "production";
    const result = robots();
    expect(result.sitemap).toBe("https://ajira.next/sitemap.xml");
  });
});
