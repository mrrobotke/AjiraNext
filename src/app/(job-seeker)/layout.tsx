import React from "react";
import { guardPortal } from "@/lib/portal-guard";

export const dynamic = "force-dynamic";

export default async function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardPortal("JOB_SEEKER_PORTAL");
  return <>{children}</>;
}
