import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  createProxyClient,
  passThrough,
  redirectTo,
} from "@/lib/global/proxy-session";
import type { ProxyClient } from "@/lib/global/proxy-session";
import { createClientAnon } from "@/lib/global/supabase-anon";
import {
  EXACT_ROUTE_PERMISSIONS,
  PERMISSION_COLUMNS,
  PERMISSION_KEYS,
  ROUTE_PERMISSION_MAP,
  isFullAccess,
  requiresFullAccess,
} from "@/constants/global/permissions";
import type { PermissionKey, RolePermissions } from "@/types/global/permissions";
import {
  PROXY_ACCESS_HEADER,
  encodeProxyAccess,
} from "@/lib/global/proxy-access";
import {
  PERMISSION_CLAIM_VERSION,
  decodePermissionMask,
  readCustomClaims,
} from "@/lib/global/session-claims";
import { logPerf } from "@/lib/global/timing";

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
  "/proposal",
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

const PERMISSION_PREFIXES = Object.keys(ROUTE_PERMISSION_MAP).sort(
  (a, b) => b.length - a.length,
);

type Access = "public" | "auth-entry" | "protected";

interface Account {
  role_id: number | null;
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
  const exact = EXACT_ROUTE_PERMISSIONS[pathname];

  if (exact) return exact;

  const match = PERMISSION_PREFIXES.find((prefix) =>
    pathname.startsWith(prefix),
  );
  return (match ? ROUTE_PERMISSION_MAP[match] : null) ?? null;
}

function denialTarget(pathname: string): string {
  return pathname === HOME ? "/home/account-settings" : HOME;
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

const ACCOUNT_TTL_MS = 60_000;
const ACCOUNT_MAX_ENTRIES = 10_000;
const accountCache = new Map<
  string,
  { account: Account; requiresAal2: boolean; expiresAt: number }
>();

async function cachedAccount(
  client: ProxyClient,
  userId: string,
): Promise<{ account: Account; requiresAal2: boolean } | null> {
  const cached = accountCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) {
    return { account: cached.account, requiresAal2: cached.requiresAal2 };
  }

  const { data: assurance } =
    await client.supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const account = await fetchAccount(client, userId, true);

  if (!account) return null;

  if (accountCache.size >= ACCOUNT_MAX_ENTRIES) {
    accountCache.clear();
  }

  accountCache.set(userId, {
    account,
    requiresAal2: assurance?.nextLevel === "aal2",
    expiresAt: Date.now() + ACCOUNT_TTL_MS,
  });

  return { account, requiresAal2: assurance?.nextLevel === "aal2" };
}

async function fetchAccount(
  client: ProxyClient,
  userId: string,
  withPermissions: boolean,
): Promise<Account | null> {
  const columns = withPermissions
    ? `id, role_id, application_status, roles(${PERMISSION_COLUMNS})`
    : "id, role_id, application_status";

  const authStartedAt = performance.now();
  const { data, error } = await client.supabase
    .from("codev")
    .select(columns)
    .eq("id", userId)
    .single();
  logPerf("proxy.account", authStartedAt);

  if (error) {
    console.error("Proxy account lookup failed:", error);
    return null;
  }

  return data as unknown as Account;
}

function accessHeaders(
  permissions: RolePermissions,
  hasFullAccess: boolean,
): Record<string, string> {
  return {
    [PROXY_ACCESS_HEADER]: encodeProxyAccess({ permissions, hasFullAccess }),
  };
}

function accountPermissions(account: Account): RolePermissions {
  const permissions = {} as RolePermissions;

  for (const key of PERMISSION_KEYS) {
    permissions[key] = Boolean(account.roles?.[key]);
  }

  return permissions;
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
  const startedAt = performance.now();

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
      const { data } = await client.supabase.auth.getClaims();

      return data?.claims.sub
        ? redirectTo(client, request, HOME)
        : passThrough(client);
    }

    const claimsStartedAt = performance.now();
    const { data: claimsData, error: claimsError } =
      await client.supabase.auth.getClaims();
    logPerf("proxy.claims", claimsStartedAt);

    const claims = claimsData?.claims;

    if (claimsError || !claims?.sub) {
      return toSignIn(client, request, pathname);
    }

    const userId = claims.sub;

    const currentLevel = typeof claims.aal === "string" ? claims.aal : null;
    const custom = readCustomClaims(claims);

    let permissions: RolePermissions;
    let status: string | null;
    let roleId: number | null;
    let requiresAal2: boolean;

    if (custom.mask !== null && custom.version === PERMISSION_CLAIM_VERSION) {
      permissions = decodePermissionMask(custom.mask);
      status = custom.status;
      roleId = custom.roleId;
      requiresAal2 = custom.hasMfa;
    } else {
      const cached = await cachedAccount(client, userId);

      if (!cached) return toSignIn(client, request, pathname);

      permissions = accountPermissions(cached.account);
      status = cached.account.application_status;
      roleId = cached.account.role_id;
      requiresAal2 = cached.requiresAal2;
    }

    if (requiresAal2 && currentLevel !== "aal2" && pathname !== TWO_FACTOR) {
      return redirectTo(client, request, TWO_FACTOR);
    }
    if (currentLevel === "aal2" && pathname === TWO_FACTOR) {
      return redirectTo(client, request, HOME);
    }

    if (STATUS_EXEMPT_PATHS.has(pathname)) return passThrough(client);

    const metadata = claims.user_metadata as
      | { email_verified?: boolean }
      | undefined;

    if (metadata?.email_verified === false) {
      return redirectTo(client, request, EMAIL_VERIFICATION);
    }

    const permission = permissionFor(pathname);

    const target = statusRedirect(status, pathname);
    if (target) return redirectTo(client, request, target);

    const hasFullAccess = isFullAccess(roleId);

    if (permission) {
      const allowed = requiresFullAccess(pathname)
        ? hasFullAccess
        : Boolean(permissions[permission]);
      if (!allowed) {
        return redirectTo(client, request, denialTarget(pathname));
      }
    }

    return passThrough(client, accessHeaders(permissions, hasFullAccess));
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.redirect(new URL(SIGN_IN, request.url));
  } finally {
    logPerf("proxy.total", startedAt);
  }
}
