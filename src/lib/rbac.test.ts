import { describe, it, expect } from "vitest";
import { ROLES, getPortalForRole, hasRole, canAccessPortal } from "./rbac";

describe("getPortalForRole", () => {
  it("returns /seeker for job_seeker", () => {
    expect(getPortalForRole(ROLES.JOB_SEEKER)).toBe("/seeker");
  });

  it("returns /employer for employer roles", () => {
    expect(getPortalForRole(ROLES.EMPLOYER_OWNER)).toBe("/employer");
    expect(getPortalForRole(ROLES.EMPLOYER_ADMIN)).toBe("/employer");
    expect(getPortalForRole(ROLES.EMPLOYER_RECRUITER)).toBe("/employer");
  });

  it("returns /admin for admin roles", () => {
    expect(getPortalForRole(ROLES.ADMIN_SUPER)).toBe("/admin");
    expect(getPortalForRole(ROLES.ADMIN_MODERATOR)).toBe("/admin");
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

  it("blocks job_seeker from employer portal", () => {
    expect(canAccessPortal([ROLES.JOB_SEEKER], "EMPLOYER_PORTAL")).toBe(false);
  });
});
