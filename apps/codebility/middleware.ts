import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { User } from "@supabase/supabase-js"; // Import User type

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

export const config = {
  matcher: [
    "/((?!api|auth/signin|auth/signup|auth/verify|waiting|declined|privacy-policy|terms|auth/forgot-password|codevs|index|profiles|thank-you|campaign|services|ai-integration|bookacall|_next/static|.*\\..*|_next/image|$).*)",
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
  "/",
] as const;

const VERIFICATION_ROUTES = ["/auth/waiting", "/auth/verify"] as const;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  try {
    const supabase = getSupabaseServerComponentClient();

    // Check authentication
    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session?.user) {
      return redirectToLogin(req);
    }

    // Get user metadata to check email confirmation
    const {
      data: { user: userData },
      error: userMetaError,
    } = await supabase.auth.admin.getUserById(session.user.id);

    if (userMetaError || !userData) {
      return redirectToLogin(req);
    }

    // Get user data with role
    const { data: codevData, error: userError } = await supabase
      .from("codev")
      .select(
        `
        id,
        application_status,
        role_id,
        roles (
          id,
          name,
          dashboard,
          kanban,
          time_tracker,
          interns,
          applicants,
          inhouse,
          clients,
          projects,
          roles,
          permissions,
          services,
          resume,
          settings,
          orgchart
        )
      `,
      )
      .eq("id", session.user.id)
      .single();

    if (userError || !codevData) {
      return redirectToLogin(req);
    }

    // Check email verification using confirmed_at
    if (!userData.confirmed_at && !VERIFICATION_ROUTES.includes(pathname)) {
      return redirectTo(req, "/auth/verify");
    }

    // Handle application status
    if (
      codevData.application_status === "applying" &&
      !VERIFICATION_ROUTES.includes(pathname)
    ) {
      return redirectTo(req, "/auth/waiting");
    }

    // If we're on a verification route, allow access
    if (VERIFICATION_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

    // Check role-based permissions
    const hasPermission = checkPermission(pathname, codevData.roles);
    if (!hasPermission) {
      return redirectTo(req, "/");
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return redirectToLogin(req);
  }
}

function checkPermission(pathname: string, roles: any): boolean {
  const routePermissions: Record<string, keyof typeof roles> = {
    "/dashboard": "dashboard",
    "/kanban": "kanban",
    "/time-tracker": "time_tracker",
    "/interns": "interns",
    "/applicants": "applicants",
    "/inhouse": "inhouse",
    "/clients": "clients",
    "/projects": "projects",
    "/roles": "roles",
    "/settings": "settings",
    "/orgchart": "orgchart",
  };

  const baseRoute = "/" + pathname.split("/")[1];

  if (!routePermissions[baseRoute]) {
    return true;
  }

  const requiredPermission = routePermissions[baseRoute];
  return roles[requiredPermission] === true;
}

function redirectToLogin(req: NextRequest) {
  const redirectUrl = new URL("/auth/sign-in", req.url);
  redirectUrl.searchParams.set("from", req.nextUrl.pathname);
  return NextResponse.redirect(redirectUrl);
}

function redirectTo(req: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, req.url));
}
