import { describe, it, expect } from "vitest";
import {
  ROLES,
  getPortalForRole,
  hasRole,
  canAccessPortal,
  canAccessOnboarding,
  isRole,
} from "./rbac";

describe("isRole", () => {
  it("returns true for valid roles", () => {
    expect(isRole(ROLES.JOB_SEEKER)).toBe(true);
    expect(isRole(ROLES.ADMIN_SUPER)).toBe(true);
    expect(isRole(ROLES.AUTHENTICATED)).toBe(true);
  });
  it("returns false for invalid values", () => {
    expect(isRole("hacker")).toBe(false);
    expect(isRole(123)).toBe(false);
    expect(isRole(null)).toBe(false);
    expect(isRole(undefined)).toBe(false);
    expect(isRole("")).toBe(false);
  });
});

describe("getPortalForRole", () => {
  it("returns /seeker for job_seeker", () => {
    expect(getPortalForRole(ROLES.JOB_SEEKER)).toBe("/seeker");
  });

  it("returns /employer for employer roles", () => {
    expect(getPortalForRole(ROLES.EMPLOYER_OWNER)).toBe("/employer");
    expect(getPortalForRole(ROLES.EMPLOYER_ADMIN)).toBe("/employer");
    expect(getPortalForRole(ROLES.EMPLOYER_RECRUITER)).toBe("/employer");
  });

  it("returns /employer for all employer roles", () => {
    expect(getPortalForRole(ROLES.EMPLOYER_HIRING_MANAGER)).toBe("/employer");
    expect(getPortalForRole(ROLES.EMPLOYER_BILLING)).toBe("/employer");
  });

  it("returns /admin for admin roles", () => {
    expect(getPortalForRole(ROLES.ADMIN_SUPER)).toBe("/admin");
    expect(getPortalForRole(ROLES.ADMIN_MODERATOR)).toBe("/admin");
  });

  it("returns /admin for blog and support roles", () => {
    expect(getPortalForRole(ROLES.BLOG_AUTHOR)).toBe("/admin");
    expect(getPortalForRole(ROLES.BLOG_EDITOR)).toBe("/admin");
    expect(getPortalForRole(ROLES.SUPPORT_AGENT)).toBe("/admin");
    expect(getPortalForRole(ROLES.SUPPORT_LEAD)).toBe("/admin");
    expect(getPortalForRole(ROLES.MARKETING_MANAGER)).toBe("/admin");
  });

  it("returns / for null or unknown roles", () => {
    expect(getPortalForRole(null)).toBe("/");
    expect(getPortalForRole(undefined)).toBe("/");
    expect(
      getPortalForRole("unknown" as (typeof ROLES)[keyof typeof ROLES]),
    ).toBe("/");
  });
});

describe("hasRole", () => {
  it("returns true when PUBLIC is in allowed roles", () => {
    expect(hasRole([ROLES.JOB_SEEKER], [ROLES.PUBLIC])).toBe(true);
  });

  it("returns true when AUTHENTICATED is required and user has any role", () => {
    expect(hasRole([ROLES.JOB_SEEKER], [ROLES.AUTHENTICATED])).toBe(true);
  });

  it("returns false when user has no matching role", () => {
    expect(hasRole([ROLES.JOB_SEEKER], [ROLES.EMPLOYER_OWNER])).toBe(false);
  });

  it("returns true when user has a matching role", () => {
    expect(hasRole([ROLES.EMPLOYER_OWNER], [ROLES.EMPLOYER_OWNER])).toBe(true);
  });

  it("returns false for empty user roles with AUTHENTICATED requirement", () => {
    expect(hasRole([], [ROLES.AUTHENTICATED])).toBe(false);
  });
});

describe("canAccessPortal", () => {
  it("allows job_seeker to access JOB_SEEKER_PORTAL", () => {
    expect(canAccessPortal([ROLES.JOB_SEEKER], "JOB_SEEKER_PORTAL")).toBe(true);
  });

  it("allows admin_super to access any portal", () => {
    expect(canAccessPortal([ROLES.ADMIN_SUPER], "JOB_SEEKER_PORTAL")).toBe(
      true,
    );
    expect(canAccessPortal([ROLES.ADMIN_SUPER], "EMPLOYER_PORTAL")).toBe(true);
    expect(canAccessPortal([ROLES.ADMIN_SUPER], "ADMIN_PORTAL")).toBe(true);
  });

  it("allows admin to access all portals", () => {
    expect(canAccessPortal([ROLES.ADMIN_SUPER], "SUPPORT_PORTAL")).toBe(true);
    expect(canAccessPortal([ROLES.ADMIN_SUPER], "MARKETING_PORTAL")).toBe(true);
  });

  it("blocks job_seeker from employer portal", () => {
    expect(canAccessPortal([ROLES.JOB_SEEKER], "EMPLOYER_PORTAL")).toBe(false);
  });

  it("blocks empty roles", () => {
    expect(canAccessPortal([], "JOB_SEEKER_PORTAL")).toBe(false);
  });

  it("handles multiple roles", () => {
    expect(
      canAccessPortal([ROLES.JOB_SEEKER, ROLES.ADMIN_SUPER], "EMPLOYER_PORTAL"),
    ).toBe(true);
  });

  it("returns / for PUBLIC role", () => {
    expect(getPortalForRole(ROLES.PUBLIC)).toBe("/");
  });

  it("blocks AUTHENTICATED (no real role yet) from JOB_SEEKER_PORTAL — H-1 fix", () => {
    expect(canAccessPortal([ROLES.AUTHENTICATED], "JOB_SEEKER_PORTAL")).toBe(
      false,
    );
  });

  it("blocks AUTHENTICATED (no real role yet) from every portal — H-1 fix", () => {
    expect(canAccessPortal([ROLES.AUTHENTICATED], "EMPLOYER_PORTAL")).toBe(
      false,
    );
    expect(canAccessPortal([ROLES.AUTHENTICATED], "ADMIN_PORTAL")).toBe(false);
    expect(canAccessPortal([ROLES.AUTHENTICATED], "SUPPORT_PORTAL")).toBe(
      false,
    );
    expect(canAccessPortal([ROLES.AUTHENTICATED], "MARKETING_PORTAL")).toBe(
      false,
    );
  });

  it("allows EMPLOYER_OWNER to access EMPLOYER_PORTAL", () => {
    expect(canAccessPortal([ROLES.EMPLOYER_OWNER], "EMPLOYER_PORTAL")).toBe(
      true,
    );
  });

  it("allows SUPPORT_AGENT to access SUPPORT_PORTAL", () => {
    expect(canAccessPortal([ROLES.SUPPORT_AGENT], "SUPPORT_PORTAL")).toBe(true);
  });

  it("allows MARKETING_MANAGER to access MARKETING_PORTAL", () => {
    expect(canAccessPortal([ROLES.MARKETING_MANAGER], "MARKETING_PORTAL")).toBe(
      true,
    );
  });

  it("returns false for empty allowedRoles", () => {
    expect(hasRole([ROLES.JOB_SEEKER], [])).toBe(false);
  });
});

describe("canAccessOnboarding", () => {
  it("allows null (role-less / pre-onboarding) users", () => {
    expect(canAccessOnboarding(null)).toBe(true);
  });

  it("allows AUTHENTICATED sentinel (legacy callers passing it)", () => {
    expect(canAccessOnboarding(ROLES.AUTHENTICATED)).toBe(true);
  });

  it("blocks real portal roles — they are already onboarded", () => {
    expect(canAccessOnboarding(ROLES.JOB_SEEKER)).toBe(false);
    expect(canAccessOnboarding(ROLES.EMPLOYER_OWNER)).toBe(false);
    expect(canAccessOnboarding(ROLES.ADMIN_SUPER)).toBe(false);
    expect(canAccessOnboarding(ROLES.BLOG_AUTHOR)).toBe(false);
    expect(canAccessOnboarding(ROLES.SUPPORT_AGENT)).toBe(false);
    expect(canAccessOnboarding(ROLES.MARKETING_MANAGER)).toBe(false);
  });
});
