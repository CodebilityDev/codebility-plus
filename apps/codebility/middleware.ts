import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

export const config = {
  matcher: [
    "/((?!api|auth/signin|auth/signup|auth/verify|waiting|declined|privacy-policy|terms|auth/forgot-password|codevs|index|profiles|thank-you|campaign|services|ai-integration|bookacall|_next/static|.*\\..*|_next/image|$).*)",
  ],
};

const PUBLIC_ROUTES = [
  "/auth/sign-in",
  "/auth-sign-up",
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
    console.log("[DEBUG] Public route accessed:", pathname);
    return NextResponse.next();
  }

  const supabase = getSupabaseServerComponentClient();

  // Check authentication
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();

  if (authError || !session?.user) {
    console.log("[DEBUG] User not authenticated. Redirecting to login.");
    return redirectToLogin(req);
  }

  const userId = session.user.id;

  // Handle /home explicitly for authenticated users
  if (pathname === "/home") {
    console.log("[DEBUG] /home accessed by authenticated user:", userId);
    return NextResponse.next();
  }

  // Fetch user data from codev table
  const { data: codevData, error: userError } = await supabase
    .from("codev")
    .select("id, application_status")
    .eq("id", userId)
    .single();

  // Debug: Log codev data and errors
  console.log("[DEBUG] Codev Data:", codevData);
  console.log("[DEBUG] Codev Error:", userError);

  if (userError || !codevData) {
    console.log("[DEBUG] Failed to fetch codev data. Redirecting to login.");
    return redirectToLogin(req);
  }

  const { application_status } = codevData;

  // Debug: Log application status
  console.log("[DEBUG] Application Status:", application_status);

  // Handle application_status redirection rules
  if (
    application_status === "passed" &&
    ["/auth/declined", "/auth/waiting", "/auth/verify"].includes(pathname)
  ) {
    console.log(
      "[DEBUG] User with 'passed' status trying to access restricted route:",
      pathname,
    );
    return redirectTo(req, "/codev");
  }

  if (
    application_status === "failed" &&
    ["/home", "/auth/waiting", "/auth/verify"].includes(pathname)
  ) {
    console.log(
      "[DEBUG] User with 'failed' status trying to access restricted route:",
      pathname,
    );
    return redirectTo(req, "/auth/declined");
  }

  if (
    application_status === "applying" &&
    ["/home", "/auth/declined", "/auth/verify"].includes(pathname)
  ) {
    console.log(
      "[DEBUG] User with 'applying' status trying to access restricted route:",
      pathname,
    );
    return redirectTo(req, "/auth/waiting");
  }

  // Prevent signed-in users from visiting sign-in/sign-up routes
  if (["/auth/sign-in", "/auth-sign-up"].includes(pathname)) {
    console.log(
      "[DEBUG] Authenticated user trying to access sign-in/sign-up:",
      pathname,
    );
    return redirectTo(req, "/codev");
  }

  // Allow all other requests to proceed
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
