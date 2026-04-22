import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ROLES } from "./rbac";

// We must mock the server client before importing auth
vi.mock("./supabase/server", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "./supabase/server";
import { getUserRole, getUser, isRole } from "./auth";

const mockCreateClient = vi.mocked(createClient);

// Helper to avoid TS complaints about resolved promise vs plain object
function mockClient(value: unknown) {
  mockCreateClient.mockResolvedValue(value as never);
}

describe("isRole", () => {
  it("returns true for valid roles", () => {
    expect(isRole(ROLES.JOB_SEEKER)).toBe(true);
    expect(isRole(ROLES.ADMIN_SUPER)).toBe(true);
    expect(isRole(ROLES.AUTHENTICATED)).toBe(true);
  });
  it("returns false for invalid values", () => {
    expect(isRole("hacker")).toBe(false);
    expect(isRole(123)).toBe(false);
    expect(isRole(null)).toBe(false);
    expect(isRole(undefined)).toBe(false);
    expect(isRole("")).toBe(false);
  });
});

describe("getUserRole", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns null when no user is logged in", async () => {
    mockClient({
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: null }, error: null }),
      },
    });

    const role = await getUserRole();
    expect(role).toBeNull();
  });

  it("returns role from user_metadata when present", async () => {
    mockClient({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { user_metadata: { role: ROLES.EMPLOYER_OWNER } } },
          error: null,
        }),
      },
    });

    const role = await getUserRole();
    expect(role).toBe(ROLES.EMPLOYER_OWNER);
  });

  it("returns AUTHENTICATED when user has no role in metadata", async () => {
    mockClient({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { user_metadata: {} } },
          error: null,
        }),
      },
    });

    const role = await getUserRole();
    expect(role).toBe(ROLES.AUTHENTICATED);
  });

  it("returns null on unexpected error", async () => {
    mockCreateClient.mockRejectedValue(new Error("Supabase down"));

    const role = await getUserRole();
    expect(role).toBeNull();
  });

  it("respects MOCK_AUTH_ROLE when MOCK_AUTH_ENABLED is true in development", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV =
      "development";
    process.env.MOCK_AUTH_ENABLED = "true";
    process.env.MOCK_AUTH_ROLE = ROLES.ADMIN_SUPER;

    const role = await getUserRole();
    expect(role).toBe(ROLES.ADMIN_SUPER);
  });

  it("ignores MOCK_AUTH_ROLE when MOCK_AUTH_ENABLED is not true", async () => {
    (process.env as Record<string, string | undefined>).NODE_ENV =
      "development";
    process.env.MOCK_AUTH_ENABLED = "false";
    process.env.MOCK_AUTH_ROLE = ROLES.ADMIN_SUPER;

    mockClient({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { user_metadata: { role: ROLES.JOB_SEEKER } } },
          error: null,
        }),
      },
    });

    const role = await getUserRole();
    expect(role).toBe(ROLES.JOB_SEEKER);
  });
});

describe("getUser", () => {
  it("returns the user object", async () => {
    const user = { id: "u1", email: "test@example.com" };
    mockClient({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }),
      },
    });

    const result = await getUser();
    expect(result).toEqual(user);
  });

  it("returns null on error", async () => {
    mockCreateClient.mockRejectedValue(new Error("boom"));
    const result = await getUser();
    expect(result).toBeNull();
  });
});
