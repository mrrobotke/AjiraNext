"use client";

import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { setOnboardingRole } from "@/app/auth/actions";
import { Button } from "@/design-system/atoms/Button";
import { Heading } from "@/design-system/atoms/Heading";
import { Icon } from "@/design-system/atoms/Icon";
import { Paragraph } from "@/design-system/atoms/Paragraph";
import { AUTH_ERROR_CODES, authErrorMessage } from "@/lib/auth-errors";
import type { OnboardingRole } from "@/lib/onboarding";

type Feedback = { tone: "info" | "danger"; message: string };

export default function OnboardingClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [selectedRole, setSelectedRole] = useState<OnboardingRole | null>(null);

  function handleRoleSelect(role: OnboardingRole) {
    setFeedback(null);
    setSelectedRole(role);
    startTransition(async () => {
      try {
        const result = await setOnboardingRole(role);

        // Happy path: the server action redirects, so nothing comes back.
        if (!result) {
          setSelectedRole(null);
          return;
        }

        if ("success" in result && result.success) {
          setSelectedRole(null);
          return;
        }

        if ("error" in result && result.error) {
          const code = result.error.code;
          if (code === AUTH_ERROR_CODES.ONBOARDING_CONFLICT) {
            // Role is already set server-side — surface an info toast and
            // replace the route with the portal path returned by the action.
            setFeedback({
              tone: "info",
              message: authErrorMessage(code),
            });
            if ("redirect" in result && typeof result.redirect === "string") {
              router.replace(result.redirect);
            } else {
              router.refresh();
            }
            return;
          }
          if (code === AUTH_ERROR_CODES.NOT_AUTHENTICATED) {
            router.push("/auth?mode=signin");
            return;
          }
          setFeedback({ tone: "danger", message: authErrorMessage(code) });
        }
      } catch (err) {
        // M-sf-2: the server action can throw on network failures that
        // aren't NEXT_REDIRECT (e.g. fetch abort). Log the cause and
        // surface a discriminated UNKNOWN so the user still sees a Retry.
        console.error(
          "[OnboardingClient] setOnboardingRole threw:",
          err instanceof Error ? err.message : String(err),
        );
        setFeedback({
          tone: "danger",
          message: authErrorMessage(AUTH_ERROR_CODES.UNKNOWN),
        });
      }
    });
  }

  const retryable =
    feedback?.tone === "danger" &&
    feedback?.message !== authErrorMessage(AUTH_ERROR_CODES.INVALID_ROLE);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <Heading as="h1" size="4xl" weight="black">
            Welcome to AjiraNext
          </Heading>
          <Paragraph size="lg" muted className="mt-2">
            Tell us how you want to use the platform
          </Paragraph>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleRoleSelect("job_seeker")}
            disabled={isPending}
            className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-left transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
              selectedRole === "job_seeker"
                ? "border-accent bg-accent/5"
                : "border-border"
            }`}
            aria-pressed={selectedRole === "job_seeker"}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Icon name="Briefcase" size={24} />
            </div>
            <div className="text-center">
              <Paragraph size="sm" className="font-bold text-fg">
                {isPending && selectedRole === "job_seeker"
                  ? "Setting up..."
                  : "Find a Job"}
              </Paragraph>
              <Paragraph size="sm" muted>
                Browse verified jobs and apply with AI tools
              </Paragraph>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("employer")}
            disabled={isPending}
            className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-left transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
              selectedRole === "employer"
                ? "border-accent bg-accent/5"
                : "border-border"
            }`}
            aria-pressed={selectedRole === "employer"}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Icon name="Building2" size={24} />
            </div>
            <div className="text-center">
              <Paragraph size="sm" className="font-bold text-fg">
                {isPending && selectedRole === "employer"
                  ? "Setting up..."
                  : "Hire Talent"}
              </Paragraph>
              <Paragraph size="sm" muted>
                Post jobs and connect with top African talent
              </Paragraph>
            </div>
          </button>
        </div>

        {/* Live region for loading state */}
        <p aria-live="polite" className="sr-only">
          {isPending ? "Setting up your account..." : ""}
        </p>

        {feedback && (
          <div
            role={feedback.tone === "info" ? "status" : "alert"}
            aria-live={feedback.tone === "info" ? "polite" : "assertive"}
            className="mt-6"
          >
            <div
              className={
                feedback.tone === "info"
                  ? "rounded-xl border border-accent/20 bg-accent/10 p-4 text-fg text-sm font-bold"
                  : "rounded-xl border border-danger/20 bg-danger/10 p-4 text-danger text-sm font-bold"
              }
            >
              {feedback.message}
            </div>
            {retryable && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => {
                  if (selectedRole) handleRoleSelect(selectedRole);
                }}
                disabled={isPending}
              >
                Retry
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
