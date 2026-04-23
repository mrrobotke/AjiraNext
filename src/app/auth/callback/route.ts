import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { parseOnboardingRole, syncOnboardingRole } from "@/lib/onboarding";
import { getPortalForRole, isRole, type Role } from "@/lib/rbac";
import { resolveSafeRedirect } from "@/lib/url";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const providerError = searchParams.get("error");
  if (providerError) {
    return NextResponse.redirect(`${origin}/auth?error=OAUTH_DENIED`);
  }

  const code = searchParams.get("code");
  const onboardingRole = parseOnboardingRole(
    searchParams.get("onboarding_role"),
  );
  const rawNext = searchParams.get("next") ?? "/";
  const next = resolveSafeRedirect(rawNext, "/");

  if (code) {
    const pendingCookies: Array<{
      name: string;
      value: string;
      options: CookieOptions;
    }> = [];

    const supabase = createServerClient(
      config.supabase.url,
      config.supabase.anonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            pendingCookies.push(...cookiesToSet);
          },
        },
      },
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      let session = data.session;
      // Narrow the untrusted JWT claim via isRole() at every read site
      // rather than an unchecked `as Role | undefined` cast
      // (H-type regression fix).
      const rawInitialRole = data.user?.user_metadata?.role;
      let role: Role | null = isRole(rawInitialRole) ? rawInitialRole : null;

      if (session) {
        // `exchangeCodeForSession()` persists the session immediately, but the
        // auth-state notification that flushes cookies from `createServerClient`
        // is scheduled asynchronously. Refreshing the session here forces an
        // awaited cookie write before we redirect to a protected route.
        const { data: refreshData, error: refreshError } =
          await supabase.auth.refreshSession();
        if (!refreshError && refreshData.session) {
          session = refreshData.session;
          const rawRefreshRole = refreshData.session.user?.user_metadata?.role;
          role = isRole(rawRefreshRole) ? rawRefreshRole : null;
        }
      }

      if (!role && onboardingRole && session?.access_token) {
        try {
          const syncResponse = await syncOnboardingRole(
            session.access_token,
            onboardingRole,
          );

          if (syncResponse.ok || syncResponse.status === 409) {
            const { data: refreshData, error: refreshError } =
              await supabase.auth.refreshSession();
            if (!refreshError) {
              session = refreshData.session ?? session;
              const rawPostSyncRole =
                refreshData.session?.user?.user_metadata?.role;
              role = isRole(rawPostSyncRole) ? rawPostSyncRole : null;
            }
          }
        } catch (err) {
          // If onboarding sync is temporarily unavailable, fall back to the
          // role-selection page instead of failing the OAuth callback.
          // Log the cause so on-call has a trail (H-sf-2 fix).
          console.error(
            "[auth/callback] onboarding sync failed:",
            err instanceof Error ? err.message : String(err),
          );
        }
      }

      let destination: string;
      if (!role) {
        const onboardingUrl = new URL("/onboarding", origin);
        if (next !== "/") onboardingUrl.searchParams.set("next", next);
        destination = onboardingUrl.toString();
      } else {
        destination = `${origin}${next !== "/" ? next : getPortalForRole(role)}`;
      }

      const response = NextResponse.redirect(destination);
      pendingCookies.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=OAUTH_FAILED`);
}
