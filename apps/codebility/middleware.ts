import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

export const config = {
  matcher: ["/((?!api|_next/static|.*\\..*|_next/image|favicon.ico).*)"],
};

const PUBLIC_ROUTES = [
  "/privacy-policy",
  "/standalone",
  "/terms",
  "/auth/password-reset",
  "/codevs",
  "/bookacall",
  "/services",
  "/",

  "/nda-signing/public",

  "/auth/callback",

] as const;

// Routes that should be public with wildcard support (e.g., /profiles/*)
const PUBLIC_ROUTE_PREFIXES = ["/profiles/", "/nda-signing/"] as const;

const AUTH_ROUTES = ["/auth/sign-in", "/auth/sign-up", "/auth/onboarding"] as const;

// Authentication status routes
const EMAIL_VERIFICATION_ROUTE = "/auth/verify";
const WAITING_APPROVAL_ROUTE = "/auth/waiting";
const APPLICATION_DECLINED_ROUTE = "/auth/declined";
const APPLICANT_ROUTE = "/applicant"

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

    // 1. Check if the route is public - allow access without any auth checks
    if (PUBLIC_ROUTES.includes(pathname as any)) {
      return NextResponse.next();
    }

    // Check for wildcard public routes (e.g., /profiles/*)
    const isPublicPrefix = PUBLIC_ROUTE_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix),
    );

    if (isPublicPrefix) {
      return NextResponse.next();
    }

    // 2. Special handling for auth routes
    if (AUTH_ROUTES.includes(pathname as any)) {
      // We need to check if user is logged in, but handle "no token" gracefully
      const supabase = getSupabaseServerComponentClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      // If error is related to missing refresh token, ignore it for auth routes
      if (user) {
        // Redirect to home if user is already logged in
        return redirectTo(req, "/home");
      }

      // Allow access to auth pages if not logged in, regardless of error
      return NextResponse.next();
    }

    // From this point on, we need authenticated users
    const supabase = getSupabaseServerComponentClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Handle email verification route separately
    if (pathname === EMAIL_VERIFICATION_ROUTE) {
      // Allow access to verification page regardless of auth status
      return NextResponse.next();
    }

    // Handle non-authenticated users for protected routes
    if (authError || !user) {
      return redirectToLogin(req);
    }

    // Check if email is verified
    const {
      data: { user: authUser },
      error: verificationError,
    } = await supabase.auth.getUser();

    if (
      !authUser?.email_confirmed_at &&
      pathname !== EMAIL_VERIFICATION_ROUTE
    ) {
      // If email not verified, redirect to verification page
      return redirectTo(req, EMAIL_VERIFICATION_ROUTE);
    }

    // 3. Fetch user data now that we know the user is authenticated
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

    // 4. Handle application status redirects
    if (application_status === "passed") {
      // If user is approved, they shouldn't access application-related routes
      if (
        [
          WAITING_APPROVAL_ROUTE,
          APPLICATION_DECLINED_ROUTE,
          EMAIL_VERIFICATION_ROUTE,
          APPLICANT_ROUTE,
        ].includes(pathname)
      ) {
        return redirectTo(req, "/home");
      }
    } else if (application_status === "failed" || application_status === "denied") {
      // If application is rejected, only allow access to declined page
      if (pathname.includes(APPLICATION_DECLINED_ROUTE) || pathname.includes(APPLICANT_ROUTE)) {
        return NextResponse.next();
      } else {
        return redirectTo(req, APPLICATION_DECLINED_ROUTE);
      }
    } else if (
      application_status === "applying" ||
      application_status === "pending" ||
      application_status === "testing" ||
      application_status === "onboarding"
    ) {
      // If application is pending, only allow access to waiting page
      if (pathname.includes(WAITING_APPROVAL_ROUTE) || pathname.includes(APPLICANT_ROUTE)) {
        return NextResponse.next();
      } else {
        return redirectTo(req, WAITING_APPROVAL_ROUTE);
      }
    }

    // If we reach here, the user is approved and accessing a protected route

    // 5. Check role-based permissions for protected routes
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

    // All checks passed, allow access to the requested route
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
