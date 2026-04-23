import { Suspense } from "react";
import { AuthPageTemplate } from "@/design-system/templates/AuthPageTemplate";
import { AuthSidebar } from "@/design-system/organisms/AuthSidebar";
import {
  AUTH_ERROR_CODES,
  authErrorMessage,
  type AuthErrorCode,
} from "@/lib/auth-errors";
import { AuthFormClient } from "./AuthFormClient";

function parseAuthMode(
  value: string | null,
): "signin" | "signup" | "reset" | "otp" {
  if (
    value === "signin" ||
    value === "signup" ||
    value === "reset" ||
    value === "otp"
  ) {
    return value;
  }
  return "signin";
}

function parseAuthRole(value: string | null): "seeker" | "employer" {
  if (value === "employer") return "employer";
  return "seeker";
}

/**
 * Translates a `?error=...` query param into a user-facing message. Accepts
 * discriminated `AuthErrorCode` values (matched case-insensitively). Unknown
 * codes return `null` so the page renders without a spurious error banner.
 */
function getInitialError(paramError: string | null): string | null {
  if (!paramError) return null;
  const normalized = paramError.toUpperCase() as AuthErrorCode;
  const allCodes = new Set<string>(Object.values(AUTH_ERROR_CODES));
  if (allCodes.has(normalized)) {
    return authErrorMessage(normalized);
  }
  return null;
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const mode = parseAuthMode(
    typeof params.mode === "string" ? params.mode : null,
  );
  const role = parseAuthRole(typeof params.as === "string" ? params.as : null);
  const returnUrl =
    typeof params.returnUrl === "string" ? params.returnUrl : undefined;
  const error = getInitialError(
    typeof params.error === "string" ? params.error : null,
  );

  return (
    <AuthPageTemplate sidebar={<AuthSidebar />}>
      <Suspense
        fallback={
          <div
            className="min-h-screen bg-bg flex items-center justify-center"
            role="status"
            aria-live="polite"
          >
            <span className="sr-only">Loading authentication…</span>
          </div>
        }
      >
        <AuthFormClient
          initialMode={mode}
          initialRole={role}
          initialError={error}
          returnUrl={returnUrl}
        />
      </Suspense>
    </AuthPageTemplate>
  );
}
