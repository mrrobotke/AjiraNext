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
  [ROLES.AUTHENTICATED]: PORTAL_PATHS.JOB_SEEKER,
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
