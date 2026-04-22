import { describe, it, expect } from "vitest";
import { parseOnboardingRole, getOnboardingRoleForSignup } from "./onboarding";
import { ROLES } from "./rbac";

describe("parseOnboardingRole", () => {
  it("returns job_seeker for 'job_seeker'", () => {
    expect(parseOnboardingRole("job_seeker")).toBe("job_seeker");
  });

  it("returns employer for 'employer'", () => {
    expect(parseOnboardingRole("employer")).toBe("employer");
  });

  it("returns null for invalid values", () => {
    expect(parseOnboardingRole("admin")).toBeNull();
    expect(parseOnboardingRole("")).toBeNull();
    expect(parseOnboardingRole(null)).toBeNull();
    expect(parseOnboardingRole(undefined)).toBeNull();
  });

  it("is case-sensitive", () => {
    expect(parseOnboardingRole("Job_Seeker")).toBeNull();
    expect(parseOnboardingRole("EMPLOYER")).toBeNull();
  });
});

describe("getOnboardingRoleForSignup", () => {
  it("returns employer for EMPLOYER_OWNER", () => {
    expect(getOnboardingRoleForSignup(ROLES.EMPLOYER_OWNER)).toBe("employer");
  });

  it("returns job_seeker for JOB_SEEKER", () => {
    expect(getOnboardingRoleForSignup(ROLES.JOB_SEEKER)).toBe("job_seeker");
  });

  it("defaults to job_seeker for other roles", () => {
    expect(getOnboardingRoleForSignup(ROLES.ADMIN_SUPER)).toBe("job_seeker");
    expect(getOnboardingRoleForSignup(ROLES.EMPLOYER_ADMIN)).toBe("job_seeker");
  });
});
