import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { config } from "../config";
import { getPortalForRole, isRole } from "../rbac";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pendingCookies: Array<{
    name: string;
    value: string;
    options: Parameters<typeof supabaseResponse.cookies.set>[2];
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
            pendingCookies.push({ name, value, options });
          });
        },
      },
    },
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake can make it very hard to debug
  // issues with users being randomly logged out.

  let user = null;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (err) {
    // Fail CLOSED (C-2 fix): if Supabase throws an unexpected error we
    // cannot vouch for the session, so redirect to the auth page with a
    // dedicated error code instead of leaving the user on a protected page.
    console.error(
      "[session] unexpected auth error:",
      err instanceof Error ? err.message : String(err),
    );
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth";
    redirectUrl.search = "";
    redirectUrl.searchParams.set("error", "SESSION_ERROR");
    return NextResponse.redirect(redirectUrl);
  }

  const pathname = request.nextUrl.pathname;
  const isAuthPage =
    pathname.startsWith("/auth") || pathname.startsWith("/onboarding");

  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/jobs") ||
    pathname.startsWith("/for-employers") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/help") ||
    pathname.startsWith("/legal") ||
    pathname.startsWith("/_next");

  if (
    user &&
    isAuthPage &&
    !pathname.startsWith("/onboarding") &&
    !request.nextUrl.searchParams.has("error")
  ) {
    // Authenticated users shouldn't see auth pages. Narrow the untrusted JWT
    // claim via isRole() instead of trusting user_metadata.role as-is
    // (H-type regression fix).
    const rawRole = user.user_metadata?.role;
    const role = isRole(rawRole) ? rawRole : null;
    if (!role) {
      // Role-less users need onboarding
      const redirectResponse = NextResponse.redirect(
        new URL("/onboarding", request.url),
      );
      pendingCookies.forEach(({ name, value, options }) => {
        redirectResponse.cookies.set(name, value, options);
      });
      return redirectResponse;
    }

    const redirectResponse = NextResponse.redirect(
      new URL(getPortalForRole(role), request.url),
    );
    pendingCookies.forEach(({ name, value, options }) => {
      redirectResponse.cookies.set(name, value, options);
    });
    return redirectResponse;
  }

  if (!user && !isAuthPage && !isPublicPath) {
    // This is a protected route but no user is logged in.
    // We redirect to auth with a returnUrl.
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("mode", "signin");
    url.searchParams.set(
      "returnUrl",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
