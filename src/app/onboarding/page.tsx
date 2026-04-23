import { redirect } from "next/navigation";
import OnboardingClient from "./OnboardingClient";
import { getPortalForRole, isRole } from "@/lib/rbac";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?mode=signin");
  }

  // Narrow the untrusted JWT claim via isRole() rather than an unchecked
  // `as Role | undefined` cast (H-type regression fix).
  const rawRole = user.user_metadata?.role;
  const role = isRole(rawRole) ? rawRole : null;
  if (role) {
    redirect(getPortalForRole(role));
  }

  return <OnboardingClient />;
}
