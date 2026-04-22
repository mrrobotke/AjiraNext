import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { config } from "../config";
import { getPortalForRole } from "../rbac";

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

  let user = null;
  try {
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    user = u;
  } catch {
    // Fail open — let route-level guards handle auth.
    return supabaseResponse;
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

  if (user && isAuthPage && !pathname.startsWith("/onboarding")) {
    // Don't redirect away if the user is viewing an unauthorized error
    if (request.nextUrl.searchParams.get("error") === "unauthorized") {
      return supabaseResponse;
    }

    const role = user.user_metadata?.role;
    const destination = role ? getPortalForRole(role) : "/onboarding";

    const redirectResponse = NextResponse.redirect(
      new URL(destination, request.url),
    );
    pendingCookies.forEach(({ name, value, options }) => {
      redirectResponse.cookies.set(name, value, options);
    });
    return redirectResponse;
  }

  if (!user && !isAuthPage && !isPublicPath) {
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
