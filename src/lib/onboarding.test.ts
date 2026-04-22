import { describe, it, expect, vi } from "vitest";
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

  it("defaults to job_seeker for all non-employer roles", () => {
    expect(getOnboardingRoleForSignup(ROLES.EMPLOYER_RECRUITER)).toBe(
      "job_seeker",
    );
    expect(getOnboardingRoleForSignup(ROLES.SUPPORT_AGENT)).toBe("job_seeker");
    expect(getOnboardingRoleForSignup(ROLES.MARKETING_MANAGER)).toBe(
      "job_seeker",
    );
  });
});

describe("syncOnboardingRole", () => {
  it("calls the onboarding API with correct payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    globalThis.fetch = fetchMock;

    const { syncOnboardingRole } = await import("./onboarding");
    await syncOnboardingRole("test-token", "job_seeker");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8085/v1/onboarding/role",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        },
        body: JSON.stringify({ role: "job_seeker" }),
      },
    );
  });

  it("returns the response on error", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 503 });
    globalThis.fetch = fetchMock;

    const { syncOnboardingRole } = await import("./onboarding");
    const response = await syncOnboardingRole("test-token", "employer");

    expect(response.ok).toBe(false);
    expect(response.status).toBe(503);
  });
});
