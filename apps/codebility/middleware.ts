import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

export const config = {
  matcher: ["/((?!api|_next/static|.*\\..*|_next/image|favicon.ico).*)"],
};

const PUBLIC_ROUTES = [
  "/auth/verify",
  "/auth/waiting",
  "/auth/declined",
  "/privacy-policy",
  "/terms",
  "/auth/password-reset",
  "/codevs",
  "/",
] as const;

const AUTH_ROUTES = ["/auth/sign-in", "/auth/sign-up"] as const;

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
  try {
    const { pathname } = req.nextUrl;
    const supabase = getSupabaseServerComponentClient();

    // Check auth status
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Special handling for auth routes
    if (AUTH_ROUTES.includes(pathname as any)) {
      if (user) {
        // Redirect to home if user is already logged in
        return redirectTo(req, "/home");
      }
      // Allow access to auth pages if not logged in
      return NextResponse.next();
    }

    // Allow access to public routes
    if (PUBLIC_ROUTES.includes(pathname as any)) {
      return NextResponse.next();
    }

    // Handle non-authenticated users
    if (authError || !user) {
      // Store the original URL for later redirect
      return redirectToLogin(req);
    }

    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from("codev")
      .select("id, application_status, role_id")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      console.error("Failed to fetch user data:", userError);
      return redirectToLogin(req);
    }

    const { application_status, role_id } = userData;

    // Handle application status redirects
    if (application_status === "passed" && pathname.startsWith("/auth/")) {
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

    // Check route permissions
    const sortedRouteKeys = Object.keys(routePermissionMap).sort(
      (a, b) => b.length - a.length,
    );
    const matchedRoute = sortedRouteKeys.find((routePrefix) =>
      pathname.startsWith(routePrefix),
    );

    function isValidPermission(
      permission: unknown,
    ): permission is keyof RolePermissions {
      if (!permission || typeof permission !== "string") return false;
      const validPermissions: Array<keyof RolePermissions> = [
        "dashboard",
        "kanban",
        "time_tracker",
        "interns",
        "applicants",
        "inhouse",
        "clients",
        "projects",
        "settings",
        "orgchart",
        "resume",
        "permissions",
        "roles",
      ];
      return validPermissions.includes(permission as keyof RolePermissions);
    }

    if (matchedRoute && role_id) {
      const key = matchedRoute as keyof typeof routePermissionMap;
      const requiredPermission = routePermissionMap[key];

      if (!isValidPermission(requiredPermission)) {
        console.log(`Invalid permission mapping for route: ${pathname}`);
        return redirectTo(req, "/home");
      }

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
          `User with role ${role_id} does not have permission "${requiredPermission}" for ${pathname}`,
        );
        return redirectTo(req, "/home");
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return redirectToLogin(req);
  }
}

function redirectToLogin(req: NextRequest) {
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth/");
  const redirectUrl = new URL("/auth/sign-in", req.url);

  if (!isAuthPage) {
    const returnPath = req.nextUrl.pathname;
    if (returnPath !== "/auth/sign-in") {
      redirectUrl.searchParams.set("from", returnPath);
    }
  }

  return NextResponse.redirect(redirectUrl);
}

function redirectTo(req: NextRequest, path: string) {
  const redirectUrl = new URL(path, req.url);
  return NextResponse.redirect(redirectUrl);
}
