import { describe, it, expect } from "vitest";
import { resolveSafeRedirect } from "./url";

describe("resolveSafeRedirect", () => {
  describe("valid relative paths", () => {
    it("passes simple paths through", () => {
      expect(resolveSafeRedirect("/dashboard")).toBe("/dashboard");
      expect(resolveSafeRedirect("/profile")).toBe("/profile");
      expect(resolveSafeRedirect("/")).toBe("/");
    });

    it("preserves query string and hash", () => {
      expect(resolveSafeRedirect("/jobs?q=nextjs")).toBe("/jobs?q=nextjs");
      expect(resolveSafeRedirect("/profile?tab=settings#section")).toBe(
        "/profile?tab=settings#section",
      );
    });

    it("passes through paths containing encoded null bytes", () => {
      expect(resolveSafeRedirect("/good%00evil")).toBe("/good%00evil");
    });
  });

  describe("null / empty / malformed inputs return the fallback", () => {
    it("returns fallback for null and undefined", () => {
      expect(resolveSafeRedirect(null)).toBe("/");
      expect(resolveSafeRedirect(undefined)).toBe("/");
    });

    it("returns fallback for the empty string", () => {
      expect(resolveSafeRedirect("")).toBe("/");
    });

    it("returns the supplied fallback when input is invalid", () => {
      expect(resolveSafeRedirect(null, "/home")).toBe("/home");
      expect(resolveSafeRedirect("https://evil.com", "/home")).toBe("/home");
    });
  });

  describe("cross-origin and protocol-based redirects are rejected", () => {
    it("rejects external https URLs", () => {
      expect(resolveSafeRedirect("https://evil.com")).toBe("/");
      expect(resolveSafeRedirect("https://evil.com/phish")).toBe("/");
    });

    it("rejects protocol-relative URLs (//evil.com)", () => {
      expect(resolveSafeRedirect("//evil.com")).toBe("/");
      expect(resolveSafeRedirect("//evil.com/path")).toBe("/");
    });

    it("rejects javascript: and data: schemes (any case)", () => {
      expect(resolveSafeRedirect("javascript:alert(1)")).toBe("/");
      expect(resolveSafeRedirect("JavaScript:alert(1)")).toBe("/");
      expect(resolveSafeRedirect("JAVASCRIPT:alert(1)")).toBe("/");
      expect(
        resolveSafeRedirect("data:text/html,<script>alert(1)</script>"),
      ).toBe("/");
      expect(resolveSafeRedirect("DATA:text/html,xss")).toBe("/");
    });
  });

  describe("separator-smuggling payloads are rejected", () => {
    it("rejects backslash-based tricks", () => {
      expect(resolveSafeRedirect("/\\evil.com")).toBe("/");
      expect(resolveSafeRedirect("\\/evil.com")).toBe("/");
      expect(resolveSafeRedirect("//evil.com\\@legit.com")).toBe("/");
    });

    it("rejects URL-encoded tab in path (e.g. /%09/evil.com)", () => {
      expect(resolveSafeRedirect("/%09/evil.com")).toBe("/");
    });

    it("rejects URL-encoded newline/CR in path", () => {
      expect(resolveSafeRedirect("/%0A/evil.com")).toBe("/");
      expect(resolveSafeRedirect("/%0D/evil.com")).toBe("/");
    });

    it("rejects URL-encoded backslash (%5C)", () => {
      expect(resolveSafeRedirect("/%5Cevil.com")).toBe("/");
    });

    it("rejects literal whitespace-only inputs", () => {
      // A space isn't in the control-char rejection list, but the URL parser
      // resolves " " to the sentinel root (pathname "/"), which is an
      // acceptable same-origin destination. We still assert it can't escape.
      expect(resolveSafeRedirect("   ")).toBe("/");
    });

    it("rejects raw tab / CR / LF in input", () => {
      expect(resolveSafeRedirect("/foo\tbar")).toBe("/");
      expect(resolveSafeRedirect("/foo\rbar")).toBe("/");
      expect(resolveSafeRedirect("/foo\nbar")).toBe("/");
    });
  });
});
