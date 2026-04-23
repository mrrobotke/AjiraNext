import React from "react";
import { guardPortal } from "@/lib/portal-guard";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardPortal("ADMIN_PORTAL");
  return <>{children}</>;
}
