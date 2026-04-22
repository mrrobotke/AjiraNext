import { ROLES, type Role } from "./rbac";
import { createClient } from "./supabase/server";

/**
 * Runtime type guard for Role values.
 */
export function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" && Object.values(ROLES).includes(value as Role)
  );
}

/**
 * Fetches the current user's role from Supabase.
 *
 * ⚠️ SECURITY NOTE: This currently reads `role` from `user.user_metadata`,
 * which authenticated users can modify client-side via `auth.updateUser()`.
 * This is acceptable for an MVP but MUST be replaced with a server-side
 * source (e.g., `profiles` table or custom JWT claims) before production.
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

    return ROLES.AUTHENTICATED;
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
