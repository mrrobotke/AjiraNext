import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiPublicFetch } from "./public";
import { ApiError } from "./errors";

describe("apiPublicFetch", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_API_BASE_URL: "http://localhost:8085/v1",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("throws if NEXT_PUBLIC_API_BASE_URL is missing", async () => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    await expect(apiPublicFetch("/test")).rejects.toThrow(
      "Missing required environment variable: NEXT_PUBLIC_API_BASE_URL",
    );
  });

  it("builds URL correctly", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: "ok" }),
    });

    await apiPublicFetch("/jobs/featured");
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8085/v1/jobs/featured",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("injects next.revalidate on server", async () => {
    const originalWindow = global.window;
    // @ts-expect-error simulate server environment
    delete global.window;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: "ok" }),
    });

    await apiPublicFetch("/jobs/featured", { next: { revalidate: 300 } });
    const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(callArgs[1]).toHaveProperty("next.revalidate", 300);

    global.window = originalWindow;
  });

  it("uses default revalidate 60 on server when not specified", async () => {
    const originalWindow = global.window;
    // @ts-expect-error simulate server environment
    delete global.window;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: "ok" }),
    });

    await apiPublicFetch("/jobs/featured", { next: {} });
    const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(callArgs[1]).toHaveProperty("next.revalidate", 60);

    global.window = originalWindow;
  });

  it("does not inject next.revalidate on client", async () => {
    // @ts-expect-error simulate browser environment
    global.window = { location: { href: "http://localhost:3000" } };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: "ok" }),
    });

    await apiPublicFetch("/jobs/featured", { next: { revalidate: 300 } });
    const callArgs = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(callArgs[1]).not.toHaveProperty("next");

    // @ts-expect-error clean up
    delete global.window;
  });

  it("throws ApiError on non-2xx response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ error: "fail" }),
    });

    await expect(apiPublicFetch("/test")).rejects.toBeInstanceOf(ApiError);
    await expect(apiPublicFetch("/test")).rejects.toMatchObject({
      status: 500,
      body: { error: "fail" },
    });
  });

  it("returns parsed JSON on success", async () => {
    const payload = { data: { id: "1" } };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => payload,
    });

    const result = await apiPublicFetch("/test");
    expect(result).toEqual(payload);
  });
});

describe("ApiError", () => {
  it("has correct name and properties", () => {
    const err = new ApiError("boom", 404, { detail: "not found" });
    expect(err.name).toBe("ApiError");
    expect(err.message).toBe("boom");
    expect(err.status).toBe(404);
    expect(err.body).toEqual({ detail: "not found" });
  });
});
