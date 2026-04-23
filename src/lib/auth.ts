import { isRole, type Role } from "./rbac";
import { createClient } from "./supabase/server";

/**
 * Fetches the current user's role from Supabase.
 *
 * Returns `null` when there is no user, when an unexpected error occurs, or
 * when the authenticated user has no recognized role in `user_metadata`
 * (i.e., hasn't completed onboarding). Callers in route-group layouts MUST
 * treat `null` as "force user through /onboarding" — see `guardPortal`.
 *
 * ⚠️ SECURITY NOTE: This reads `role` from `user.user_metadata`, which
 * authenticated users can modify client-side via `auth.updateUser()`. This is
 * acceptable for the MVP but the backend is the ultimate authority on role
 * enforcement (see iJobs-backend follow-up ticket).
 *
 * In development, can be overridden by MOCK_AUTH_ROLE when
 * MOCK_AUTH_ENABLED is explicitly set to "true".
 */
export async function getUserRole(): Promise<Role | null> {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.MOCK_AUTH_ENABLED === "true"
  ) {
    const mockRole = process.env.MOCK_AUTH_ROLE;
    if (isRole(mockRole)) {
      return mockRole;
    }
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const role = user.user_metadata?.role;

    if (isRole(role)) {
      return role;
    }

    // Role-less (freshly signed-up) users must complete onboarding. Returning
    // `null` here lets portal layouts redirect them via `guardPortal`.
    return null;
  } catch (err) {
    console.error("Error fetching user role:", err);
    return null;
  }
}

/**
 * Helper to get the full user object if needed.
 */
export async function getUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
}
