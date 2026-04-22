import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { config } from "../config";
import { getPortalForRole } from "../rbac";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

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
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake can make it very hard to debug
  // issues with users being randomly logged out.

  let user = null;
  let authError = false;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch {
    // Fail open: if getUser throws, treat as unknown auth state
    authError = true;
  }

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/auth") ||
    request.nextUrl.pathname.startsWith("/onboarding");

  const isPublicPath =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/jobs") ||
    request.nextUrl.pathname.startsWith("/for-employers") ||
    request.nextUrl.pathname.startsWith("/pricing") ||
    request.nextUrl.pathname.startsWith("/about") ||
    request.nextUrl.pathname.startsWith("/contact") ||
    request.nextUrl.pathname.startsWith("/blog") ||
    request.nextUrl.pathname.startsWith("/help") ||
    request.nextUrl.pathname.startsWith("/legal") ||
    request.nextUrl.pathname.startsWith("/_next");

  if (
    user &&
    isAuthPage &&
    !request.nextUrl.pathname.startsWith("/onboarding") &&
    !request.nextUrl.searchParams.has("error")
  ) {
    // Authenticated users shouldn't see auth pages
    const role = user.user_metadata?.role;
    if (!role) {
      // Role-less users need onboarding
      const redirectResponse = NextResponse.redirect(
        new URL("/onboarding", request.url),
      );
      supabaseResponse.cookies.getAll().forEach(({ name, value, ...opts }) => {
        redirectResponse.cookies.set(name, value, opts);
      });
      return redirectResponse;
    }
    const redirectResponse = NextResponse.redirect(
      new URL(getPortalForRole(role), request.url),
    );
    supabaseResponse.cookies.getAll().forEach(({ name, value, ...opts }) => {
      redirectResponse.cookies.set(name, value, opts);
    });
    return redirectResponse;
  }

  if (!authError && !user && !isAuthPage && !isPublicPath) {
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

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse;
}
