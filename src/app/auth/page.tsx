"use client";

import { Suspense } from "react";
import { AuthPageTemplate } from "@/design-system/templates/AuthPageTemplate";
import { AuthForm, AuthMode } from "@/design-system/organisms/AuthForm";
import { AuthSidebar } from "@/design-system/organisms/AuthSidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import {
  login,
  signup,
  signInWithGoogle,
  requestPasswordReset,
} from "@/app/auth/actions";

function mapAuthError(raw: string): string {
  if (raw.includes("Invalid login credentials"))
    return "Email or password is incorrect.";
  if (raw.includes("Email not confirmed"))
    return "Please confirm your email before signing in.";
  if (raw.includes("User already registered"))
    return "An account with this email already exists.";
  return "Something went wrong. Please try again.";
}

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode =
    (searchParams.get("mode") as "signin" | "signup") ?? "signin";
  const initialRole =
    (searchParams.get("as") as "seeker" | "employer") ?? "seeker";

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    const paramError = searchParams.get("error");
    if (paramError === "unauthorized") {
      return "You don't have permission to access that section.";
    } else if (paramError === "oauth_callback_failed") {
      return "Sign-in failed. Please try again.";
    }
    return null;
  });
  const [resetSent, setResetSent] = useState(false);

  const handleModeChange = useCallback(
    (newMode: AuthMode) => {
      setMode(newMode);
      setError(null);
      setResetSent(false);
      const params = new URLSearchParams(searchParams.toString());
      params.set("mode", newMode);
      router.replace(`/auth?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleRoleChange = useCallback(
    (newRole: "seeker" | "employer") => {
      setRole(newRole);
      const params = new URLSearchParams(searchParams.toString());
      params.set("as", newRole);
      router.replace(`/auth?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleSocialSignIn = useCallback(
    async (provider: "google" | "linkedin") => {
      if (provider === "linkedin") {
        setError("LinkedIn sign-in is coming soon.");
        return;
      }
      setError(null);
      setLoading(true);
      const onboardingRole = role === "employer" ? "employer" : "job_seeker";
      const returnUrl = searchParams.get("returnUrl") ?? undefined;
      const result = await signInWithGoogle({ onboardingRole, returnUrl });
      if (result?.error) {
        setError(mapAuthError(result.error));
      }
      setLoading(false);
    },
    [role, searchParams],
  );

  const handleSubmit = useCallback(
    async (data: {
      email: string;
      password: string;
      fullName?: string;
      role?: "seeker" | "employer";
      otp?: string;
    }) => {
      setLoading(true);
      setError(null);
      setResetSent(false);

      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (data.fullName) formData.append("fullName", data.fullName);
      if (data.role)
        formData.append(
          "role",
          data.role === "employer" ? "employer_owner" : "job_seeker",
        );
      formData.append("returnUrl", searchParams.get("returnUrl") ?? "");

      if (mode === "signin") {
        const result = await login(formData);
        if (result?.error) {
          setError(mapAuthError(result.error));
          setLoading(false);
        }
        // On success, login redirects — no further code needed
      } else if (mode === "signup") {
        const result = await signup(formData);
        if (result?.error) {
          setError(mapAuthError(result.error));
          setLoading(false);
        } else if (result?.success) {
          setLoading(false);
          setError("Check your email to confirm your account.");
        }
      } else if (mode === "reset") {
        const result = await requestPasswordReset(formData);
        if (result?.error) {
          setError(mapAuthError(result.error));
          setLoading(false);
        } else {
          setResetSent(true);
          setLoading(false);
        }
      } else if (mode === "otp") {
        setError("OTP sign-in is coming soon.");
        setLoading(false);
      }
    },
    [mode, searchParams],
  );

  return (
    <AuthPageTemplate sidebar={<AuthSidebar />}>
      <AuthForm
        mode={mode}
        onModeChange={handleModeChange}
        onSocialSignIn={handleSocialSignIn}
        onSubmit={handleSubmit}
        role={role}
        onRoleChange={handleRoleChange}
        loading={loading}
        error={error}
        resetSent={resetSent}
      />
    </AuthPageTemplate>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <AuthPageContent />
    </Suspense>
  );
}
