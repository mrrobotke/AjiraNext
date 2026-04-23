export const ROLES = {
  ADMIN_SUPER: "admin_super",
  ADMIN_MODERATOR: "admin_moderator",
  SUPPORT_LEAD: "support_lead",
  SUPPORT_AGENT: "support_agent",
  MARKETING_MANAGER: "marketing_manager",
  BLOG_AUTHOR: "blog_author",
  BLOG_EDITOR: "blog_editor",
  EMPLOYER_OWNER: "employer_owner",
  EMPLOYER_ADMIN: "employer_admin",
  EMPLOYER_RECRUITER: "employer_recruiter",
  EMPLOYER_HIRING_MANAGER: "employer_hiring_manager",
  EMPLOYER_BILLING: "employer_billing",
  JOB_SEEKER: "job_seeker",
  PUBLIC: "public",
  AUTHENTICATED: "authenticated",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PORTAL_PATHS = {
  JOB_SEEKER: "/seeker",
  EMPLOYER: "/employer",
  ADMIN: "/admin",
  HOME: "/",
} as const;

export function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" && Object.values(ROLES).includes(value as Role)
  );
}

export const PORTAL_ACCESS = {
  // `AUTHENTICATED` is intentionally NOT in any portal allow-list. Users whose
  // `user_metadata.role` is missing are routed through `/onboarding` instead
  // (see `guardPortal` and `canAccessOnboarding`).
  JOB_SEEKER_PORTAL: [ROLES.JOB_SEEKER, ROLES.ADMIN_SUPER],
  EMPLOYER_PORTAL: [
    ROLES.EMPLOYER_OWNER,
    ROLES.EMPLOYER_ADMIN,
    ROLES.EMPLOYER_RECRUITER,
    ROLES.EMPLOYER_HIRING_MANAGER,
    ROLES.EMPLOYER_BILLING,
    ROLES.ADMIN_SUPER,
  ],
  ADMIN_PORTAL: [
    ROLES.ADMIN_MODERATOR,
    ROLES.ADMIN_SUPER,
    ROLES.BLOG_AUTHOR,
    ROLES.BLOG_EDITOR,
    ROLES.SUPPORT_AGENT,
    ROLES.SUPPORT_LEAD,
    ROLES.MARKETING_MANAGER,
  ],
  SUPPORT_PORTAL: [ROLES.SUPPORT_AGENT, ROLES.SUPPORT_LEAD, ROLES.ADMIN_SUPER],
  MARKETING_PORTAL: [ROLES.MARKETING_MANAGER, ROLES.ADMIN_SUPER],
} as const;

export type PortalName = keyof typeof PORTAL_ACCESS;

const PORTAL_FOR_ROLE: Record<string, string> = {
  [ROLES.ADMIN_SUPER]: PORTAL_PATHS.ADMIN,
  [ROLES.ADMIN_MODERATOR]: PORTAL_PATHS.ADMIN,
  [ROLES.BLOG_AUTHOR]: PORTAL_PATHS.ADMIN,
  [ROLES.BLOG_EDITOR]: PORTAL_PATHS.ADMIN,
  [ROLES.SUPPORT_AGENT]: PORTAL_PATHS.ADMIN,
  [ROLES.SUPPORT_LEAD]: PORTAL_PATHS.ADMIN,
  [ROLES.MARKETING_MANAGER]: PORTAL_PATHS.ADMIN,
  [ROLES.JOB_SEEKER]: PORTAL_PATHS.JOB_SEEKER,
  // AUTHENTICATED is intentionally NOT in this map. Its domain is
  // portal-eligible roles only; the AUTHENTICATED sentinel (signed-in but
  // unassigned) is upstream — callers get `null` from `getUserRole()` and
  // `getPortalForRole(null)` already returns HOME, which the middleware
  // then routes to /onboarding. Adding AUTHENTICATED here would contradict
  // the H-1 invariant that AUTHENTICATED is not in any portal allow-list.
};

export function getPortalForRole(role: Role | null | undefined): string {
  if (!role) return PORTAL_PATHS.HOME;
  if (PORTAL_FOR_ROLE[role]) return PORTAL_FOR_ROLE[role];
  if (role.startsWith("employer_")) return PORTAL_PATHS.EMPLOYER;
  return PORTAL_PATHS.HOME;
}

export function hasRole(userRoles: Role[], allowedRoles: Role[]): boolean {
  if (allowedRoles.includes(ROLES.PUBLIC)) return true;
  if (allowedRoles.includes(ROLES.AUTHENTICATED) && userRoles.length > 0)
    return true;
  return userRoles.some((role) => allowedRoles.includes(role));
}

export function canAccessPortal(
  userRoles: Role[],
  portal: PortalName,
): boolean {
  return hasRole(userRoles, [...PORTAL_ACCESS[portal]]);
}

/**
 * Returns true when the given role is allowed to see the `/onboarding` page.
 * Accepts `null` (no role yet) and `AUTHENTICATED` (signed-in but unassigned);
 * rejects every real portal role — those users are already onboarded and must
 * be routed to their portal instead.
 */
export function canAccessOnboarding(role: Role | null): boolean {
  if (role === null) return true;
  return role === ROLES.AUTHENTICATED;
}
