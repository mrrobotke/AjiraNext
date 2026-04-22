import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { PORTAL_ACCESS } from "@/lib/rbac";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getUserRole();

  if (!role || !PORTAL_ACCESS.ADMIN_PORTAL.includes(role as never)) {
    redirect("/auth?error=unauthorized");
  }

  return <>{children}</>;
}
