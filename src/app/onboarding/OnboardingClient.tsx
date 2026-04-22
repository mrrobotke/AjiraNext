"use client";

import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { setOnboardingRole } from "@/app/auth/actions";
import { Button } from "@/design-system/atoms/Button";
import { Heading } from "@/design-system/atoms/Heading";
import { Icon } from "@/design-system/atoms/Icon";
import { Paragraph } from "@/design-system/atoms/Paragraph";
import type { OnboardingRole } from "@/lib/onboarding";

export default function OnboardingClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<OnboardingRole | null>(null);

  function handleRoleSelect(role: OnboardingRole) {
    setError(null);
    setSelectedRole(role);
    startTransition(async () => {
      const result = await setOnboardingRole(role);

      if (result?.error === "sync_failed") {
        setError(
          "Something went wrong syncing your account. Please try again.",
        );
      } else if (result?.error === "role_already_set") {
        setError("Your account role is already set. Redirecting...");
        router.refresh();
      } else if (result?.error === "not_authenticated") {
        router.push("/auth?mode=signin");
      } else if (result?.error) {
        setError("Failed to set up your account. Please try again.");
      }

      setSelectedRole(null);
    });
  }

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
            className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-left transition-colors hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-50 ${
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
            className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-left transition-colors hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-50 ${
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

        {error && (
          <div role="alert" aria-live="assertive" className="mt-6">
            <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-danger text-sm font-bold">
              {error}
            </div>
            {error.includes("try again") && (
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
