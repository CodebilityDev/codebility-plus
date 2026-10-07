import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  createProxyClient,
  passThrough,
  redirectTo,
} from "@/lib/global/proxy-session";
import type { ProxyClient } from "@/lib/global/proxy-session";
import { createClientAnon } from "@/lib/global/supabase-anon";

export const config = {
  matcher: ["/((?!api|_next/static|.*\\..*|_next/image|favicon.ico).*)"],
};

const SIGN_IN = "/auth/sign-in";
const HOME = "/home";
const TWO_FACTOR = "/auth/2fa-challenge";
const EMAIL_VERIFICATION = "/auth/verify";
const DECLINED = "/auth/declined";
const WAITING_APPROVAL = "/auth/waiting";
const APPLICANT = "/applicant";
const PROFILE_PREFIX = "/profiles/";

const PUBLIC_PATHS = new Set([
  "/",
  "/privacy-policy",
  "/contact",
  "/codevs",
  "/hire-a-codev",
  "/bookacall",
  "/services",
  "/careers",
  "/ai-integration",
  "/profiles",
  "/nda-signing/public",
  "/auth/callback",
  "/auth/password-reset",
  EMAIL_VERIFICATION,
]);

const PUBLIC_PREFIXES = [PROFILE_PREFIX, "/nda-signing/"];

const AUTH_ENTRY_PATHS = new Set([SIGN_IN, "/auth/sign-up", "/auth/onboarding"]);

const STATUS_EXEMPT_PATHS = new Set([TWO_FACTOR]);

const PASSED_BLOCKED_PATHS = new Set([
  WAITING_APPROVAL,
  DECLINED,
  APPLICANT,
  "/applicant/waiting",
  "/applicant/profile",
  "/applicant/account-settings",
]);

const APPLICANT_STATUSES = new Set([
  "applying",
  "pending",
  "testing",
  "onboarding",
  "waitlist",
]);

const routePermissionMap = {
  "/home/applicants": "applicants",
  "/home/kanban": "kanban",
} as const;

type PermissionKey = (typeof routePermissionMap)[keyof typeof routePermissionMap];

const PERMISSION_COLUMNS = [
  ...new Set(Object.values(routePermissionMap)),
].join(", ");

const PERMISSION_PREFIXES = (
  Object.keys(routePermissionMap) as (keyof typeof routePermissionMap)[]
).sort((a, b) => b.length - a.length);

type Access = "public" | "auth-entry" | "protected";

interface Account {
  application_status: string | null;
  roles?: Record<string, boolean> | null;
}

function accessFor(pathname: string): Access {
  if (PUBLIC_PATHS.has(pathname)) return "public";
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return "public";
  }
  if (AUTH_ENTRY_PATHS.has(pathname)) return "auth-entry";
  return "protected";
}

function permissionFor(pathname: string): PermissionKey | null {
  const match = PERMISSION_PREFIXES.find((prefix) =>
    pathname.startsWith(prefix),
  );
  return match ? routePermissionMap[match] : null;
}

function statusRedirect(status: string | null, pathname: string): string | null {
  if (status === "passed") {
    return PASSED_BLOCKED_PATHS.has(pathname) ? HOME : null;
  }

  if (status === "failed" || status === "denied") {
    const allowed =
      pathname.includes(DECLINED) || pathname.includes(APPLICANT);
    return allowed ? null : DECLINED;
  }

  if (status && APPLICANT_STATUSES.has(status)) {
    const allowed =
      pathname.includes(WAITING_APPROVAL) || pathname.includes(APPLICANT);
    return allowed ? null : "/applicant/waiting";
  }

  return null;
}

const PROFILE_EXISTS_TTL_MS = 30 * 60_000;
const PROFILE_EXISTS_MAX_ENTRIES = 5_000;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
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

async function fetchAccount(
  client: ProxyClient,
  userId: string,
  withPermissions: boolean,
): Promise<Account | null> {
  const columns = withPermissions
    ? `id, application_status, roles(${PERMISSION_COLUMNS})`
    : "id, application_status";

  const { data, error } = await client.supabase
    .from("codev")
    .select(columns)
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Proxy account lookup failed:", error);
    return null;
  }

  return data as unknown as Account;
}

function notFound(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/not-found";
  url.search = "";
  return NextResponse.rewrite(url, { status: 404 });
}

function toSignIn(client: ProxyClient, request: NextRequest, pathname: string) {
  const from = pathname.startsWith("/auth/") ? undefined : pathname;
  return redirectTo(client, request, SIGN_IN, from);
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const access = accessFor(pathname);

    if (access === "public") {
      if (pathname.startsWith(PROFILE_PREFIX)) {
        const id = pathname.slice(PROFILE_PREFIX.length).split("/").shift() ?? "";
        if (!UUID_PATTERN.test(id) || !(await profileExists(id))) {
          return notFound(request);
        }
      }
      return NextResponse.next();
    }

    const client = createProxyClient(request);

    if (access === "auth-entry") {
      const {
        data: { user },
      } = await client.supabase.auth.getUser();

      return user
        ? redirectTo(client, request, HOME)
        : passThrough(client);
    }

    const {
      data: { user },
      error: authError,
    } = await client.supabase.auth.getUser();

    if (authError || !user) return toSignIn(client, request, pathname);

    const { data: assurance } =
      await client.supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (assurance) {
      const { currentLevel, nextLevel } = assurance;
      if (
        nextLevel === "aal2" &&
        currentLevel === "aal1" &&
        pathname !== TWO_FACTOR
      ) {
        return redirectTo(client, request, TWO_FACTOR);
      }
      if (currentLevel === "aal2" && pathname === TWO_FACTOR) {
        return redirectTo(client, request, HOME);
      }
    }

    if (STATUS_EXEMPT_PATHS.has(pathname)) return passThrough(client);

    if (!user.email_confirmed_at) {
      return redirectTo(client, request, EMAIL_VERIFICATION);
    }

    const permission = permissionFor(pathname);
    const account = await fetchAccount(client, user.id, permission !== null);
    if (!account) return toSignIn(client, request, pathname);

    const target = statusRedirect(account.application_status, pathname);
    if (target) return redirectTo(client, request, target);

    if (permission && !account.roles?.[permission]) {
      return redirectTo(client, request, HOME);
    }

    return passThrough(client);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.redirect(new URL(SIGN_IN, request.url));
  }
}
