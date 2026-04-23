import { describe, it, expect, beforeEach } from "vitest";
import robots from "./robots";

describe("robots", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://ajira.next";
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

  it("includes sitemap URL", () => {
    process.env.VERCEL_ENV = "production";
    const result = robots();
    expect(result.sitemap).toBe("https://ajira.next/sitemap.xml");
  });
});
