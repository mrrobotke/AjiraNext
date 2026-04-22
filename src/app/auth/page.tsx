import { Suspense } from "react";
import { AuthPageTemplate } from "@/design-system/templates/AuthPageTemplate";
import { AuthSidebar } from "@/design-system/organisms/AuthSidebar";
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

function getInitialError(paramError: string | null): string | null {
  if (paramError === "unauthorized") {
    return "You don't have permission to access that section.";
  }
  if (paramError === "oauth_callback_failed") {
    return "Sign-in failed. Please try again.";
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
