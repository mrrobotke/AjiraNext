import { redirect } from "next/navigation";
import { getUserRole } from "./auth";
import { canAccessPortal, type PortalName, type Role } from "./rbac";

export type GuardablePortal = Extract<
  PortalName,
  "JOB_SEEKER_PORTAL" | "EMPLOYER_PORTAL" | "ADMIN_PORTAL"
>;

/**
 * Server-side guard shared by the three portal layouts.
 * - Redirects role-less users to `/onboarding` so they can pick a role.
 * - Redirects users whose role cannot access the portal to the auth page with
 *   an `ACCESS_DENIED` error code.
 * - Returns the resolved role so the calling layout can pass it to children
 *   if needed.
 */
export async function guardPortal(portalName: GuardablePortal): Promise<Role> {
  const role = await getUserRole();
  if (role === null) {
    redirect("/onboarding");
  }
  if (!canAccessPortal([role], portalName)) {
    redirect("/auth?error=ACCESS_DENIED");
  }
  return role;
}
