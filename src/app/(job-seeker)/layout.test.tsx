import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

vi.mock("@/lib/portal-guard", () => ({
  guardPortal: vi.fn(),
}));

import { guardPortal } from "@/lib/portal-guard";
import JobSeekerLayout from "./layout";

const mockedGuardPortal = vi.mocked(guardPortal);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("JobSeekerLayout", () => {
  it("calls guardPortal with JOB_SEEKER_PORTAL before returning", async () => {
    mockedGuardPortal.mockResolvedValue("job_seeker");

    await JobSeekerLayout({ children: <div>placeholder</div> });

    expect(mockedGuardPortal).toHaveBeenCalledTimes(1);
    expect(mockedGuardPortal).toHaveBeenCalledWith("JOB_SEEKER_PORTAL");
  });

  it("returns the children wrapped in a Fragment when access is allowed", async () => {
    mockedGuardPortal.mockResolvedValue("job_seeker");
    const children = <div data-testid="child">body</div>;

    const element = await JobSeekerLayout({ children });

    expect(element.type).toBe(React.Fragment);
    expect(element.props.children).toBe(children);
  });

  it("propagates NEXT_REDIRECT when guardPortal rejects (H-1 null-role case)", async () => {
    const err = new Error("NEXT_REDIRECT") as Error & { digest: string };
    err.digest = "NEXT_REDIRECT;replace;/onboarding;307;";
    mockedGuardPortal.mockRejectedValue(err);

    await expect(
      JobSeekerLayout({ children: <div>placeholder</div> }),
    ).rejects.toMatchObject({ digest: expect.stringContaining("/onboarding") });
  });

  it("propagates NEXT_REDIRECT when role cannot access the portal", async () => {
    const err = new Error("NEXT_REDIRECT") as Error & { digest: string };
    err.digest = "NEXT_REDIRECT;replace;/auth?error=ACCESS_DENIED;307;";
    mockedGuardPortal.mockRejectedValue(err);

    await expect(
      JobSeekerLayout({ children: <div>placeholder</div> }),
    ).rejects.toMatchObject({
      digest: expect.stringContaining("ACCESS_DENIED"),
    });
  });
});
