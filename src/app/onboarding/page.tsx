import { redirect } from "next/navigation";
import OnboardingClient from "./OnboardingClient";
import { getPortalForRole, type Role } from "@/lib/rbac";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?mode=signin");
  }

  const role = user.user_metadata?.role as Role | undefined;
  if (role) {
    redirect(getPortalForRole(role));
  }

  return <OnboardingClient />;
}
