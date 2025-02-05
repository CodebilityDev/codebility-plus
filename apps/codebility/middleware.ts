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

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    console.log("[DEBUG] Public route accessed:", pathname);
    return NextResponse.next();
  }

  const supabase = getSupabaseServerComponentClient();

  // Check authentication using getUser
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    // Prevent redirect loops between sign-in and sign-up
    if (pathname === "/auth/sign-in" || pathname === "/auth/sign-up") {
      console.log(
        "[DEBUG] User is already on a public auth route. Allowing access.",
      );
      return NextResponse.next();
    }

    console.log("[DEBUG] User not authenticated. Redirecting to login.");
    return redirectToLogin(req);
  }

  const userId = user.id;

  // Fetch user data from the database
  const { data: userData, error: userError } = await supabase
    .from("codev")
    .select("id, application_status")
    .eq("id", userId)
    .single();

  if (userError || !userData) {
    console.log("[DEBUG] Failed to fetch user data. Redirecting to login.");
    return redirectToLogin(req);
  }

  const { application_status } = userData;

  // Handle application_status-based redirection
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
    console.log(
      "[DEBUG] User with 'passed' status trying to access restricted route.",
    );
    return redirectTo(req, "/codevs");
  }

  if (
    application_status === "failed" &&
    ["/home", "/auth/waiting", "/auth/verify"].includes(pathname)
  ) {
    console.log(
      "[DEBUG] User with 'failed' status trying to access restricted route.",
    );
    return redirectTo(req, "/auth/declined");
  }

  if (
    application_status === "applying" &&
    ["/home", "/auth/declined", "/auth/verify"].includes(pathname)
  ) {
    console.log(
      "[DEBUG] User with 'applying' status trying to access restricted route.",
    );
    return redirectTo(req, "/auth/waiting");
  }

  console.log("[DEBUG] User has permission to access:", pathname);
  return NextResponse.next();
}

function redirectToLogin(req: NextRequest) {
  const redirectUrl = new URL("/auth/sign-in", req.url);
  redirectUrl.searchParams.set("from", req.nextUrl.pathname);
  console.log("[DEBUG] Redirecting to login:", redirectUrl.toString());
  return NextResponse.redirect(redirectUrl);
}

function redirectTo(req: NextRequest, path: string) {
  const redirectUrl = new URL(path, req.url);
  console.log("[DEBUG] Redirecting to:", redirectUrl.toString());
  return NextResponse.redirect(redirectUrl);
}
