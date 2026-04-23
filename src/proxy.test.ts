import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

vi.mock("@/lib/supabase/session", () => ({
  updateSession: vi.fn(),
}));

import { updateSession } from "@/lib/supabase/session";
import { proxy, config as middlewareConfig } from "./proxy";

const mockedUpdateSession = vi.mocked(updateSession);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("proxy", () => {
  it("delegates to updateSession with the incoming request", async () => {
    const pass = NextResponse.next();
    mockedUpdateSession.mockResolvedValue(pass);
    const req = new NextRequest(new URL("https://example.com/seeker"));

    const result = await proxy(req);

    expect(mockedUpdateSession).toHaveBeenCalledTimes(1);
    expect(mockedUpdateSession).toHaveBeenCalledWith(req);
    expect(result).toBe(pass);
  });

  it("returns updateSession's redirect response unchanged", async () => {
    const redirect = NextResponse.redirect(new URL("https://example.com/auth"));
    mockedUpdateSession.mockResolvedValue(redirect);
    const req = new NextRequest(new URL("https://example.com/admin"));

    const result = await proxy(req);

    expect(result).toBe(redirect);
  });

  it("propagates errors thrown by updateSession (no silent fallback)", async () => {
    mockedUpdateSession.mockRejectedValue(new Error("boom"));
    const req = new NextRequest(new URL("https://example.com/employer"));

    await expect(proxy(req)).rejects.toThrow(/boom/);
  });
});

describe("middleware config", () => {
  it("exports a matcher array excluding api, _next, and static assets", () => {
    expect(Array.isArray(middlewareConfig.matcher)).toBe(true);
    expect(middlewareConfig.matcher).toHaveLength(1);
    const pattern = middlewareConfig.matcher[0];
    expect(pattern).toContain("api");
    expect(pattern).toContain("_next/static");
    expect(pattern).toContain("_next/image");
    expect(pattern).toContain("favicon.ico");
    // Image extension exclusions
    expect(pattern).toContain("svg");
    expect(pattern).toContain("png");
  });
});
