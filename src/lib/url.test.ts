import { describe, it, expect, vi } from "vitest";
import { validateRedirectUrl } from "./url";

// Mock config
vi.mock("./config", () => ({
  config: {
    baseUrl: "https://ajiranext.example.com",
  },
}));

describe("validateRedirectUrl", () => {
  it("allows valid relative paths", () => {
    expect(validateRedirectUrl("/profile")).toBe("/profile");
    expect(validateRedirectUrl("/jobs?q=nextjs")).toBe("/jobs?q=nextjs");
    expect(validateRedirectUrl("/")).toBe("/");
  });

  it("allows valid absolute paths with same origin", () => {
    expect(validateRedirectUrl("https://ajiranext.example.com/profile")).toBe(
      "/profile",
    );
  });

  it("blocks external domains", () => {
    expect(validateRedirectUrl("https://evil.com/phish")).toBeNull();
    expect(validateRedirectUrl("//evil.com")).toBeNull();
  });

  it("blocks malformed URLs", () => {
    expect(validateRedirectUrl("javascript:alert(1)")).toBeNull();
    expect(validateRedirectUrl(null)).toBeNull();
    expect(validateRedirectUrl("")).toBeNull();
  });

  describe("URL-encoded attacks", () => {
    it("blocks URL-encoded double-slash (//evil.com)", () => {
      expect(validateRedirectUrl("%2F%2Fevil.com")).toBeNull();
    });

    it("blocks URL-encoded colon-slash (%3A//evil.com)", () => {
      expect(validateRedirectUrl("https%3A%2F%2Fevil.com")).toBeNull();
    });
  });

  describe("protocol attacks", () => {
    it("blocks data: URIs", () => {
      expect(
        validateRedirectUrl("data:text/html,<script>alert(1)</script>"),
      ).toBeNull();
      expect(validateRedirectUrl("DATA:text/html,xss")).toBeNull();
    });

    it("blocks javascript: protocol case variants", () => {
      expect(validateRedirectUrl("JavaScript:alert(1)")).toBeNull();
      expect(validateRedirectUrl("JAVASCRIPT:alert(1)")).toBeNull();
    });
  });

  describe("backslash tricks", () => {
    it("blocks backslash-based redirects", () => {
      expect(validateRedirectUrl("\\/evil.com")).toBeNull();
      expect(validateRedirectUrl("//evil.com\\@legit.com")).toBeNull();
    });
  });

  describe("null bytes", () => {
    it("passes through encoded null bytes in relative paths (no stripping)", () => {
      expect(validateRedirectUrl("/good%00evil")).toBe("/good%00evil");
    });
  });

  describe("edge cases", () => {
    it("handles empty string", () => {
      expect(validateRedirectUrl("")).toBeNull();
    });

    it("handles undefined", () => {
      expect(validateRedirectUrl(undefined)).toBeNull();
    });

    it("allows hash and query in relative paths", () => {
      expect(validateRedirectUrl("/profile?tab=settings#section")).toBe(
        "/profile?tab=settings#section",
      );
    });

    it("blocks protocol-relative URLs (//evil.com/path)", () => {
      expect(validateRedirectUrl("//evil.com/path")).toBeNull();
    });
  });
});
