import { config } from "./config";
import { ROLES, type Role } from "./rbac";

export type OnboardingRole = "job_seeker" | "employer";

export function parseOnboardingRole(
  value: string | null | undefined,
): OnboardingRole | null {
  if (value === "job_seeker" || value === "employer") {
    return value;
  }

  return null;
}

export function getOnboardingRoleForSignup(role: Role): OnboardingRole {
  return role === ROLES.EMPLOYER_OWNER ? "employer" : "job_seeker";
}

export async function syncOnboardingRole(
  accessToken: string,
  role: OnboardingRole,
) {
  return fetch(`${config.apiUrl}/onboarding/role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ role }),
  });
}
