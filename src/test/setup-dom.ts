/**
 * Shared setup for Vitest tests that use the jsdom environment.
 *
 * Usage (import as the very first statement of a component test file,
 * after the `// @vitest-environment jsdom` directive):
 *
 *     // @vitest-environment jsdom
 *     import "@/test/setup-dom";
 *
 * This module:
 *   - extends Vitest's `expect` with the jest-dom matchers
 *   - cleans up any rendered React tree after every test to prevent
 *     DOM leakage across tests
 */
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
