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

const PUBLIC_ROUTE_PREFIXES = ["/profiles/", "/nda-signing/"] as const;

const PROFILE_DETAIL_PREFIX = "/profiles/";
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
    if (error) {
      console.error("Proxy profile lookup failed:", error);
    } else {
      exists = data.length > 0;
    }
  } catch (error) {
    console.error("Proxy profile lookup failed:", error);
  }

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

const EMAIL_VERIFICATION_ROUTE = "/auth/verify";
const WAITING_APPROVAL_ROUTE = "/auth/waiting";
const APPLICATION_DECLINED_ROUTE = "/auth/declined";
const APPLICANT_ROUTE = "/applicant";
const TWO_FACTOR_ROUTE = "/auth/2fa-challenge";

const AUTH_STATUS_ROUTES = [APPLICATION_DECLINED_ROUTE, EMAIL_VERIFICATION_ROUTE, TWO_FACTOR_ROUTE] as const;

const routePermissionMap = {
  "/home/applicants": "applicants",
} as const;

type Permission = (typeof routePermissionMap)[keyof typeof routePermissionMap];
const PERMISSION_COLUMNS = [...new Set(Object.values(routePermissionMap))].join(", ");

export async function proxy(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;


    if (PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

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

    if (AUTH_ROUTES.includes(pathname)) {
      const supabase = await createClientServerComponent();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        return redirectTo(req, "/home");
      }

      return NextResponse.next();
    }

    const supabase = await createClientServerComponent();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (pathname === EMAIL_VERIFICATION_ROUTE) {
      return NextResponse.next();
    }

    if (authError || !user) {
      return redirectToLogin(req);
    }

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

    if (AUTH_STATUS_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (
      !authUser?.email_confirmed_at &&
      pathname !== EMAIL_VERIFICATION_ROUTE
    ) {
      return redirectTo(req, EMAIL_VERIFICATION_ROUTE);
    }

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

    if (application_status === "passed") {
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
      if (pathname.includes(WAITING_APPROVAL_ROUTE) || pathname.includes(APPLICANT_ROUTE)) {
        return NextResponse.next();
      } else {
        return redirectTo(req, '/applicant/waiting');
      }
    }


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
