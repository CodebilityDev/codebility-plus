import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

export const config = {
  matcher: [
    "/((?!api|auth/signin|auth/signup|auth/verify|/auth/password-reset|waiting|declined|privacy-policy|terms|auth/forgot-password|codevs|index|profiles|thank-you|campaign|services|ai-integration|bookacall|_next/static|.*\\..*|_next/image|$).*)",
  ],
};

const PUBLIC_ROUTES = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/verify",
  "/auth/waiting",
  "/auth/declined",
  "/privacy-policy",
  "/terms",
  "/auth/password-reset",
  "/", // Other public pages
] as const;

// Map route prefixes to the required permission key.
const routePermissionMap: Record<string, keyof RolePermissions> = {
  "/home/interns": "interns",
  "/home/orgchart": "orgchart",
  "/home/applicants": "applicants",
  "/home/in-house": "inhouse",
  "/home/clients": "clients",
  "/home/projects": "projects",
  "/home/settings/permissions": "permissions",
  "/home/settings/roles": "roles",
  "/home/settings/profile": "resume",
  // General fallback: if no more specific key matches, use this one.
  "/home/settings": "settings",
};

type RolePermissions = {
  dashboard: boolean;
  kanban: boolean;
  time_tracker: boolean;
  interns: boolean;
  applicants: boolean;
  inhouse: boolean;
  clients: boolean;
  projects: boolean;
  settings: boolean;
  orgchart: boolean;
  resume?: boolean;
  permissions?: boolean;
  roles?: boolean;
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const supabase = getSupabaseServerComponentClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return redirectToLogin(req);
  }

  const userId = user.id;
  const { data: userData, error: userError } = await supabase
    .from("codev")
    .select("id, application_status, role_id")
    .eq("id", userId)
    .single();

  if (userError || !userData) {
    console.error("Failed to fetch user data:", userError);
    return redirectToLogin(req);
  }

  const { application_status, role_id } = userData;

  if (
    application_status === "passed" &&
    [
      "/auth/declined",
      "/auth/waiting",
      "/auth/verify",
      "/auth/sign-in",
      "/auth/sign-up",
    ].includes(pathname)
  ) {
    return redirectTo(req, "/codevs");
  }
  if (
    application_status === "failed" &&
    ["/home", "/auth/waiting", "/auth/verify"].includes(pathname)
  ) {
    return redirectTo(req, "/auth/declined");
  }
  if (
    application_status === "applying" &&
    ["/home", "/auth/declined", "/auth/verify"].includes(pathname)
  ) {
    return redirectTo(req, "/auth/waiting");
  }

  // Sort keys by descending length to get the most specific match first.
  const sortedRouteKeys = Object.keys(routePermissionMap).sort(
    (a, b) => b.length - a.length,
  );
  const matchedRoute = sortedRouteKeys.find((routePrefix) =>
    pathname.startsWith(routePrefix),
  );

  if (matchedRoute && role_id) {
    const key = matchedRoute as keyof typeof routePermissionMap;
    const requiredPermission = routePermissionMap[key]!; // non-null assertion

    const { data: rolePermissions, error: roleError } = await supabase
      .from("roles")
      .select(
        "dashboard, kanban, time_tracker, interns, applicants, inhouse, clients, projects, settings, orgchart, roles, permissions, resume",
      )
      .eq("id", role_id)
      .single();

    if (roleError || !rolePermissions) {
      console.error("Failed to fetch role permissions:", roleError);
      return redirectToLogin(req);
    }

    if (!rolePermissions[requiredPermission]) {
      console.log(
        `[DEBUG] User with role ${role_id} does not have permission "${requiredPermission}" for ${pathname}. Redirecting.`,
      );
      return redirectTo(req, "/home");
    }
  }

  console.log("[DEBUG] User has permission to access:", pathname);
  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  const redirectUrl = new URL("/auth/sign-in", req.url);
  redirectUrl.searchParams.set("from", req.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

function redirectTo(req: NextRequest, path: string) {
  const redirectUrl = new URL(path, req.url);
  return NextResponse.redirect(redirectUrl);
}
