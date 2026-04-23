import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { updateSession } from "./session";

// Mock createServerClient so we control auth behavior
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn((_, __, { cookies }) => ({
    auth: {
      getUser: vi.fn(),
    },
    // Simulate cookie write-through
    ...cookies,
  })),
}));

import { createServerClient } from "@supabase/ssr";
const mockCreateServerClient = vi.mocked(createServerClient);

function makeRequest(pathname: string, search = ""): NextRequest {
  return new NextRequest(new URL(`https://example.com${pathname}${search}`));
}

describe("updateSession", () => {
  it("returns supabaseResponse for public paths without user", async () => {
    mockCreateServerClient.mockImplementation(
      () =>
        ({
          auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
          },
        }) as unknown as ReturnType<typeof createServerClient>,
    );

    const req = makeRequest("/");
    const res = await updateSession(req);
    expect(res.status).toBe(200);
  });

  it("redirects unauthenticated users from protected routes to /auth", async () => {
    mockCreateServerClient.mockImplementation(
      () =>
        ({
          auth: {
            getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
          },
        }) as unknown as ReturnType<typeof createServerClient>,
    );

    const req = makeRequest("/seeker/dashboard");
    const res = await updateSession(req);
    expect(res.status).toBe(307);
    const loc = res.headers.get("location");
    expect(loc).toContain("/auth");
    expect(loc).toContain("mode=signin");
    expect(loc).toContain("returnUrl=%2Fseeker%2Fdashboard");
  });

  it("redirects authenticated users away from auth pages to their portal", async () => {
    mockCreateServerClient.mockImplementation(
      () =>
        ({
          auth: {
            getUser: vi.fn().mockResolvedValue({
              data: { user: { user_metadata: { role: "job_seeker" } } },
            }),
          },
        }) as unknown as ReturnType<typeof createServerClient>,
    );

    const req = makeRequest("/auth");
    const res = await updateSession(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://example.com/seeker");
  });

  it("allows authenticated users to reach /onboarding", async () => {
    mockCreateServerClient.mockImplementation(
      () =>
        ({
          auth: {
            getUser: vi.fn().mockResolvedValue({
              data: { user: { user_metadata: {} } },
            }),
          },
        }) as unknown as ReturnType<typeof createServerClient>,
    );

    const req = makeRequest("/onboarding");
    const res = await updateSession(req);
    expect(res.status).toBe(200);
  });

  it("redirects role-less authenticated users on /auth to /onboarding", async () => {
    mockCreateServerClient.mockImplementation(
      () =>
        ({
          auth: {
            getUser: vi.fn().mockResolvedValue({
              data: { user: { user_metadata: {} } },
            }),
          },
        }) as unknown as ReturnType<typeof createServerClient>,
    );

    const req = makeRequest("/auth");
    const res = await updateSession(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://example.com/onboarding");
  });

  it("does not redirect authenticated users when error=unauthorized is present", async () => {
    mockCreateServerClient.mockImplementation(
      () =>
        ({
          auth: {
            getUser: vi.fn().mockResolvedValue({
              data: { user: { user_metadata: { role: "job_seeker" } } },
            }),
          },
        }) as unknown as ReturnType<typeof createServerClient>,
    );

    const req = makeRequest("/auth", "?error=unauthorized");
    const res = await updateSession(req);
    expect(res.status).toBe(200);
  });

  it("fails CLOSED when getUser throws (C-2 fix): redirects to /auth?error=SESSION_ERROR", async () => {
    mockCreateServerClient.mockImplementation(
      () =>
        ({
          auth: {
            getUser: vi.fn().mockRejectedValue(new Error("network")),
          },
        }) as unknown as ReturnType<typeof createServerClient>,
    );

    const req = makeRequest("/seeker");
    const res = await updateSession(req);
    expect(res.status).toBe(307);
    const loc = res.headers.get("location");
    expect(loc).toContain("/auth");
    expect(loc).toContain("error=SESSION_ERROR");
  });

  it("fails closed even on public paths when getUser throws", async () => {
    mockCreateServerClient.mockImplementation(
      () =>
        ({
          auth: {
            getUser: vi.fn().mockRejectedValue(new Error("boom")),
          },
        }) as unknown as ReturnType<typeof createServerClient>,
    );

    const req = makeRequest("/");
    const res = await updateSession(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("error=SESSION_ERROR");
  });
});
