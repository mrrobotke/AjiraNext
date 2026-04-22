import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config";
import { parseOnboardingRole, syncOnboardingRole } from "@/lib/onboarding";
import { getPortalForRole, type Role } from "@/lib/rbac";
import { validateRedirectUrl } from "@/lib/url";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const onboardingRole = parseOnboardingRole(
    searchParams.get("onboarding_role"),
  );
  const rawNext = searchParams.get("next") ?? "/";
  const next = validateRedirectUrl(rawNext) ?? "/";

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
      let role = data.user?.user_metadata?.role as Role | undefined;

      if (session) {
        // `exchangeCodeForSession()` persists the session immediately, but the
        // auth-state notification that flushes cookies from `createServerClient`
        // is scheduled asynchronously. Refreshing the session here forces an
        // awaited cookie write before we redirect to a protected route.
        const { data: refreshData, error: refreshError } =
          await supabase.auth.refreshSession();
        if (!refreshError && refreshData.session) {
          session = refreshData.session;
          role = refreshData.session.user?.user_metadata?.role as
            | Role
            | undefined;
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
              role = refreshData.session?.user?.user_metadata?.role as
                | Role
                | undefined;
            }
          }
        } catch {
          // If onboarding sync is temporarily unavailable, fall back to the
          // role-selection page instead of failing the OAuth callback.
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

  return NextResponse.redirect(`${origin}/auth?error=oauth_callback_failed`);
}
