import React from "react";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { canAccessPortal } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getUserRole();

  if (!role) {
    redirect("/auth?mode=signin");
  }

  if (!canAccessPortal([role], "JOB_SEEKER_PORTAL")) {
    redirect("/auth?error=unauthorized");
  }

  return <>{children}</>;
}
