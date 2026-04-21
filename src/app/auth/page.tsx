"use client";

import { Suspense } from "react";
import { AuthPageTemplate } from "@/design-system/templates/AuthPageTemplate";
import { AuthForm } from "@/design-system/organisms/AuthForm";
import { AuthSidebar } from "@/design-system/organisms/AuthSidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode =
    (searchParams.get("mode") as "signin" | "signup") ?? "signin";
  const initialRole =
    (searchParams.get("as") as "seeker" | "employer") ?? "seeker";

  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);

  const handleModeChange = useCallback(
    (newMode: "signin" | "signup" | "reset" | "otp") => {
      setMode(newMode as "signin" | "signup");
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

  const handleSocialSignIn = useCallback((provider: "google" | "linkedin") => {
    console.log("Social sign-in:", provider);
    // TODO: Implement OAuth flow
  }, []);

  const handleSubmit = useCallback(
    (data: {
      email: string;
      password: string;
      fullName?: string;
      role?: "seeker" | "employer";
      otp?: string;
    }) => {
      setLoading(true);

      console.log("Auth submit:", { mode, ...data });
      // TODO: Implement auth API call
      setTimeout(() => setLoading(false), 1500);
    },
    [mode],
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
