import React from "react";
import { guardPortal } from "@/lib/portal-guard";

export const dynamic = "force-dynamic";

export default async function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardPortal("EMPLOYER_PORTAL");
  return <>{children}</>;
}
