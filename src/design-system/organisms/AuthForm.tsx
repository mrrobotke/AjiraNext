"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/design-system/atoms/Button";
import { Eyebrow } from "@/design-system/atoms/Eyebrow";
import { FormField } from "@/design-system/molecules/FormField";
import { Heading } from "@/design-system/atoms/Heading";
import { Paragraph } from "@/design-system/atoms/Paragraph";
import { TextInput } from "@/design-system/atoms/TextInput";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type AuthMode = "signin" | "signup" | "reset" | "otp";
export type AuthRole = "seeker" | "employer";

/**
 * Stable DOM id for the form-level error element. Exported so tests (and any
 * server-rendered aria wiring) can reference the exact same identifier the
 * inputs' `aria-describedby` points at.
 */
export const AUTH_FORM_ERROR_ID = "auth-form-error";

export interface AuthFormProps {
  mode?: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
  onSocialSignIn?: (provider: "google" | "linkedin") => void;
  onSubmit?: (data: {
    email: string;
    password: string;
    fullName?: string;
    role?: AuthRole;
    otp?: string;
  }) => void;
  role?: AuthRole;
  onRoleChange?: (role: AuthRole) => void;
  loading?: boolean;
  error?: string | null;
  resetSent?: boolean;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Social buttons                                                     */
/* ------------------------------------------------------------------ */

const SocialButton: React.FC<{
  provider: "google" | "linkedin";
  onClick?: () => void;
  disabled?: boolean;
}> = ({ provider, onClick, disabled }) => {
  const isGoogle = provider === "google";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center justify-center gap-2.5 w-full",
        "px-4 py-2.5 rounded-xl border border-border bg-card",
        "text-sm font-bold text-fg",
        "hover:border-primary transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      {isGoogle ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.583-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
            fill="#34A853"
          />
          <path
            d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.165.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.823.957 4.042l3.007-2.332z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
            fill="#EA4335"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M16.65 0H1.35C.607 0 0 .6 0 1.34v15.32C0 17.4.607 18 1.35 18h15.3c.743 0 1.35-.6 1.35-1.34V1.34C18 .6 17.393 0 16.65 0z"
            fill="#0A66C2"
          />
          <path
            d="M5.27 6.86H2.85v8.03h2.42V6.86zM4.06 5.78a1.4 1.4 0 110-2.8 1.4 1.4 0 010 2.8zM15.15 10.34c0-2.5-1.34-3.66-3.13-3.66-1.44 0-2.08.79-2.44 1.35V6.86H7.16c.03.71 0 8.03 0 8.03h2.42v-4.48c0-.22.02-.43.08-.59.17-.43.56-.88 1.22-.88.86 0 1.2.65 1.2 1.61v4.34h2.42l-.02-4.85c0-1.3-.23-2.3-1.43-2.3z"
            fill="#fff"
          />
        </svg>
      )}
      {isGoogle ? "Google" : "LinkedIn"}
    </button>
  );
};

/* ------------------------------------------------------------------ */
/*  Divider                                                            */
/* ------------------------------------------------------------------ */

const Divider: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-3.5 text-fg-muted text-2xs tracking-wide my-4">
    <span className="flex-1 h-px bg-border" />
    {text}
    <span className="flex-1 h-px bg-border" />
  </div>
);

/* ------------------------------------------------------------------ */
/*  Role picker                                                        */
/* ------------------------------------------------------------------ */

const RolePicker: React.FC<{
  role: AuthRole;
  onChange: (role: AuthRole) => void;
}> = ({ role, onChange }) => (
  <div className="grid grid-cols-2 gap-2.5 mb-3.5">
    <button
      type="button"
      onClick={() => onChange("seeker")}
      className={cn(
        "text-left p-4 rounded-xl border-2 transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        role === "seeker"
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40",
      )}
      aria-pressed={role === "seeker"}
    >
      <b className="block text-sm text-fg">Job Seeker</b>
      <small className="block text-2xs text-fg-muted mt-0.5">
        Find your next role
      </small>
    </button>
    <button
      type="button"
      onClick={() => onChange("employer")}
      className={cn(
        "text-left p-4 rounded-xl border-2 transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        role === "employer"
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40",
      )}
      aria-pressed={role === "employer"}
    >
      <b className="block text-sm text-fg">Employer</b>
      <small className="block text-2xs text-fg-muted mt-0.5">
        Post jobs & hire talent
      </small>
    </button>
  </div>
);

/* ------------------------------------------------------------------ */
/*  AuthForm organism                                                  */
/* ------------------------------------------------------------------ */

export const AuthForm: React.FC<AuthFormProps> = ({
  mode = "signin",
  onModeChange,
  onSocialSignIn,
  onSubmit,
  role = "seeker",
  onRoleChange,
  loading = false,
  error,
  resetSent = false,
  className,
}) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const idPrefix = React.useId();

  const handleMode = (newMode: AuthMode) => {
    onModeChange?.(newMode);
  };

  const handleRole = (newRole: AuthRole) => {
    onRoleChange?.(newRole);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ email, password, fullName, role, otp });
  };

  const isSignIn = mode === "signin";
  const isSignUp = mode === "signup";
  const isReset = mode === "reset";
  const isOtp = mode === "otp";

  const fullNameId = `${idPrefix}-fullName`;
  const emailId = `${idPrefix}-email`;
  const otpId = `${idPrefix}-otp`;
  const passwordId = `${idPrefix}-password`;

  return (
    <div
      className={cn(
        "flex flex-col justify-center px-8 py-12 lg:px-12 xl:px-16 max-w-lg mx-auto w-full",
        className,
      )}
    >
      {/* Mode tabs */}
      {!isReset && !isOtp && (
        <div className="inline-flex bg-surface rounded-full p-1 gap-0.5 mb-6 w-fit">
          <button
            type="button"
            onClick={() => handleMode("signin")}
            className={cn(
              "px-5 py-2.5 rounded-full text-xs font-bold transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              isSignIn
                ? "bg-card text-fg shadow-xs"
                : "text-fg-muted hover:text-fg",
            )}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleMode("signup")}
            className={cn(
              "px-5 py-2.5 rounded-full text-xs font-bold transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              isSignUp
                ? "bg-card text-fg shadow-xs"
                : "text-fg-muted hover:text-fg",
            )}
          >
            Sign Up
          </button>
        </div>
      )}

      {/* Headline */}
      {isReset ? (
        <>
          <Heading as="h1" size="4xl" weight="black" className="mb-2">
            Reset your password
          </Heading>
          <Paragraph muted className="mb-5">
            Enter your email and we&apos;ll send a reset link.
          </Paragraph>
        </>
      ) : isOtp ? (
        <>
          <Heading as="h1" size="4xl" weight="black" className="mb-2">
            Enter the code
          </Heading>
          <Paragraph muted className="mb-5">
            We sent a 6-digit code to your email.
          </Paragraph>
        </>
      ) : (
        <>
          <Eyebrow className="mb-3 inline-flex w-fit bg-card border border-border text-fg px-3.5 py-1.5 rounded-full">
            {isSignUp ? "Create account" : "Welcome back"}
          </Eyebrow>
          <Heading as="h1" size="4xl" weight="black" className="mb-2">
            {isSignUp ? "Sign up for Ajira Next" : "Sign in to Ajira Next"}
          </Heading>
        </>
      )}

      {/* Social login */}
      {!isReset && !isOtp && (
        <>
          <div className="grid grid-cols-2 gap-2.5">
            <SocialButton
              provider="google"
              onClick={() => onSocialSignIn?.("google")}
              disabled={loading}
            />
            <SocialButton
              provider="linkedin"
              onClick={() => onSocialSignIn?.("linkedin")}
              disabled={loading}
            />
          </div>
          <Divider text="or continue with email" />
        </>
      )}

      {/* Form */}
      {isReset && resetSent ? (
        <div className="bg-card border border-border rounded-2xl p-7 text-center">
          <div className="text-5xl text-primary mb-3">✓</div>
          <Heading as="h3" size="xl" weight="extrabold" className="mb-2">
            Check your inbox
          </Heading>
          <Paragraph size="sm" muted>
            We sent a link to the email you provided.
          </Paragraph>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && <RolePicker role={role} onChange={handleRole} />}

          {isSignUp && (
            <FormField label="Full name" inputId={fullNameId}>
              <TextInput
                id={fullNameId}
                required
                autoComplete="name"
                placeholder="Amina Okafor"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </FormField>
          )}

          <FormField label="Email" inputId={emailId}>
            <TextInput
              id={emailId}
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? AUTH_FORM_ERROR_ID : undefined}
            />
          </FormField>

          {isOtp && (
            <FormField label="6-digit code" inputId={otpId}>
              <TextInput
                id={otpId}
                required
                autoComplete="one-time-code"
                inputMode="numeric"
                placeholder="123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </FormField>
          )}

          {!isOtp && (
            <FormField label="Password" inputId={passwordId}>
              <TextInput
                id={passwordId}
                type="password"
                required
                autoComplete={isSignUp ? "new-password" : "current-password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? AUTH_FORM_ERROR_ID : undefined}
              />
            </FormField>
          )}

          {isSignIn && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => handleMode("reset")}
                className="text-xs font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg px-2 py-1 -mr-2"
              >
                Forgot password?
              </button>
            </div>
          )}

          {error && (
            <div
              id={AUTH_FORM_ERROR_ID}
              role="alert"
              aria-live="assertive"
              className="bg-danger/10 text-danger text-sm font-bold p-3 rounded-xl"
            >
              {error}
            </div>
          )}

          <Button type="submit" className="w-full mt-2" loading={loading}>
            {isSignUp
              ? "Create account"
              : isReset
                ? "Send reset link"
                : isOtp
                  ? "Verify"
                  : "Sign in"}
          </Button>
        </form>
      )}

      {isReset && (
        <button
          type="button"
          onClick={() => handleMode("signin")}
          className="mt-4 text-sm font-bold text-primary hover:underline text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          ← Back to sign in
        </button>
      )}

      {isOtp && (
        <button
          type="button"
          onClick={() => handleMode("signin")}
          className="mt-4 text-sm font-bold text-primary hover:underline text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          ← Back to sign in
        </button>
      )}
    </div>
  );
};

AuthForm.displayName = "AuthForm";
