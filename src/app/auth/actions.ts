"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { config } from "@/lib/config";
import { mapAuthError } from "@/lib/auth-errors";
import {
  parseOnboardingRole,
  syncOnboardingRole,
  type OnboardingRole,
} from "@/lib/onboarding";
import { isRole, ROLES, getPortalForRole, type Role } from "@/lib/rbac";
import { createClient } from "@/lib/supabase/server";
import { validateRedirectUrl } from "@/lib/url";

/* ------------------------------------------------------------------ */
/*  In-memory rate-limit store (per-IP would require headers;         */
/*  per-email is sufficient for MVP).                                 */
/* ------------------------------------------------------------------ */

const resetRateLimit = new Map<string, { count: number; resetAt: number }>();
const RESET_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RESET_MAX_ATTEMPTS = 3;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = resetRateLimit.get(key);
  if (!entry || now > entry.resetAt) {
    resetRateLimit.set(key, { count: 1, resetAt: now + RESET_WINDOW_MS });
    return false;
  }
  if (entry.count >= RESET_MAX_ATTEMPTS) {
    return true;
  }
  entry.count += 1;
  return false;
}

/* ------------------------------------------------------------------ */
/*  Actions                                                            */
/* ------------------------------------------------------------------ */

export async function login(formData: FormData) {
  try {
    const supabase = await createClient();

    const email = formData.get("email");
    const password = formData.get("password");
    const rawReturnUrl = formData.get("returnUrl");
    const returnUrl = typeof rawReturnUrl === "string" ? rawReturnUrl : null;

    if (typeof email !== "string" || typeof password !== "string") {
      return { error: "Invalid input" };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: mapAuthError(error.message) };
    }

    if (!data.user?.user_metadata?.role) {
      redirect("/onboarding");
    }

    revalidatePath("/", "layout");

    const safeReturnUrl = validateRedirectUrl(returnUrl);
    const portalUrl = getPortalForRole(data.user.user_metadata?.role);

    redirect(safeReturnUrl || portalUrl);
  } catch (err) {
    if (typeof err === "object" && err !== null && "digest" in err) {
      throw err; // NEXT_REDIRECT
    }
    console.error("[login] unexpected error:", err);
    return { error: mapAuthError("") };
  }
}

export async function signup(formData: FormData) {
  try {
    const supabase = await createClient();

    const email = formData.get("email");
    const password = formData.get("password");
    const rawRole = formData.get("role");
    if (typeof email !== "string" || typeof password !== "string") {
      return { error: "Invalid input" };
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
      return { error: mapAuthError(error.message) };
    }

    revalidatePath("/", "layout");

    // Use the user returned directly by signUp instead of calling getUser again
    const user = data.user;
    if (user) {
      redirect(getPortalForRole(user.user_metadata?.role));
    }

    return { success: true };
  } catch (err) {
    if (typeof err === "object" && err !== null && "digest" in err) {
      throw err; // NEXT_REDIRECT
    }
    console.error("[signup] unexpected error:", err);
    return { error: mapAuthError("") };
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/");
  } catch (err) {
    if (typeof err === "object" && err !== null && "digest" in err) {
      throw err; // NEXT_REDIRECT
    }
    console.error("[signOut] unexpected error:", err);
    return { error: mapAuthError("") };
  }
}

export async function signInWithGoogle(options?: {
  onboardingRole?: OnboardingRole;
  returnUrl?: string;
}): Promise<{ error: string }> {
  try {
    const supabase = await createClient();
    const callbackUrl = new URL("/auth/callback", config.baseUrl);
    const safeReturnUrl = validateRedirectUrl(options?.returnUrl) ?? null;
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
      return { error: mapAuthError(error.message) };
    }

    if (data.url) {
      redirect(data.url);
    }

    return { error: "No redirect URL returned from provider" };
  } catch (err) {
    if (typeof err === "object" && err !== null && "digest" in err) {
      throw err; // NEXT_REDIRECT
    }
    console.error("[signInWithGoogle] unexpected error:", err);
    return { error: mapAuthError("") };
  }
}

export async function setOnboardingRole(
  role: OnboardingRole,
): Promise<{ error: string } | void> {
  try {
    if (!parseOnboardingRole(role)) return { error: "invalid_role" };
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return { error: "not_authenticated" };
    }

    let response: Response;
    try {
      response = await syncOnboardingRole(session.access_token, role);
    } catch {
      return { error: "sync_failed" };
    }

    if (!response.ok) {
      if (response.status === 409) {
        // Treat as success — role is already set. Refresh session and redirect.
        const { data: refreshData, error: refreshError } =
          await supabase.auth.refreshSession();
        if (refreshError || !refreshData.session) {
          return { error: "session_refresh_failed" };
        }
        const newRole = refreshData.session.user?.user_metadata?.role;
        revalidatePath("/", "layout");
        redirect(getPortalForRole(isRole(newRole) ? newRole : null));
      }
      if (response.status === 422) return { error: "invalid_role" };
      if (response.status === 503) return { error: "sync_failed" };
      return { error: "request_failed" };
    }

    const { data: refreshData, error: refreshError } =
      await supabase.auth.refreshSession();
    if (refreshError || !refreshData.session) {
      return { error: "session_refresh_failed" };
    }

    revalidatePath("/", "layout");

    const newRole = refreshData.session.user?.user_metadata?.role;
    redirect(getPortalForRole(isRole(newRole) ? newRole : null));
  } catch (err) {
    if (typeof err === "object" && err !== null && "digest" in err) {
      throw err; // NEXT_REDIRECT
    }
    console.error("[setOnboardingRole] unexpected error:", err);
    return { error: mapAuthError("") };
  }
}

export async function requestPasswordReset(formData: FormData) {
  try {
    const supabase = await createClient();
    const email = formData.get("email");

    if (typeof email !== "string") {
      return { error: "Invalid input" };
    }

    if (isRateLimited(email)) {
      return { error: mapAuthError("rate limit") };
    }

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${config.baseUrl}/auth?mode=reset`,
    });

    return { success: true };
  } catch (err) {
    console.error("[requestPasswordReset] unexpected error:", err);
    return { success: true }; // Always generic success to prevent enumeration
  }
}

export async function updatePassword(formData: FormData) {
  try {
    const supabase = await createClient();
    const password = formData.get("password");
    if (typeof password !== "string") {
      return { error: "Invalid input" };
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { error: mapAuthError(error.message) };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err) {
    console.error("[updatePassword] unexpected error:", err);
    return { error: mapAuthError("") };
  }
}
