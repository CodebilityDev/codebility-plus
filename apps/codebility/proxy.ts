import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClientAnon } from "@/lib/global/supabase-anon";
import { createClientServerComponent } from "@/lib/global/supabase-server";


export const config = {
  matcher: ["/((?!api|_next/static|.*\\..*|_next/image|favicon.ico).*)"],
};

const PUBLIC_ROUTES = [
  "/privacy-policy",
  "/standalone",
  "/terms",
  "/auth/password-reset",
  "/codevs",
  "/hire-a-codev",
  "/bookacall",
  "/services",
  "/",
  "/careers",
  "/nda-signing/public",
  "/ai-integration",
  "/auth/callback",

] as const;

// Routes that should be public with wildcard support (e.g., /profiles/*)
const PUBLIC_ROUTE_PREFIXES = ["/profiles/", "/nda-signing/"] as const;

const PROFILE_DETAIL_PREFIX = "/profiles/";
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Profile existence is checked here rather than in the page. Under Cache
// Components the page streams its static shell before it can read the id, so a
// notFound() there can only ever answer 200 with a noindex tag. Proxy runs
// before the response starts, so it can still set the status.
//
// Link prefetching fires a request per visible card, so results are memoised.
// The window only delays propagating a deleted profile, and a stale "exists"
// still ends in the streamed not-found page, so it can be generous.
// ponytail: per-process TTL map with a crude size cap. Move to a shared cache
// if the number of server instances starts to matter.
const PROFILE_EXISTS_TTL_MS = 30 * 60_000;
const PROFILE_EXISTS_MAX_ENTRIES = 5_000;
const profileExistsCache = new Map<
  string,
  { exists: boolean; expiresAt: number }
>();

async function profileExists(id: string): Promise<boolean> {
  const cached = profileExistsCache.get(id);
  if (cached && cached.expiresAt > Date.now()) return cached.exists;

  let exists = true;
  try {
    const { data, error } = await createClientAnon()
      .from("codev")
      .select("id")
      .eq("id", id)
      .limit(1);
    // Fail open: a lookup error must not 404 a profile that exists.
    if (error) {
      console.error("Proxy profile lookup failed:", error);
    } else {
      exists = data.length > 0;
    }
  } catch (error) {
    console.error("Proxy profile lookup failed:", error);
  }

  // Bounds memory against a caller walking made-up (but well-formed) ids.
  if (profileExistsCache.size >= PROFILE_EXISTS_MAX_ENTRIES) {
    profileExistsCache.clear();
  }
  profileExistsCache.set(id, {
    exists,
    expiresAt: Date.now() + PROFILE_EXISTS_TTL_MS,
  });
  return exists;
}

const AUTH_ROUTES = ["/auth/sign-in", "/auth/sign-up", "/auth/onboarding"] as const;

// Authentication status routes - these require auth but have special handling
const EMAIL_VERIFICATION_ROUTE = "/auth/verify";
const WAITING_APPROVAL_ROUTE = "/auth/waiting";
const APPLICATION_DECLINED_ROUTE = "/auth/declined";
const APPLICANT_ROUTE = "/applicant";
const TWO_FACTOR_ROUTE = "/auth/2fa-challenge";

// Routes that authenticated users can always access regardless of application status
const AUTH_STATUS_ROUTES = [APPLICATION_DECLINED_ROUTE, EMAIL_VERIFICATION_ROUTE, TWO_FACTOR_ROUTE] as const;

// Route prefix -> boolean column on the `roles` table. Keep in sync with
// actions/home/sidebar.ts when adding a private page.
const routePermissionMap = {
  "/home/applicants": "applicants",
} as const;

type Permission = (typeof routePermissionMap)[keyof typeof routePermissionMap];
const PERMISSION_COLUMNS = [...new Set(Object.values(routePermissionMap))].join(", ");

export async function proxy(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;


    // 1. Check if the route is public - allow access without any auth checks
    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

    // Check for wildcard public routes (e.g., /profiles/*)
    const isPublicPrefix = PUBLIC_ROUTE_PREFIXES.some((prefix) =>
      pathname.startsWith(prefix),
    );

    if (isPublicPrefix) {
      if (pathname.startsWith(PROFILE_DETAIL_PREFIX)) {
        const id = pathname.slice(PROFILE_DETAIL_PREFIX.length).split("/").shift() ?? "";
        if (!UUID_PATTERN.test(id) || !(await profileExists(id))) {
          const url = req.nextUrl.clone();
          url.pathname = "/not-found";
          url.search = "";
          return NextResponse.rewrite(url, { status: 404 });
        }
      }
      return NextResponse.next();
    }

    // 2. Special handling for auth routes
    if (AUTH_ROUTES.includes(pathname)) {
      // We need to check if user is logged in, but handle "no token" gracefully
      const supabase = await createClientServerComponent();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // If user is already logged in, redirect to home
      if (user) {
        return redirectTo(req, "/home");
      }

      // Allow access to auth pages if not logged in
      return NextResponse.next();
    }

    // From this point on, we need authenticated users
    const supabase = await createClientServerComponent();
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

    // Check Supabase MFA assurance level (2FA)
    const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (mfaData) {
      const { currentLevel, nextLevel } = mfaData;
      if (nextLevel === "aal2" && currentLevel === "aal1") {
        if (pathname !== TWO_FACTOR_ROUTE) {
          return redirectTo(req, TWO_FACTOR_ROUTE);
        }
      } else if (currentLevel === "aal2" && pathname === TWO_FACTOR_ROUTE) {
        return redirectTo(req, "/home");
      }
    }

    // Allow authenticated users to access auth status routes without further checks
    // This prevents redirect loops when users are being directed to these pages
    if (AUTH_STATUS_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

    // Check if email is verified
    const {
      data: { user: authUser },
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

    if (userError) {
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
          "/applicant/waiting",
          "/applicant/profile",
          "/applicant/account-settings"
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
      application_status === "onboarding" ||
      application_status === "waitlist"
    ) {
      // If application is in progress or waiting for approval, only allow access to applicant routes
      if (pathname.includes(WAITING_APPROVAL_ROUTE) || pathname.includes(APPLICANT_ROUTE)) {
        return NextResponse.next();
      } else {
        return redirectTo(req, '/applicant/waiting');
      }
    }

    // If we reach here, the user is approved and accessing a protected route

    // 5. Check role-based permissions for protected routes
    const sortedRouteKeys = Object.keys(routePermissionMap).sort(
      (a, b) => b.length - a.length,
    );
    const matchedRoute = sortedRouteKeys.find((routePrefix) =>
      pathname.startsWith(routePrefix),
    ) as keyof typeof routePermissionMap | undefined;

    if (matchedRoute && role_id) {
      const requiredPermission = routePermissionMap[matchedRoute];

      const { data: rolePermissions, error: roleError } = await supabase
        .from("roles")
        .select(PERMISSION_COLUMNS)
        .eq("id", role_id)
        .single();

      if (roleError) {
        console.error("Failed to fetch role permissions:", roleError);
        return redirectToLogin(req);
      }

      const permissions = rolePermissions as unknown as Record<Permission, boolean>;
      if (!permissions[requiredPermission]) {
        return redirectTo(req, "/home");
      }
    }


    return NextResponse.next();
  } catch (error) {
    console.error("Proxy error:", error);
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
