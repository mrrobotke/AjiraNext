import { describe, it, expect, vi, beforeEach } from "vitest";
import { ROLES } from "./rbac";

vi.mock("./auth", () => ({
  getUserRole: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    // Emulate Next.js behaviour: throw so downstream code stops executing.
    const err = new Error(`NEXT_REDIRECT:${url}`) as Error & {
      digest: string;
    };
    err.digest = `NEXT_REDIRECT;replace;${url};307;`;
    throw err;
  }),
}));

import { getUserRole } from "./auth";
import { redirect } from "next/navigation";
import { guardPortal } from "./portal-guard";

const mockedGetUserRole = vi.mocked(getUserRole);
const mockedRedirect = vi.mocked(redirect);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("guardPortal", () => {
  it("redirects to /onboarding when the role is null", async () => {
    mockedGetUserRole.mockResolvedValue(null);

    await expect(guardPortal("JOB_SEEKER_PORTAL")).rejects.toThrow(
      /NEXT_REDIRECT:\/onboarding/,
    );
    expect(mockedRedirect).toHaveBeenCalledWith("/onboarding");
  });

  it("redirects to /auth?error=ACCESS_DENIED when the role cannot access the portal", async () => {
    mockedGetUserRole.mockResolvedValue(ROLES.JOB_SEEKER);

    await expect(guardPortal("EMPLOYER_PORTAL")).rejects.toThrow(
      /NEXT_REDIRECT:\/auth\?error=ACCESS_DENIED/,
    );
    expect(mockedRedirect).toHaveBeenCalledWith("/auth?error=ACCESS_DENIED");
  });

  it("returns the role when access is allowed (JOB_SEEKER)", async () => {
    mockedGetUserRole.mockResolvedValue(ROLES.JOB_SEEKER);

    const result = await guardPortal("JOB_SEEKER_PORTAL");
    expect(result).toBe(ROLES.JOB_SEEKER);
    expect(mockedRedirect).not.toHaveBeenCalled();
  });

  it("returns the role when access is allowed (EMPLOYER_OWNER)", async () => {
    mockedGetUserRole.mockResolvedValue(ROLES.EMPLOYER_OWNER);

    const result = await guardPortal("EMPLOYER_PORTAL");
    expect(result).toBe(ROLES.EMPLOYER_OWNER);
    expect(mockedRedirect).not.toHaveBeenCalled();
  });

  it("returns the role when ADMIN_SUPER visits ADMIN_PORTAL", async () => {
    mockedGetUserRole.mockResolvedValue(ROLES.ADMIN_SUPER);

    const result = await guardPortal("ADMIN_PORTAL");
    expect(result).toBe(ROLES.ADMIN_SUPER);
    expect(mockedRedirect).not.toHaveBeenCalled();
  });
});
