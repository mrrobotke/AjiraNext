"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { config } from "@/lib/config";
import {
  parseOnboardingRole,
  syncOnboardingRole,
  type OnboardingRole,
} from "@/lib/onboarding";
import { ROLES, getPortalForRole, type Role } from "@/lib/rbac";
import { createClient } from "@/lib/supabase/server";
import { validateRedirectUrl } from "@/lib/url";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const returnUrl = formData.get("returnUrl") as string | null;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");

  // Determine redirect destination: 1. validated returnUrl, 2. role-based portal
  const safeReturnUrl = validateRedirectUrl(returnUrl);
  const portalUrl = getPortalForRole(data.user.user_metadata?.role);

  redirect(safeReturnUrl || portalUrl);
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const rawRole = formData.get("role") as string;
  const role =
    rawRole === ROLES.JOB_SEEKER || rawRole === ROLES.EMPLOYER_OWNER
      ? rawRole
      : ROLES.JOB_SEEKER;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");

  // If email confirmation is off, we might have a session already.
  // For this implementation, we assume confirmation is on, but we'll prepare for both.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect(getPortalForRole(user.user_metadata?.role));
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInWithGoogle(options?: {
  onboardingRole?: OnboardingRole;
  returnUrl?: string;
}): Promise<{ error: string }> {
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
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { error: "No redirect URL returned from provider" };
}

export async function setOnboardingRole(
  role: OnboardingRole,
): Promise<{ error: string } | void> {
  if (!parseOnboardingRole(role)) return { error: "invalid_role" };
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return { error: "not_authenticated" };
  }

  const response = await syncOnboardingRole(session.access_token, role);

  if (!response.ok) {
    if (response.status === 409) return { error: "role_already_set" };
    if (response.status === 422) return { error: "invalid_role" };
    if (response.status === 503) return { error: "sync_failed" };
    return { error: `request_failed_${response.status}` };
  }

  // Refresh the server-side session so the new role is baked into the cookies
  // before we redirect. Without this, middleware will not see the role.
  const { data: refreshData, error: refreshError } =
    await supabase.auth.refreshSession();
  if (refreshError || !refreshData.session) {
    return { error: "session_refresh_failed" };
  }

  revalidatePath("/", "layout");

  const newRole = refreshData.session.user?.user_metadata?.role as
    | Role
    | undefined;
  redirect(getPortalForRole(newRole ?? null));
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${config.baseUrl}/auth?mode=reset`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
