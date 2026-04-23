import { describe, it, expect, vi, beforeEach } from "vitest";
import { AUTH_ERROR_CODES } from "@/lib/auth-errors";

/* ------------------------------------------------------------------ */
/*  Module mocks (hoisted by vitest)                                   */
/* ------------------------------------------------------------------ */

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    // Emulate Next.js behaviour: `redirect()` throws a digest-tagged error
    // that actions.ts rethrows rather than returning.
    const err = new Error(`NEXT_REDIRECT:${url}`) as Error & { digest: string };
    err.digest = `NEXT_REDIRECT;replace;${url};307;`;
    throw err;
  }),
}));

// Use vi.hoisted so these mock references live alongside the hoisted vi.mock
// factories below — otherwise the factories would try to read the variables
// before their declarations run.
const { supabaseAuth, syncOnboardingRoleMock } = vi.hoisted(() => ({
  supabaseAuth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    signInWithOAuth: vi.fn(),
    getSession: vi.fn(),
    refreshSession: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
  },
  syncOnboardingRoleMock: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ auth: supabaseAuth })),
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
/*  Imports — AFTER the mocks so they pick up mocked deps              */
/* ------------------------------------------------------------------ */

import { redirect } from "next/navigation";
import {
  login,
  signup,
  signOut,
  signInWithGoogle,
  setOnboardingRole,
  requestPasswordReset,
  updatePassword,
} from "./actions";

const mockedRedirect = vi.mocked(redirect);

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function makeFormData(values: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) fd.append(k, v);
  return fd;
}

async function captureRedirect(fn: () => Promise<unknown>): Promise<string> {
  try {
    await fn();
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "digest" in err &&
      typeof (err as { digest: string }).digest === "string"
    ) {
      return (err as { digest: string }).digest;
    }
    throw err;
  }
  throw new Error("Expected the action to call redirect() — none was captured");
}

beforeEach(() => {
  vi.clearAllMocks();
  for (const fn of Object.values(supabaseAuth)) fn.mockReset();
  syncOnboardingRoleMock.mockReset();
});

/* ------------------------------------------------------------------ */
/*  login                                                              */
/* ------------------------------------------------------------------ */

describe("login", () => {
  it("returns INVALID_INPUT when email or password is missing", async () => {
    const result = await login(new FormData());
    expect(result).toEqual({
      error: { code: AUTH_ERROR_CODES.INVALID_INPUT },
    });
    expect(supabaseAuth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("maps 'Invalid login credentials' to INVALID_CREDENTIALS", async () => {
    supabaseAuth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Invalid login credentials" },
    });
    const result = await login(
      makeFormData({ email: "x@y.com", password: "nope" }),
    );
    expect(result).toEqual({
      error: expect.objectContaining({
        code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
      }),
    });
  });

  it("maps 'Email not confirmed' to EMAIL_NOT_CONFIRMED", async () => {
    supabaseAuth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Email not confirmed" },
    });
    const result = await login(
      makeFormData({ email: "x@y.com", password: "p" }),
    );
    expect(result).toEqual({
      error: expect.objectContaining({
        code: AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED,
      }),
    });
  });

  it("maps a Supabase 'rate limit' message to RATE_LIMITED", async () => {
    supabaseAuth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Too many requests, rate limit exceeded" },
    });
    const result = await login(
      makeFormData({ email: "x@y.com", password: "p" }),
    );
    expect(result).toEqual({
      error: expect.objectContaining({ code: AUTH_ERROR_CODES.RATE_LIMITED }),
    });
  });

  it("redirects role-less users to /onboarding after a successful login (H-1)", async () => {
    supabaseAuth.signInWithPassword.mockResolvedValue({
      data: { user: { user_metadata: {} }, session: {} },
      error: null,
    });
    const digest = await captureRedirect(() =>
      login(makeFormData({ email: "x@y.com", password: "p" })),
    );
    expect(digest).toContain("/onboarding");
    expect(mockedRedirect).toHaveBeenCalledWith("/onboarding");
  });

  it("redirects a job_seeker to the seeker portal on success", async () => {
    supabaseAuth.signInWithPassword.mockResolvedValue({
      data: { user: { user_metadata: { role: "job_seeker" } }, session: {} },
      error: null,
    });
    const digest = await captureRedirect(() =>
      login(makeFormData({ email: "x@y.com", password: "p" })),
    );
    expect(digest).toContain("/seeker");
  });

  it("honours a safe returnUrl query param over the default portal", async () => {
    supabaseAuth.signInWithPassword.mockResolvedValue({
      data: { user: { user_metadata: { role: "job_seeker" } }, session: {} },
      error: null,
    });
    const digest = await captureRedirect(() =>
      login(
        makeFormData({
          email: "x@y.com",
          password: "p",
          returnUrl: "/jobs?q=remote",
        }),
      ),
    );
    expect(digest).toContain("/jobs");
    expect(digest).toContain("q=remote");
  });

  it("rejects a cross-origin returnUrl and falls back to the portal (C-3)", async () => {
    supabaseAuth.signInWithPassword.mockResolvedValue({
      data: { user: { user_metadata: { role: "job_seeker" } }, session: {} },
      error: null,
    });
    const digest = await captureRedirect(() =>
      login(
        makeFormData({
          email: "x@y.com",
          password: "p",
          returnUrl: "https://evil.com/steal",
        }),
      ),
    );
    expect(digest).not.toContain("evil.com");
    expect(digest).toContain("/seeker");
  });

  it("returns UNKNOWN when the Supabase client throws unexpectedly", async () => {
    supabaseAuth.signInWithPassword.mockRejectedValue(new Error("boom"));
    const result = await login(
      makeFormData({ email: "x@y.com", password: "p" }),
    );
    expect(result).toEqual({ error: { code: AUTH_ERROR_CODES.UNKNOWN } });
  });
});

/* ------------------------------------------------------------------ */
/*  signup                                                             */
/* ------------------------------------------------------------------ */

describe("signup", () => {
  it("returns INVALID_INPUT on missing fields", async () => {
    const result = await signup(new FormData());
    expect(result).toEqual({
      error: { code: AUTH_ERROR_CODES.INVALID_INPUT },
    });
  });

  it("maps 'User already registered' to EMAIL_ALREADY_REGISTERED", async () => {
    supabaseAuth.signUp.mockResolvedValue({
      data: { user: null },
      error: { message: "User already registered" },
    });
    const result = await signup(
      makeFormData({ email: "x@y.com", password: "p" }),
    );
    expect(result).toEqual({
      error: expect.objectContaining({
        code: AUTH_ERROR_CODES.EMAIL_ALREADY_REGISTERED,
      }),
    });
  });

  it("redirects to the portal when signUp returns a user with a role", async () => {
    supabaseAuth.signUp.mockResolvedValue({
      data: { user: { user_metadata: { role: "job_seeker" } } },
      error: null,
    });
    const digest = await captureRedirect(() =>
      signup(makeFormData({ email: "x@y.com", password: "p" })),
    );
    expect(digest).toContain("/seeker");
  });

  it("returns { success: true } when signUp returns no user (email confirmation flow)", async () => {
    supabaseAuth.signUp.mockResolvedValue({
      data: { user: null },
      error: null,
    });
    const result = await signup(
      makeFormData({ email: "x@y.com", password: "p" }),
    );
    expect(result).toEqual({ success: true });
  });

  it("defaults to JOB_SEEKER role when the role field is invalid", async () => {
    supabaseAuth.signUp.mockResolvedValue({
      data: { user: null },
      error: null,
    });
    await signup(
      makeFormData({ email: "x@y.com", password: "p", role: "super_admin" }),
    );
    expect(supabaseAuth.signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        options: { data: { role: "job_seeker" } },
      }),
    );
  });

  it("honours a valid EMPLOYER_OWNER role from the form", async () => {
    supabaseAuth.signUp.mockResolvedValue({
      data: { user: null },
      error: null,
    });
    await signup(
      makeFormData({
        email: "x@y.com",
        password: "p",
        role: "employer_owner",
      }),
    );
    expect(supabaseAuth.signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        options: { data: { role: "employer_owner" } },
      }),
    );
  });
});

/* ------------------------------------------------------------------ */
/*  signOut                                                            */
/* ------------------------------------------------------------------ */

describe("signOut", () => {
  it("signs the user out and redirects home", async () => {
    supabaseAuth.signOut.mockResolvedValue({ error: null });
    const digest = await captureRedirect(() => signOut());
    expect(supabaseAuth.signOut).toHaveBeenCalled();
    expect(digest).toContain(";/;");
  });

  it("returns UNKNOWN when signOut itself throws a non-redirect error", async () => {
    supabaseAuth.signOut.mockRejectedValue(new Error("boom"));
    const result = await signOut();
    expect(result).toEqual({ error: { code: AUTH_ERROR_CODES.UNKNOWN } });
  });
});

/* ------------------------------------------------------------------ */
/*  signInWithGoogle                                                   */
/* ------------------------------------------------------------------ */

describe("signInWithGoogle", () => {
  it("redirects to the OAuth URL returned by Supabase", async () => {
    supabaseAuth.signInWithOAuth.mockResolvedValue({
      data: { url: "https://accounts.google.com/o/oauth2/auth?state=xyz" },
      error: null,
    });
    const digest = await captureRedirect(() => signInWithGoogle());
    expect(digest).toContain("accounts.google.com");
  });

  it("returns OAUTH_FAILED on Supabase error", async () => {
    supabaseAuth.signInWithOAuth.mockResolvedValue({
      data: { url: null },
      error: { message: "oauth boom" },
    });
    const result = await signInWithGoogle();
    expect(result).toEqual({
      error: expect.objectContaining({ code: AUTH_ERROR_CODES.OAUTH_FAILED }),
    });
  });

  it("returns OAUTH_FAILED when no redirect URL is returned", async () => {
    supabaseAuth.signInWithOAuth.mockResolvedValue({
      data: { url: null },
      error: null,
    });
    const result = await signInWithGoogle();
    expect(result).toEqual({
      error: expect.objectContaining({ code: AUTH_ERROR_CODES.OAUTH_FAILED }),
    });
  });

  it("forwards onboarding_role and a safe next param through the callback URL", async () => {
    // Echo the redirectTo back as the OAuth URL so we can inspect what the
    // action built.
    supabaseAuth.signInWithOAuth.mockImplementation(
      async (args: { options?: { redirectTo?: string } }) => ({
        data: { url: args.options?.redirectTo ?? null },
        error: null,
      }),
    );
    const digest = await captureRedirect(() =>
      signInWithGoogle({ onboardingRole: "job_seeker", returnUrl: "/jobs" }),
    );
    expect(digest).toContain("onboarding_role=job_seeker");
    expect(digest).toContain("next=%2Fjobs");
  });

  it("drops an unsafe returnUrl before building the callback URL", async () => {
    supabaseAuth.signInWithOAuth.mockImplementation(
      async (args: { options?: { redirectTo?: string } }) => ({
        data: { url: args.options?.redirectTo ?? null },
        error: null,
      }),
    );
    const digest = await captureRedirect(() =>
      signInWithGoogle({ returnUrl: "https://evil.com/x" }),
    );
    expect(digest).not.toContain("evil.com");
    expect(digest).not.toContain("next=");
  });
});

/* ------------------------------------------------------------------ */
/*  setOnboardingRole                                                  */
/* ------------------------------------------------------------------ */

describe("setOnboardingRole", () => {
  it("returns INVALID_ROLE for unknown roles", async () => {
    const result = await setOnboardingRole(
      "not_a_real_role" as unknown as "job_seeker",
    );
    expect(result).toEqual({
      error: { code: AUTH_ERROR_CODES.INVALID_ROLE },
    });
  });

  it("returns NOT_AUTHENTICATED when there is no session", async () => {
    supabaseAuth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    const result = await setOnboardingRole("job_seeker");
    expect(result).toEqual({
      error: { code: AUTH_ERROR_CODES.NOT_AUTHENTICATED },
    });
  });

  it("returns SYNC_FAILED when the backend sync throws", async () => {
    supabaseAuth.getSession.mockResolvedValue({
      data: { session: { access_token: "tok" } },
      error: null,
    });
    syncOnboardingRoleMock.mockRejectedValue(new Error("network"));
    const result = await setOnboardingRole("job_seeker");
    expect(result).toEqual({ error: { code: AUTH_ERROR_CODES.SYNC_FAILED } });
  });

  it("returns ONBOARDING_CONFLICT + redirect on 409 (C-4)", async () => {
    supabaseAuth.getSession.mockResolvedValue({
      data: { session: { access_token: "tok" } },
      error: null,
    });
    syncOnboardingRoleMock.mockResolvedValue(
      new Response(null, { status: 409 }),
    );
    supabaseAuth.refreshSession.mockResolvedValue({
      data: {
        session: {
          user: { user_metadata: { role: "employer_owner" } },
        },
      },
      error: null,
    });
    const result = await setOnboardingRole("job_seeker");
    expect(result).toEqual({
      error: { code: AUTH_ERROR_CODES.ONBOARDING_CONFLICT },
      redirect: "/employer",
    });
  });

  it("maps 429 from the backend to RATE_LIMITED", async () => {
    supabaseAuth.getSession.mockResolvedValue({
      data: { session: { access_token: "tok" } },
      error: null,
    });
    syncOnboardingRoleMock.mockResolvedValue(
      new Response(null, { status: 429 }),
    );
    const result = await setOnboardingRole("job_seeker");
    expect(result).toEqual({ error: { code: AUTH_ERROR_CODES.RATE_LIMITED } });
  });

  it("maps 422 to INVALID_ROLE", async () => {
    supabaseAuth.getSession.mockResolvedValue({
      data: { session: { access_token: "tok" } },
      error: null,
    });
    syncOnboardingRoleMock.mockResolvedValue(
      new Response(null, { status: 422 }),
    );
    const result = await setOnboardingRole("job_seeker");
    expect(result).toEqual({ error: { code: AUTH_ERROR_CODES.INVALID_ROLE } });
  });

  it("maps 503 to SYNC_FAILED", async () => {
    supabaseAuth.getSession.mockResolvedValue({
      data: { session: { access_token: "tok" } },
      error: null,
    });
    syncOnboardingRoleMock.mockResolvedValue(
      new Response(null, { status: 503 }),
    );
    const result = await setOnboardingRole("job_seeker");
    expect(result).toEqual({ error: { code: AUTH_ERROR_CODES.SYNC_FAILED } });
  });

  it("returns REQUEST_FAILED for other non-2xx statuses", async () => {
    supabaseAuth.getSession.mockResolvedValue({
      data: { session: { access_token: "tok" } },
      error: null,
    });
    syncOnboardingRoleMock.mockResolvedValue(
      new Response(null, { status: 500 }),
    );
    const result = await setOnboardingRole("job_seeker");
    expect(result).toEqual({
      error: { code: AUTH_ERROR_CODES.REQUEST_FAILED },
    });
  });

  it("redirects to the portal after a successful role sync", async () => {
    supabaseAuth.getSession.mockResolvedValue({
      data: { session: { access_token: "tok" } },
      error: null,
    });
    syncOnboardingRoleMock.mockResolvedValue(
      new Response(null, { status: 200 }),
    );
    supabaseAuth.refreshSession.mockResolvedValue({
      data: {
        session: { user: { user_metadata: { role: "job_seeker" } } },
      },
      error: null,
    });
    const digest = await captureRedirect(() => setOnboardingRole("job_seeker"));
    expect(digest).toContain("/seeker");
  });

  it("returns SESSION_REFRESH_FAILED when the post-sync refresh fails", async () => {
    supabaseAuth.getSession.mockResolvedValue({
      data: { session: { access_token: "tok" } },
      error: null,
    });
    syncOnboardingRoleMock.mockResolvedValue(
      new Response(null, { status: 200 }),
    );
    supabaseAuth.refreshSession.mockResolvedValue({
      data: { session: null },
      error: { message: "expired" },
    });
    const result = await setOnboardingRole("job_seeker");
    expect(result).toEqual({
      error: { code: AUTH_ERROR_CODES.SESSION_REFRESH_FAILED },
    });
  });
});

/* ------------------------------------------------------------------ */
/*  requestPasswordReset                                               */
/* ------------------------------------------------------------------ */

describe("requestPasswordReset", () => {
  it("returns INVALID_INPUT when the email field is missing", async () => {
    const result = await requestPasswordReset(new FormData());
    expect(result).toEqual({
      error: { code: AUTH_ERROR_CODES.INVALID_INPUT },
    });
  });

  it("returns success on the happy path", async () => {
    supabaseAuth.resetPasswordForEmail.mockResolvedValue({
      data: {},
      error: null,
    });
    const result = await requestPasswordReset(
      makeFormData({ email: "x@y.com" }),
    );
    expect(result).toEqual({ success: true });
  });

  it("returns success even when the Supabase client throws (enumeration resistance)", async () => {
    supabaseAuth.resetPasswordForEmail.mockRejectedValue(
      new Error("network down"),
    );
    const result = await requestPasswordReset(
      makeFormData({ email: "x@y.com" }),
    );
    expect(result).toEqual({ success: true });
  });
});

/* ------------------------------------------------------------------ */
/*  updatePassword                                                     */
/* ------------------------------------------------------------------ */

describe("updatePassword", () => {
  it("returns INVALID_INPUT when password is missing", async () => {
    const result = await updatePassword(new FormData());
    expect(result).toEqual({
      error: { code: AUTH_ERROR_CODES.INVALID_INPUT },
    });
  });

  it("returns success when Supabase confirms the update", async () => {
    supabaseAuth.updateUser.mockResolvedValue({ data: {}, error: null });
    const result = await updatePassword(
      makeFormData({ password: "newsecret" }),
    );
    expect(result).toEqual({ success: true });
  });

  it("maps a Supabase error message into the discriminated error code", async () => {
    supabaseAuth.updateUser.mockResolvedValue({
      data: {},
      error: { message: "Invalid login credentials" },
    });
    const result = await updatePassword(
      makeFormData({ password: "newsecret" }),
    );
    expect(result).toEqual({
      error: expect.objectContaining({
        code: AUTH_ERROR_CODES.INVALID_CREDENTIALS,
      }),
    });
  });

  it("returns UNKNOWN when the Supabase client throws unexpectedly", async () => {
    supabaseAuth.updateUser.mockRejectedValue(new Error("boom"));
    const result = await updatePassword(
      makeFormData({ password: "newsecret" }),
    );
    expect(result).toEqual({ error: { code: AUTH_ERROR_CODES.UNKNOWN } });
  });
});
