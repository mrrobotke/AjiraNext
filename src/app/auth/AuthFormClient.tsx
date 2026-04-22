"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { AuthForm, AuthMode } from "@/design-system/organisms/AuthForm";
import { mapAuthError } from "@/lib/auth-errors";
import {
  login,
  signup,
  signInWithGoogle,
  requestPasswordReset,
} from "./actions";

interface AuthFormClientProps {
  initialMode: AuthMode;
  initialRole: "seeker" | "employer";
  initialError: string | null;
  returnUrl?: string;
}

export function AuthFormClient({
  initialMode,
  initialRole,
  initialError,
  returnUrl,
}: AuthFormClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
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
      try {
        const onboardingRole = role === "employer" ? "employer" : "job_seeker";
        const result = await signInWithGoogle({
          onboardingRole,
          returnUrl: returnUrl ?? searchParams.get("returnUrl") ?? undefined,
        });
        if (result?.error) {
          setError(mapAuthError(result.error));
        }
      } catch {
        setError(mapAuthError(""));
      }
      setLoading(false);
    },
    [role, returnUrl, searchParams],
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
      formData.append(
        "returnUrl",
        returnUrl ?? searchParams.get("returnUrl") ?? "",
      );

      try {
        if (mode === "signin") {
          const result = await login(formData);
          if (result?.error) {
            setError(mapAuthError(result.error));
            setLoading(false);
          }
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
      } catch {
        setError(mapAuthError(""));
        setLoading(false);
      }
    },
    [mode, returnUrl, searchParams],
  );

  return (
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
  );
}
