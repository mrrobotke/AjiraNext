import { describe, it, expect } from "vitest";
import { mapAuthError } from "./auth-errors";

describe("mapAuthError", () => {
  it("maps invalid login credentials", () => {
    expect(mapAuthError("Invalid login credentials")).toBe(
      "Email or password is incorrect.",
    );
  });
  it("maps email not confirmed", () => {
    expect(mapAuthError("Email not confirmed")).toBe(
      "Please confirm your email before signing in.",
    );
  });
  it("maps user already registered", () => {
    expect(mapAuthError("User already registered")).toBe(
      "An account with this email already exists.",
    );
  });
  it("maps rate limit", () => {
    expect(mapAuthError("Rate limit exceeded")).toBe(
      "Too many attempts. Please wait a moment and try again.",
    );
  });
  it("maps network errors", () => {
    expect(mapAuthError("Network request failed")).toBe(
      "Network error. Please check your connection and try again.",
    );
  });
  it("returns generic message for unknown errors", () => {
    expect(mapAuthError("something weird")).toBe(
      "Something went wrong. Please try again.",
    );
  });
  it("returns generic message for empty input", () => {
    expect(mapAuthError("")).toBe("Something went wrong. Please try again.");
  });
});
