// @vitest-environment jsdom
import "@/test/setup-dom";

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { AUTH_ERROR_CODES, authErrorMessage } from "@/lib/auth-errors";

/* ------------------------------------------------------------------ */
/*  Hoisted mocks                                                      */
/* ------------------------------------------------------------------ */

const { routerMock, setOnboardingRoleMock } = vi.hoisted(() => ({
  routerMock: {
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  },
  setOnboardingRoleMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
}));

vi.mock("@/app/auth/actions", () => ({
  setOnboardingRole: setOnboardingRoleMock,
}));

/* ------------------------------------------------------------------ */
/*  Component under test                                               */
/* ------------------------------------------------------------------ */

import OnboardingClient from "./OnboardingClient";

beforeEach(() => {
  vi.clearAllMocks();
});

/* ------------------------------------------------------------------ */
/*  Happy paths                                                        */
/* ------------------------------------------------------------------ */

describe("OnboardingClient — happy paths", () => {
  it("clicking 'Find a Job' calls setOnboardingRole('job_seeker') and shows no error", async () => {
    // When the server action server-side redirects, the client receives nothing.
    setOnboardingRoleMock.mockResolvedValueOnce(undefined);
    render(<OnboardingClient />);
    fireEvent.click(screen.getByRole("button", { name: /find a job/i }));
    await waitFor(() =>
      expect(setOnboardingRoleMock).toHaveBeenCalledWith("job_seeker"),
    );
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("clicking 'Hire Talent' calls setOnboardingRole('employer')", async () => {
    setOnboardingRoleMock.mockResolvedValueOnce(undefined);
    render(<OnboardingClient />);
    fireEvent.click(screen.getByRole("button", { name: /hire talent/i }));
    await waitFor(() =>
      expect(setOnboardingRoleMock).toHaveBeenCalledWith("employer"),
    );
    expect(setOnboardingRoleMock).toHaveBeenCalledTimes(1);
  });

  it("an explicit { success: true } return (defensive — shouldn't normally happen) shows no feedback", async () => {
    setOnboardingRoleMock.mockResolvedValueOnce({ success: true });
    render(<OnboardingClient />);
    fireEvent.click(screen.getByRole("button", { name: /find a job/i }));
    await waitFor(() => expect(setOnboardingRoleMock).toHaveBeenCalled());
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/*  C-4 regression fence — ONBOARDING_CONFLICT path                    */
/* ------------------------------------------------------------------ */

describe("OnboardingClient — ONBOARDING_CONFLICT (C-4 regression fence)", () => {
  it("renders an INFO toast and calls router.replace(result.redirect) — not a danger alert", async () => {
    setOnboardingRoleMock.mockResolvedValueOnce({
      error: { code: AUTH_ERROR_CODES.ONBOARDING_CONFLICT },
      redirect: "/seeker",
    });
    render(<OnboardingClient />);
    fireEvent.click(screen.getByRole("button", { name: /find a job/i }));

    const status = await screen.findByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent(
      authErrorMessage(AUTH_ERROR_CODES.ONBOARDING_CONFLICT),
    );
    // It's info, not danger — no role="alert" in this branch.
    expect(screen.queryByRole("alert")).toBeNull();

    // Navigation fence — the conflict path redirects exactly once to the
    // path returned by the server action.
    expect(routerMock.replace).toHaveBeenCalledTimes(1);
    expect(routerMock.replace).toHaveBeenCalledWith("/seeker");
    expect(routerMock.refresh).not.toHaveBeenCalled();
  });

  it("when the backend omits `redirect`, falls back to router.refresh()", async () => {
    setOnboardingRoleMock.mockResolvedValueOnce({
      error: { code: AUTH_ERROR_CODES.ONBOARDING_CONFLICT },
    });
    render(<OnboardingClient />);
    fireEvent.click(screen.getByRole("button", { name: /find a job/i }));

    await waitFor(() => expect(routerMock.refresh).toHaveBeenCalledTimes(1));
    expect(routerMock.replace).not.toHaveBeenCalled();
  });

  it("ONBOARDING_CONFLICT never triggers the danger Retry button (info-only branch)", async () => {
    setOnboardingRoleMock.mockResolvedValueOnce({
      error: { code: AUTH_ERROR_CODES.ONBOARDING_CONFLICT },
      redirect: "/employer",
    });
    render(<OnboardingClient />);
    fireEvent.click(screen.getByRole("button", { name: /hire talent/i }));
    await screen.findByRole("status");
    expect(screen.queryByRole("button", { name: /retry/i })).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/*  Other error paths                                                   */
/* ------------------------------------------------------------------ */

describe("OnboardingClient — NOT_AUTHENTICATED", () => {
  it("redirects to /auth?mode=signin without showing any local feedback", async () => {
    setOnboardingRoleMock.mockResolvedValueOnce({
      error: { code: AUTH_ERROR_CODES.NOT_AUTHENTICATED },
    });
    render(<OnboardingClient />);
    fireEvent.click(screen.getByRole("button", { name: /find a job/i }));
    await waitFor(() =>
      expect(routerMock.push).toHaveBeenCalledWith("/auth?mode=signin"),
    );
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

describe("OnboardingClient — generic backend failure", () => {
  it("on SYNC_FAILED, shows a danger alert with authErrorMessage() and a Retry button", async () => {
    setOnboardingRoleMock.mockResolvedValueOnce({
      error: { code: AUTH_ERROR_CODES.SYNC_FAILED },
    });
    render(<OnboardingClient />);
    fireEvent.click(screen.getByRole("button", { name: /find a job/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveAttribute("aria-live", "assertive");
    expect(alert).toHaveTextContent(
      authErrorMessage(AUTH_ERROR_CODES.SYNC_FAILED),
    );
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("Retry button re-invokes setOnboardingRole with the same role", async () => {
    setOnboardingRoleMock
      .mockResolvedValueOnce({
        error: { code: AUTH_ERROR_CODES.SYNC_FAILED },
      })
      .mockResolvedValueOnce(undefined);
    render(<OnboardingClient />);
    fireEvent.click(screen.getByRole("button", { name: /find a job/i }));
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    await waitFor(() => expect(setOnboardingRoleMock).toHaveBeenCalledTimes(2));
    expect(setOnboardingRoleMock).toHaveBeenNthCalledWith(2, "job_seeker");
  });

  it("on INVALID_ROLE, shows the danger alert but NO Retry button (terminal state)", async () => {
    setOnboardingRoleMock.mockResolvedValueOnce({
      error: { code: AUTH_ERROR_CODES.INVALID_ROLE },
    });
    render(<OnboardingClient />);
    fireEvent.click(screen.getByRole("button", { name: /find a job/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      authErrorMessage(AUTH_ERROR_CODES.INVALID_ROLE),
    );
    expect(screen.queryByRole("button", { name: /retry/i })).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/*  M-sf-2 regression fence — thrown errors from setOnboardingRole    */
/*  must surface UNKNOWN, not be silently swallowed.                  */
/* ------------------------------------------------------------------ */

describe("OnboardingClient — thrown error (M-sf-2 regression fence)", () => {
  it("on thrown network error, shows a danger alert with UNKNOWN message", async () => {
    // Silence the deliberate console.error so the vitest report stays clean
    // while still exercising the catch branch.
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    setOnboardingRoleMock.mockRejectedValueOnce(new Error("network down"));
    render(<OnboardingClient />);
    fireEvent.click(screen.getByRole("button", { name: /find a job/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(authErrorMessage(AUTH_ERROR_CODES.UNKNOWN));
    expect(errorSpy).toHaveBeenCalledWith(
      "[OnboardingClient] setOnboardingRole threw:",
      "network down",
    );
    errorSpy.mockRestore();
  });
});
