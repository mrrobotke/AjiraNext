// @vitest-environment jsdom
import "@/test/setup-dom";

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import {
  AUTH_ERROR_CODES,
  authErrorMessage,
  type AuthErrorCode,
} from "@/lib/auth-errors";
import { AUTH_FORM_ERROR_ID } from "@/design-system/organisms/AuthForm";

/* ------------------------------------------------------------------ */
/*  Hoisted mocks                                                      */
/* ------------------------------------------------------------------ */

const {
  routerMock,
  searchParamsMock,
  loginMock,
  signupMock,
  signInWithGoogleMock,
  requestPasswordResetMock,
} = vi.hoisted(() => ({
  routerMock: {
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  },
  searchParamsMock: new URLSearchParams(""),
  loginMock: vi.fn(),
  signupMock: vi.fn(),
  signInWithGoogleMock: vi.fn(),
  requestPasswordResetMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
  useSearchParams: () => searchParamsMock,
}));

vi.mock("./actions", () => ({
  login: loginMock,
  signup: signupMock,
  signInWithGoogle: signInWithGoogleMock,
  requestPasswordReset: requestPasswordResetMock,
}));

/* ------------------------------------------------------------------ */
/*  Component under test (imported AFTER mocks are registered)         */
/* ------------------------------------------------------------------ */

import { AuthFormClient } from "./AuthFormClient";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fillLoginFormFields() {
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "a@b.co" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "pw12345" },
  });
}

function submitForm() {
  const form = document.querySelector("form");
  if (!form) throw new Error("expected a <form> in the rendered tree");
  fireEvent.submit(form);
}

beforeEach(() => {
  vi.clearAllMocks();
});

const allCodes: AuthErrorCode[] = Object.values(AUTH_ERROR_CODES);

/* ------------------------------------------------------------------ */
/*  C-1 regression fence — every AuthErrorCode surfaces as            */
/*  authErrorMessage(code) exactly once. Guards against              */
/*  double-mapping re-introduction.                                   */
/* ------------------------------------------------------------------ */

describe("AuthFormClient — each AuthErrorCode → authErrorMessage(code) exactly once", () => {
  for (const code of allCodes) {
    it(`renders authErrorMessage("${code}") once when login returns { error: { code: "${code}" } }`, async () => {
      loginMock.mockResolvedValueOnce({ error: { code } });
      render(
        <AuthFormClient
          initialMode="signin"
          initialRole="seeker"
          initialError={null}
        />,
      );
      fillLoginFormFields();
      submitForm();

      const alert = await screen.findByRole("alert");
      const expected = authErrorMessage(code);
      expect(alert).toHaveTextContent(expected);
      expect(alert).toHaveAttribute("id", AUTH_FORM_ERROR_ID);
      expect(alert).toHaveAttribute("aria-live", "assertive");

      // Must render exactly once — double-mapping would have surfaced twice.
      const matches = screen.getAllByText(expected);
      expect(matches).toHaveLength(1);

      // H-3 aria wiring when error is present.
      expect(screen.getByLabelText(/email/i)).toHaveAttribute(
        "aria-describedby",
        AUTH_FORM_ERROR_ID,
      );
      expect(screen.getByLabelText(/password/i)).toHaveAttribute(
        "aria-describedby",
        AUTH_FORM_ERROR_ID,
      );
    });
  }
});

/* ------------------------------------------------------------------ */
/*  Happy paths and provider buttons                                   */
/* ------------------------------------------------------------------ */

describe("AuthFormClient — happy paths and social providers", () => {
  it("does not render an alert when login resolves without an error", async () => {
    loginMock.mockResolvedValueOnce(undefined);
    render(
      <AuthFormClient
        initialMode="signin"
        initialRole="seeker"
        initialError={null}
      />,
    );
    fillLoginFormFields();
    submitForm();
    await waitFor(() => expect(loginMock).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("Google button triggers signInWithGoogle with onboardingRole=job_seeker for the seeker role", async () => {
    signInWithGoogleMock.mockResolvedValueOnce(undefined);
    render(
      <AuthFormClient
        initialMode="signin"
        initialRole="seeker"
        initialError={null}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /google/i }));
    await waitFor(() => expect(signInWithGoogleMock).toHaveBeenCalledTimes(1));
    expect(signInWithGoogleMock).toHaveBeenCalledWith(
      expect.objectContaining({ onboardingRole: "job_seeker" }),
    );
  });

  it("Google button passes onboardingRole=employer when role=employer", async () => {
    signInWithGoogleMock.mockResolvedValueOnce(undefined);
    render(
      <AuthFormClient
        initialMode="signup"
        initialRole="employer"
        initialError={null}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /google/i }));
    await waitFor(() =>
      expect(signInWithGoogleMock).toHaveBeenCalledWith(
        expect.objectContaining({ onboardingRole: "employer" }),
      ),
    );
  });

  it("surfaces the error from signInWithGoogle through authErrorMessage", async () => {
    signInWithGoogleMock.mockResolvedValueOnce({
      error: { code: AUTH_ERROR_CODES.OAUTH_FAILED },
    });
    render(
      <AuthFormClient
        initialMode="signin"
        initialRole="seeker"
        initialError={null}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /google/i }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      authErrorMessage(AUTH_ERROR_CODES.OAUTH_FAILED),
    );
  });

  it("signup success renders the check-email message (not an error alert for the server error code path)", async () => {
    signupMock.mockResolvedValueOnce({ success: true });
    render(
      <AuthFormClient
        initialMode="signup"
        initialRole="seeker"
        initialError={null}
      />,
    );
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Amina Okafor" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "a@b.co" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "pw12345" },
    });
    submitForm();
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "Check your email to confirm your account.",
    );
  });

  it("reset mode: requestPasswordReset success toggles resetSent UI (no error alert)", async () => {
    requestPasswordResetMock.mockResolvedValueOnce({ success: true });
    render(
      <AuthFormClient
        initialMode="reset"
        initialRole="seeker"
        initialError={null}
      />,
    );
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "a@b.co" },
    });
    submitForm();
    // After resetSent, the success card replaces the form.
    await screen.findByText(/check your inbox/i);
    expect(screen.queryByRole("alert")).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/*  H-3 a11y — server-rendered initialError path (from ?error=)        */
/* ------------------------------------------------------------------ */

describe("AuthFormClient — H-3 accessibility wiring", () => {
  it("when initialError is set, the alert has the canonical id + polite-off ARIA, and inputs wire aria-describedby + aria-invalid", () => {
    render(
      <AuthFormClient
        initialMode="signin"
        initialRole="seeker"
        initialError={authErrorMessage(AUTH_ERROR_CODES.SESSION_ERROR)}
      />,
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("id", AUTH_FORM_ERROR_ID);
    expect(alert).toHaveAttribute("aria-live", "assertive");
    expect(alert).toHaveTextContent(
      authErrorMessage(AUTH_ERROR_CODES.SESSION_ERROR),
    );

    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAttribute("aria-describedby", AUTH_FORM_ERROR_ID);
    expect(password).toHaveAttribute("aria-invalid", "true");
    expect(password).toHaveAttribute("aria-describedby", AUTH_FORM_ERROR_ID);
  });

  it("when no error is present, inputs do NOT dangle aria-describedby to a non-existent id", () => {
    render(
      <AuthFormClient
        initialMode="signin"
        initialRole="seeker"
        initialError={null}
      />,
    );
    expect(screen.queryByRole("alert")).toBeNull();
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);
    expect(email).not.toHaveAttribute("aria-invalid", "true");
    expect(email).not.toHaveAttribute("aria-describedby");
    expect(password).not.toHaveAttribute("aria-invalid", "true");
    expect(password).not.toHaveAttribute("aria-describedby");
  });

  it("signin mode: email=email, password=current-password", () => {
    render(
      <AuthFormClient
        initialMode="signin"
        initialRole="seeker"
        initialError={null}
      />,
    );
    expect(screen.getByLabelText(/email/i)).toHaveAttribute(
      "autocomplete",
      "email",
    );
    expect(screen.getByLabelText(/password/i)).toHaveAttribute(
      "autocomplete",
      "current-password",
    );
  });

  it("signup mode: password=new-password; fullName=name; email=email", () => {
    // A fresh mount is required: AuthFormClient seeds `mode` state from
    // `initialMode` only on first render (useState initial arg), so a
    // rerender with a different prop would not flip modes.
    render(
      <AuthFormClient
        initialMode="signup"
        initialRole="seeker"
        initialError={null}
      />,
    );
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute(
      "autocomplete",
      "name",
    );
    expect(screen.getByLabelText(/email/i)).toHaveAttribute(
      "autocomplete",
      "email",
    );
    expect(screen.getByLabelText(/password/i)).toHaveAttribute(
      "autocomplete",
      "new-password",
    );
  });
});
