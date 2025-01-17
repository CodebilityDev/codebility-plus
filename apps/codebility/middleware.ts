import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import pathsConfig from "./config/paths.config";
import { getCachedUser } from "./lib/server/supabase-server-comp";

//ROUTE PROTECTION: Define which routes should be protected by middleware
export const config = {
  matcher: [
    "/((?!api|auth/signin|auth/signup|privacy-policy|terms|auth/forgot-password|codevs|index|profiles|waiting|declined|thank-you|campaign|services|ai-integration|bookacall|_next/static|.*\\..*|_next/image|$).*)",
  ],
};

// Helper to check if route is public
const isPublicRoute = (pathname: string): boolean => {
  const publicRoutes = [
    "/api",
    "/auth",
    "/privacy-policy",
    "/terms",
    "/codevs",
    "/index",
    "/profiles",
    "/waiting",
    "/declined",
    "/thank-you",
    "/campaign",
    "/services",
    "/ai-integration",
    "/bookacall",
  ];

  return publicRoutes.some((route) => pathname.startsWith(route));
};

// Helper to identify authentication errors
const isAuthError = (error: any): boolean => {
  return (
    error?.message?.includes("refresh_token_not_found") ||
    error?.message?.includes("invalid_token")
  );
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Check public routes first to avoid unnecessary auth checks
  if (isPublicRoute(req.nextUrl.pathname)) {
    return res;
  }

  try {
    const supabase = getSupabaseServerComponentClient();
    const user = await getCachedUser();

    //AUTHENTICATION CHECK: Redirect to login if not authenticated
    if (!user && !req.nextUrl.pathname.startsWith("/authv2")) {
      const url = req.nextUrl.clone();
      url.pathname = "/authv2/sign-in";
      return NextResponse.redirect(url);
    }

    if (!user) return res;

    //FETCH USER DATA: Get user's application status and permissions
    const { data: codev } = await supabase
      .from("codev")
      .select("application_status, user(*, user_type(*))")
      .eq("user_id", user.id)
      .single();

    if (!codev) return res;

    //APPLICATION STATUS HANDLING: Manage routing based on application status
    if (
      codev.application_status === "PENDING" &&
      req.nextUrl.pathname !== "/home/account-settings"
    ) {
      const url = req.nextUrl.clone();
      url.pathname = "/waiting";
      return NextResponse.redirect(url);
    }

    if (
      codev.application_status === "DECLINED" &&
      req.nextUrl.pathname !== "/home/account-settings"
    ) {
      const url = req.nextUrl.clone();
      url.pathname = "/declined";
      return NextResponse.redirect(url);
    }

    //CHECK PERMISSIONS: Verify user has access to requested route
    const hasPermission = await checkPermissions(user.id, req.nextUrl.pathname);

    //PERMISSION-BASED REDIRECT: Handle unauthorized access attempts
    if (codev.application_status === "ACCEPTED" && !hasPermission) {
      const url = req.nextUrl.clone();
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    // Handle authentication errors gracefully
    if (isAuthError(error) && !req.nextUrl.pathname.startsWith("/authv2")) {
      const url = req.nextUrl.clone();
      url.pathname = "/authv2/sign-in";
      return NextResponse.redirect(url);
    }
  }

  return res;
}

//PERMISSION CHECKING: Validate user's access rights for specific routes
const checkPermissions = async (userId: string, path: string) => {
  const supabase = getSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("user")
    .select("*, user_type(*)")
    .eq("id", userId)
    .single();

  if (error || !data) return false;

  const permissions = data.user_type;

  // Special handling for dashboard access
  if (path === pathsConfig.app.home) {
    return permissions.dashboard === true;
  }

  const pathSegments = path.split("/");
  let lastSegment: string | undefined;

  // Handle nested routes (e.g., settings pages)
  if (
    pathSegments.length === 4 &&
    pathSegments[1] === "home" &&
    pathSegments[2] === "settings"
  ) {
    lastSegment = pathSegments[3];
  } else {
    lastSegment = pathSegments[2];
  }

  // Map URL-friendly paths to permission keys
  const segmentMap: { [key: string]: string } = {
    "in-house": "in_house",
    "time-tracker": "time_tracker",
    "account-settings": "account_settings",
  };

  // Ensure `lastSegment` is defined
  if (lastSegment) {
    lastSegment = segmentMap[lastSegment] || lastSegment;

    // Check if user has permission for the requested route
    if (lastSegment in permissions) {
      return permissions[lastSegment] === true;
    }
  }

  return false;
};
