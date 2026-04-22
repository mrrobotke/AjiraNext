import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { canAccessPortal } from "@/lib/rbac";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getUserRole();

  if (!role || !canAccessPortal([role], "ADMIN_PORTAL")) {
    redirect("/auth?error=unauthorized");
  }

  return <>{children}</>;
}
