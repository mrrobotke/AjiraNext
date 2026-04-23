import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

/* ------------------------------------------------------------------ */
/*  Hoisted mocks                                                      */
/* ------------------------------------------------------------------ */

const {
  exchangeCodeForSessionMock,
  refreshSessionMock,
  syncOnboardingRoleMock,
} = vi.hoisted(() => ({
  exchangeCodeForSessionMock: vi.fn(),
  refreshSessionMock: vi.fn(),
  syncOnboardingRoleMock: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      exchangeCodeForSession: exchangeCodeForSessionMock,
      refreshSession: refreshSessionMock,
    },
  })),
}));

vi.mock("@/lib/onboarding", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/onboarding")>(
      "@/lib/onboarding",
    );
  return {
    ...actual,
    syncOnboardingRole: syncOnboardingRoleMock,
  };
});

/* ------------------------------------------------------------------ */
/*  Imports                                                            */
/* ------------------------------------------------------------------ */

import { GET } from "./route";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function makeRequest(url: string): NextRequest {
  return new NextRequest(new URL(url));
}

function mockExchangeWithRole(role: string | null) {
  const userMetadata = role ? { role } : {};
  exchangeCodeForSessionMock.mockResolvedValue({
    data: {
      session: { access_token: "tok" },
      user: { user_metadata: userMetadata },
    },
    error: null,
  });
  refreshSessionMock.mockResolvedValue({
    data: {
      session: {
        access_token: "tok",
        user: { user_metadata: userMetadata },
      },
    },
    error: null,
  });
}

beforeEach(() => {
  exchangeCodeForSessionMock.mockReset();
  refreshSessionMock.mockReset();
  syncOnboardingRoleMock.mockReset();
});

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */

describe("GET /auth/callback", () => {
  it("redirects to /auth?error=OAUTH_DENIED when the provider reports an error param", async () => {
    const req = makeRequest(
      "https://example.com/auth/callback?error=access_denied",
    );

    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe(
      "https://example.com/auth?error=OAUTH_DENIED",
    );
    expect(exchangeCodeForSessionMock).not.toHaveBeenCalled();
  });

  it("redirects to /auth?error=OAUTH_FAILED when no code is present", async () => {
    const req = makeRequest("https://example.com/auth/callback");

    const res = await GET(req);

    expect(res.headers.get("location")).toBe(
      "https://example.com/auth?error=OAUTH_FAILED",
    );
    expect(exchangeCodeForSessionMock).not.toHaveBeenCalled();
  });

  it("redirects to /auth?error=OAUTH_FAILED when exchangeCodeForSession returns an error", async () => {
    exchangeCodeForSessionMock.mockResolvedValue({
      data: {},
      error: { message: "bad code" },
    });
    const req = makeRequest("https://example.com/auth/callback?code=xyz");

    const res = await GET(req);

    expect(res.headers.get("location")).toBe(
      "https://example.com/auth?error=OAUTH_FAILED",
    );
  });

  it("redirects role-less sessions to /onboarding", async () => {
    mockExchangeWithRole(null);
    const req = makeRequest("https://example.com/auth/callback?code=xyz");

    const res = await GET(req);

    expect(res.headers.get("location")).toBe("https://example.com/onboarding");
  });

  it("preserves a safe `next` query param on the onboarding redirect when role is missing", async () => {
    mockExchangeWithRole(null);
    const req = makeRequest(
      "https://example.com/auth/callback?code=xyz&next=%2Fjobs%2F42",
    );

    const res = await GET(req);

    const loc = res.headers.get("location") ?? "";
    expect(loc).toContain("/onboarding");
    expect(loc).toContain("next=%2Fjobs%2F42");
  });

  it("redirects a job_seeker to /seeker on a successful exchange", async () => {
    mockExchangeWithRole("job_seeker");
    const req = makeRequest("https://example.com/auth/callback?code=xyz");

    const res = await GET(req);

    expect(res.headers.get("location")).toBe("https://example.com/seeker");
  });

  it("uses a safe `next` path in preference to the portal path when role is known", async () => {
    mockExchangeWithRole("job_seeker");
    const req = makeRequest(
      "https://example.com/auth/callback?code=xyz&next=%2Fjobs%2F42",
    );

    const res = await GET(req);

    expect(res.headers.get("location")).toBe("https://example.com/jobs/42");
  });

  it("rejects a cross-origin `next` param and falls back to the portal (C-3)", async () => {
    mockExchangeWithRole("job_seeker");
    const req = makeRequest(
      "https://example.com/auth/callback?code=xyz&next=https%3A%2F%2Fevil.com%2Fsteal",
    );

    const res = await GET(req);

    // resolveSafeRedirect coerces the cross-origin target to "/", so the
    // handler falls back to the portal path.
    expect(res.headers.get("location")).toBe("https://example.com/seeker");
  });

  it("syncs the onboarding role and redirects to the resolved portal when sync succeeds", async () => {
    // First refresh (after exchange) returns no role; sync succeeds; second
    // refresh returns the newly assigned role.
    exchangeCodeForSessionMock.mockResolvedValue({
      data: {
        session: { access_token: "tok" },
        user: { user_metadata: {} },
      },
      error: null,
    });
    refreshSessionMock
      .mockResolvedValueOnce({
        data: {
          session: {
            access_token: "tok",
            user: { user_metadata: {} },
          },
        },
        error: null,
      })
      .mockResolvedValueOnce({
        data: {
          session: {
            access_token: "tok",
            user: { user_metadata: { role: "job_seeker" } },
          },
        },
        error: null,
      });
    syncOnboardingRoleMock.mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    const req = makeRequest(
      "https://example.com/auth/callback?code=xyz&onboarding_role=job_seeker",
    );
    const res = await GET(req);

    expect(syncOnboardingRoleMock).toHaveBeenCalledWith("tok", "job_seeker");
    expect(res.headers.get("location")).toBe("https://example.com/seeker");
  });

  it("treats a 409 from the backend as a resolved role and still redirects to the portal (C-4 OAuth path)", async () => {
    exchangeCodeForSessionMock.mockResolvedValue({
      data: {
        session: { access_token: "tok" },
        user: { user_metadata: {} },
      },
      error: null,
    });
    refreshSessionMock
      .mockResolvedValueOnce({
        data: {
          session: { access_token: "tok", user: { user_metadata: {} } },
        },
        error: null,
      })
      .mockResolvedValueOnce({
        data: {
          session: {
            access_token: "tok",
            user: { user_metadata: { role: "employer_owner" } },
          },
        },
        error: null,
      });
    syncOnboardingRoleMock.mockResolvedValue(
      new Response(null, { status: 409 }),
    );

    const req = makeRequest(
      "https://example.com/auth/callback?code=xyz&onboarding_role=job_seeker",
    );
    const res = await GET(req);

    expect(res.headers.get("location")).toBe("https://example.com/employer");
  });

  it("falls back to /onboarding when the onboarding-role sync throws a network error", async () => {
    exchangeCodeForSessionMock.mockResolvedValue({
      data: {
        session: { access_token: "tok" },
        user: { user_metadata: {} },
      },
      error: null,
    });
    refreshSessionMock.mockResolvedValue({
      data: {
        session: { access_token: "tok", user: { user_metadata: {} } },
      },
      error: null,
    });
    syncOnboardingRoleMock.mockRejectedValue(new Error("network down"));

    const req = makeRequest(
      "https://example.com/auth/callback?code=xyz&onboarding_role=job_seeker",
    );
    const res = await GET(req);

    expect(res.headers.get("location")).toBe("https://example.com/onboarding");
  });

  it("ignores an unsafe onboarding_role value and treats the session as role-less", async () => {
    mockExchangeWithRole(null);

    const req = makeRequest(
      "https://example.com/auth/callback?code=xyz&onboarding_role=super_admin",
    );
    const res = await GET(req);

    expect(syncOnboardingRoleMock).not.toHaveBeenCalled();
    expect(res.headers.get("location")).toBe("https://example.com/onboarding");
  });
});
