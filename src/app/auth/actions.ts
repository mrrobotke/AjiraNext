"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { config } from "@/lib/config";
import {
  AUTH_ERROR_CODES,
  type AuthActionError,
  type AuthErrorCode,
} from "@/lib/auth-errors";
import {
  parseOnboardingRole,
  syncOnboardingRole,
  type OnboardingRole,
} from "@/lib/onboarding";
import { isRole, ROLES, getPortalForRole } from "@/lib/rbac";
import { createClient } from "@/lib/supabase/server";
import { resolveSafeRedirect } from "@/lib/url";

/* ------------------------------------------------------------------ */
/*  Result types                                                       */
/* ------------------------------------------------------------------ */

export type AuthActionResult = { success: true } | { error: AuthActionError };

export type OnboardingActionResult =
  | { success: true }
  | { error: AuthActionError; redirect?: string };

/* ------------------------------------------------------------------ */
/*  Error mapping (server-only)                                        */
/* ------------------------------------------------------------------ */

/**
 * Inspects a raw Supabase auth error and returns a discriminated code.
 * Keep this helper internal: callers outside this module use
 * `authErrorMessage(code)` for rendering.
 */
function toAuthErrorCode(rawMessage: string | undefined | null): AuthErrorCode {
  if (!rawMessage) return AUTH_ERROR_CODES.UNKNOWN;
  const lowered = rawMessage.toLowerCase();
  if (lowered.includes("invalid login credentials"))
    return AUTH_ERROR_CODES.INVALID_CREDENTIALS;
  if (lowered.includes("email not confirmed"))
    return AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED;
  if (lowered.includes("user already registered"))
    return AUTH_ERROR_CODES.EMAIL_ALREADY_REGISTERED;
  if (lowered.includes("rate limit")) return AUTH_ERROR_CODES.RATE_LIMITED;
  if (lowered.includes("network")) return AUTH_ERROR_CODES.NETWORK;
  return AUTH_ERROR_CODES.UNKNOWN;
}

function authError(
  code: AuthErrorCode,
  hint?: string,
): { error: AuthActionError } {
  // M-sec-1: Never leak the raw provider hint to the client in production.
  // The hint is useful for dev log context, but sending Supabase's upstream
  // message to end users exposes infrastructure details and can leak
  // account-existence signals. In production we return the discriminated
  // code only; the client renders authErrorMessage(code).
  if (hint && process.env.NODE_ENV !== "production") {
    return { error: { code, hint } };
  }
  return { error: { code } };
}

function isNextRedirectError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

/* ------------------------------------------------------------------ */
/*  Rate limiting                                                      */
/* ------------------------------------------------------------------ */
// Rate limiting is enforced by the backend; the frontend relies on Supabase /
// backend returning a 429-shaped error which we surface as RATE_LIMITED.
// Tracked in iJobs-backend follow-up ticket (§8 of the hardening plan).

/* ------------------------------------------------------------------ */
/*  Actions                                                            */
/* ------------------------------------------------------------------ */

export async function login(formData: FormData): Promise<AuthActionResult> {
  try {
    const supabase = await createClient();

    const email = formData.get("email");
    const password = formData.get("password");
    const rawReturnUrl = formData.get("returnUrl");
    const returnUrl = typeof rawReturnUrl === "string" ? rawReturnUrl : null;

    if (typeof email !== "string" || typeof password !== "string") {
      return authError(AUTH_ERROR_CODES.INVALID_INPUT);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return authError(toAuthErrorCode(error.message), error.message);
    }

    // Narrow the untrusted JWT claim via isRole() — never trust raw
    // user_metadata.role for routing decisions (H-type regression fix).
    const rawLoginRole = data.user?.user_metadata?.role;
    const loginRole = isRole(rawLoginRole) ? rawLoginRole : null;

    if (!loginRole) {
      redirect("/onboarding");
    }

    revalidatePath("/", "layout");

    const portalUrl = getPortalForRole(loginRole);
    redirect(resolveSafeRedirect(returnUrl, portalUrl));
  } catch (err) {
    if (isNextRedirectError(err)) throw err;
    console.error(
      "[login] unexpected error:",
      err instanceof Error ? err.message : String(err),
    );
    return authError(AUTH_ERROR_CODES.UNKNOWN);
  }
}

export async function signup(formData: FormData): Promise<AuthActionResult> {
  try {
    const supabase = await createClient();

    const email = formData.get("email");
    const password = formData.get("password");
    const rawRole = formData.get("role");
    if (typeof email !== "string" || typeof password !== "string") {
      return authError(AUTH_ERROR_CODES.INVALID_INPUT);
    }
    const role =
      rawRole === ROLES.JOB_SEEKER || rawRole === ROLES.EMPLOYER_OWNER
        ? rawRole
        : ROLES.JOB_SEEKER;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });

    if (error) {
      return authError(toAuthErrorCode(error.message), error.message);
    }

    revalidatePath("/", "layout");

    // Use the user returned directly by signUp instead of calling getUser again
    const user = data.user;
    if (user) {
      // Narrow via isRole() — same H-type regression fix as in login().
      const rawSignupRole = user.user_metadata?.role;
      redirect(getPortalForRole(isRole(rawSignupRole) ? rawSignupRole : null));
    }

    return { success: true };
  } catch (err) {
    if (isNextRedirectError(err)) throw err;
    console.error(
      "[signup] unexpected error:",
      err instanceof Error ? err.message : String(err),
    );
    return authError(AUTH_ERROR_CODES.UNKNOWN);
  }
}

export async function signOut(): Promise<AuthActionResult | void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/");
  } catch (err) {
    if (isNextRedirectError(err)) throw err;
    console.error(
      "[signOut] unexpected error:",
      err instanceof Error ? err.message : String(err),
    );
    return authError(AUTH_ERROR_CODES.UNKNOWN);
  }
}

export async function signInWithGoogle(options?: {
  onboardingRole?: OnboardingRole;
  returnUrl?: string;
}): Promise<AuthActionResult> {
  try {
    const supabase = await createClient();
    const callbackUrl = new URL("/auth/callback", config.baseUrl);
    const safeReturnUrl = resolveSafeRedirect(options?.returnUrl, "");
    const onboardingRole = parseOnboardingRole(options?.onboardingRole);
    if (safeReturnUrl) {
      callbackUrl.searchParams.set("next", safeReturnUrl);
    }
    if (onboardingRole) {
      callbackUrl.searchParams.set("onboarding_role", onboardingRole);
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      return authError(AUTH_ERROR_CODES.OAUTH_FAILED, error.message);
    }

    if (data.url) {
      redirect(data.url);
    }

    return authError(
      AUTH_ERROR_CODES.OAUTH_FAILED,
      "No redirect URL returned from provider",
    );
  } catch (err) {
    if (isNextRedirectError(err)) throw err;
    console.error(
      "[signInWithGoogle] unexpected error:",
      err instanceof Error ? err.message : String(err),
    );
    return authError(AUTH_ERROR_CODES.OAUTH_FAILED);
  }
}

export async function setOnboardingRole(
  role: OnboardingRole,
): Promise<OnboardingActionResult> {
  try {
    if (!parseOnboardingRole(role)) {
      return authError(AUTH_ERROR_CODES.INVALID_ROLE);
    }
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return authError(AUTH_ERROR_CODES.NOT_AUTHENTICATED);
    }

    let response: Response;
    try {
      response = await syncOnboardingRole(session.access_token, role);
    } catch (err) {
      // H-sf-1: surface the cause to server logs before the discriminated
      // SYNC_FAILED bubbles back to the client (which renders an opaque
      // retry UI). Stringify to avoid dumping full error objects into log
      // aggregation (M-sec-3).
      console.error(
        "[setOnboardingRole] sync failed:",
        err instanceof Error ? err.message : String(err),
      );
      return authError(AUTH_ERROR_CODES.SYNC_FAILED);
    }

    if (!response.ok) {
      if (response.status === 409) {
        // Backend says the role is already set. Refresh the session so the
        // client sees the authoritative role, then return a discriminated
        // error so the client can show an info toast and replace the route
        // instead of us doing a server redirect (C-4 fix).
        const { data: refreshData, error: refreshError } =
          await supabase.auth.refreshSession();
        if (refreshError || !refreshData.session) {
          return authError(AUTH_ERROR_CODES.SESSION_REFRESH_FAILED);
        }
        const existingRole = refreshData.session.user?.user_metadata?.role;
        revalidatePath("/", "layout");
        return {
          error: { code: AUTH_ERROR_CODES.ONBOARDING_CONFLICT },
          redirect: getPortalForRole(
            isRole(existingRole) ? existingRole : null,
          ),
        };
      }
      if (response.status === 422) {
        return authError(AUTH_ERROR_CODES.INVALID_ROLE);
      }
      if (response.status === 503) {
        return authError(AUTH_ERROR_CODES.SYNC_FAILED);
      }
      if (response.status === 429) {
        return authError(AUTH_ERROR_CODES.RATE_LIMITED);
      }
      return authError(AUTH_ERROR_CODES.REQUEST_FAILED);
    }

    const { data: refreshData, error: refreshError } =
      await supabase.auth.refreshSession();
    if (refreshError || !refreshData.session) {
      return authError(AUTH_ERROR_CODES.SESSION_REFRESH_FAILED);
    }

    revalidatePath("/", "layout");

    const newRole = refreshData.session.user?.user_metadata?.role;
    redirect(getPortalForRole(isRole(newRole) ? newRole : null));
  } catch (err) {
    if (isNextRedirectError(err)) throw err;
    console.error(
      "[setOnboardingRole] unexpected error:",
      err instanceof Error ? err.message : String(err),
    );
    return authError(AUTH_ERROR_CODES.UNKNOWN);
  }
}

export async function requestPasswordReset(
  formData: FormData,
): Promise<AuthActionResult> {
  try {
    const supabase = await createClient();
    const email = formData.get("email");

    if (typeof email !== "string") {
      return authError(AUTH_ERROR_CODES.INVALID_INPUT);
    }

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${config.baseUrl}/auth?mode=reset`,
    });

    // Always return success to prevent email enumeration.
    return { success: true };
  } catch (err) {
    console.error(
      "[requestPasswordReset] unexpected error:",
      err instanceof Error ? err.message : String(err),
    );
    // Still always-success: enumeration resistance outweighs error surfacing.
    return { success: true };
  }
}

export async function updatePassword(
  formData: FormData,
): Promise<AuthActionResult> {
  try {
    const supabase = await createClient();
    const password = formData.get("password");
    if (typeof password !== "string") {
      return authError(AUTH_ERROR_CODES.INVALID_INPUT);
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return authError(toAuthErrorCode(error.message), error.message);
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err) {
    console.error(
      "[updatePassword] unexpected error:",
      err instanceof Error ? err.message : String(err),
    );
    return authError(AUTH_ERROR_CODES.UNKNOWN);
  }
}
