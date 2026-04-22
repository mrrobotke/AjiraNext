import { ROLES, type Role } from "./rbac";
import { createClient } from "./supabase/server";

/**
 * Type guard to check if a value is a valid Role.
 */
export function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" && Object.values(ROLES).includes(value as Role)
  );
}

/**
 * Fetches the current user's role from Supabase.
 * In development, can be overridden by MOCK_AUTH_ROLE env var.
 */
export async function getUserRole(): Promise<Role | null | undefined> {
  // Allow mock role in development for faster testing
  if (
    process.env.NODE_ENV === "development" &&
    process.env.MOCK_AUTH_ENABLED === "true"
  ) {
    const mockRole = process.env.MOCK_AUTH_ROLE as Role | undefined;
    if (mockRole && isRole(mockRole)) {
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

    // Role is expected to be stored in user_metadata or set by a custom claim/trigger
    const role = user.user_metadata?.role as Role | undefined;

    if (role && isRole(role)) {
      return role;
    }

    // If logged in but no specific role, default to AUTHENTICATED
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
  } catch {
    return null;
  }
}
