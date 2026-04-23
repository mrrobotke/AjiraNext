import { describe, it, expect } from "vitest";
import {
  AUTH_ERROR_CODES,
  authErrorMessage,
  type AuthErrorCode,
} from "./auth-errors";

describe("authErrorMessage", () => {
  const codes: AuthErrorCode[] = Object.values(AUTH_ERROR_CODES);

  it.each(codes)("returns a non-empty message for code %s", (code) => {
    const msg = authErrorMessage(code);
    expect(typeof msg).toBe("string");
    expect(msg.length).toBeGreaterThan(0);
  });

  it("returns the INVALID_CREDENTIALS copy verbatim", () => {
    expect(authErrorMessage(AUTH_ERROR_CODES.INVALID_CREDENTIALS)).toBe(
      "Incorrect email or password.",
    );
  });

  it("returns the RATE_LIMITED copy verbatim", () => {
    expect(authErrorMessage(AUTH_ERROR_CODES.RATE_LIMITED)).toBe(
      "Too many attempts. Please wait a moment and try again.",
    );
  });

  it("returns the ONBOARDING_CONFLICT copy verbatim", () => {
    expect(authErrorMessage(AUTH_ERROR_CODES.ONBOARDING_CONFLICT)).toBe(
      "Your account already has a role. Redirecting…",
    );
  });

  it("falls back to UNKNOWN copy for an unrecognized code", () => {
    const unknownMsg = authErrorMessage(AUTH_ERROR_CODES.UNKNOWN);
    expect(authErrorMessage("NOT_A_CODE" as unknown as AuthErrorCode)).toBe(
      unknownMsg,
    );
  });
});
