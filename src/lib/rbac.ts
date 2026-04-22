export const ROLES = {
  // System roles
  ADMIN_SUPER: "admin_super",
  ADMIN_MODERATOR: "admin_moderator",
  SUPPORT_LEAD: "support_lead",
  SUPPORT_AGENT: "support_agent",
  MARKETING_MANAGER: "marketing_manager",
  BLOG_AUTHOR: "blog_author",
  BLOG_EDITOR: "blog_editor",

  // Company roles
  EMPLOYER_OWNER: "employer_owner",
  EMPLOYER_ADMIN: "employer_admin",
  EMPLOYER_RECRUITER: "employer_recruiter",
  EMPLOYER_HIRING_MANAGER: "employer_hiring_manager",
  EMPLOYER_BILLING: "employer_billing",

  // Job seeker role
  JOB_SEEKER: "job_seeker",

  // Special access
  PUBLIC: "public",
  AUTHENTICATED: "authenticated",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PORTAL_ACCESS = {
  JOB_SEEKER_PORTAL: [ROLES.JOB_SEEKER, ROLES.AUTHENTICATED, ROLES.ADMIN_SUPER],
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
  ],
  SUPPORT_PORTAL: [ROLES.SUPPORT_AGENT, ROLES.SUPPORT_LEAD, ROLES.ADMIN_SUPER],
  MARKETING_PORTAL: [ROLES.MARKETING_MANAGER, ROLES.ADMIN_SUPER],
} as const;

export type PortalName = keyof typeof PORTAL_ACCESS;

/**
 * Returns the default portal path for a given role.
 */
export function getPortalForRole(role: Role | null | undefined): string {
  if (!role) return "/";

  if (
    role === ROLES.ADMIN_SUPER ||
    role === ROLES.ADMIN_MODERATOR ||
    role === ROLES.BLOG_AUTHOR ||
    role === ROLES.BLOG_EDITOR
  ) {
    return "/admin";
  }

  if (role.startsWith("employer_")) {
    return "/employer";
  }

  if (
    role === ROLES.SUPPORT_AGENT ||
    role === ROLES.SUPPORT_LEAD ||
    role === ROLES.MARKETING_MANAGER
  ) {
    return "/admin";
  }

  if (role === ROLES.JOB_SEEKER || role === ROLES.AUTHENTICATED) {
    return "/seeker";
  }

  return "/";
}

export function hasRole(userRoles: Role[], allowedRoles: Role[]): boolean {
  if (allowedRoles.includes(ROLES.PUBLIC)) return true;
  // If required is AUTHENTICATED, user just needs some role (implying logged in)
  // Assuming 'public' is not in userRoles for logged in users, or we handle it separately.
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
