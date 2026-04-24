import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * `config` is a module-level const that reads `process.env` at import time,
 * so each case here uses `vi.resetModules()` + a dynamic `import()` to
 * observe a fresh read with the stubbed env. `vi.unstubAllEnvs()` in
 * `afterEach` then restores the global env for the next case.
 */
async function loadConfig(): Promise<(typeof import("./config"))["config"]> {
  vi.resetModules();
  const mod = await import("./config");
  return mod.config;
}

describe("config.baseUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reads NEXT_PUBLIC_SITE_URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://ajira.next");
    const config = await loadConfig();
    expect(config.baseUrl).toBe("https://ajira.next");
  });

  it("strips a trailing slash from NEXT_PUBLIC_SITE_URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://ajira.next/");
    const config = await loadConfig();
    expect(config.baseUrl).toBe("https://ajira.next");
  });

  it("falls back to http://localhost:3000 when NEXT_PUBLIC_SITE_URL is unset", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    const config = await loadConfig();
    expect(config.baseUrl).toBe("http://localhost:3000");
  });
});
