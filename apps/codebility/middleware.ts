import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClientServerComponent } from "./utils/supabase/server";

// Line 1-10: Configuration
export const config = {
  matcher: ["/((?!api|_next/static|.*\\..*|_next/image|favicon.ico).*)"],
};

// Line 11-35: Route configuration - consolidated and organized
const ROUTE_CONFIG = {
  PUBLIC: [
    "/privacy-policy", "/standalone", "/terms", "/auth/password-reset", 
    "/codevs", "/bookacall", "/services", "/", "/careers", 
    "/nda-signing/public", "/auth/callback"
  ] as const,
  
  PUBLIC_PREFIXES: ["/profiles/", "/nda-signing/"] as const,
  
  AUTH: ["/auth/sign-in", "/auth/sign-up", "/auth/onboarding"] as const,
  
  SPECIAL: {
    EMAIL_VERIFICATION: "/auth/verify",
    WAITING_APPROVAL: "/auth/waiting", 
    APPLICATION_DECLINED: "/auth/declined",
    APPLICANT: "/applicant",
  } as const,
} as const;

// Line 36-50: Permission mapping - corrected to match your exact requirements
const PERMISSION_MAP: Record<string, keyof RolePermissions> = {
  "/home/interns": "interns",        // Maps to "My Team" ✓
  "/home/orgchart": "orgchart",      // Maps to "Org Chart" ✓
  "/home/applicants": "applicants",  // Should be blocked ✗
  "/home/in-house": "inhouse",       // Should be blocked ✗
  "/home/clients": "clients",        // Should be blocked ✗ (you said remove!)
  "/home/projects": "projects",      // Maps to "Projects" ✓
  "/home/settings/permissions": "permissions", // Should be blocked ✗
  "/home/settings/roles": "roles",   // Should be blocked ✗
  "/home/settings/profile": "resume", // Should work ✓
  "/home/settings": "settings",      // Maps to "Settings" ✓
  "/home/time-tracker": "time_tracker", // Should be blocked ✗
};

// Line 51-70: Type definitions
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

// Line 71-85: Route checking utilities - DRY principle
function isPublicRoute(pathname: string): boolean {
  return ROUTE_CONFIG.PUBLIC.includes(pathname as any) ||
         ROUTE_CONFIG.PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

function isAuthRoute(pathname: string): boolean {
  return ROUTE_CONFIG.AUTH.includes(pathname as any);
}

// Line 86-105: Application status handler - SOLID Single Responsibility
function handleApplicationStatus(status: string, pathname: string, req: NextRequest): NextResponse | null {
  const restrictedForApproved = [
    ROUTE_CONFIG.SPECIAL.WAITING_APPROVAL,
    ROUTE_CONFIG.SPECIAL.APPLICATION_DECLINED,
    ROUTE_CONFIG.SPECIAL.EMAIL_VERIFICATION,
    ROUTE_CONFIG.SPECIAL.APPLICANT,
    "/applicant/waiting", "/applicant/profile", "/applicant/account-settings"
  ];

  switch (status) {
    case "passed":
      return restrictedForApproved.includes(pathname) ? redirectTo(req, "/home") : null;
      
    case "failed":
    case "denied":
      if (!pathname.includes(ROUTE_CONFIG.SPECIAL.APPLICATION_DECLINED) && 
          !pathname.includes(ROUTE_CONFIG.SPECIAL.APPLICANT)) {
        return redirectTo(req, ROUTE_CONFIG.SPECIAL.APPLICATION_DECLINED);
      }
      return null;
      
    case "applying":
    case "pending":
    case "testing":
    case "onboarding":
      if (!pathname.includes(ROUTE_CONFIG.SPECIAL.WAITING_APPROVAL) &&
          !pathname.includes(ROUTE_CONFIG.SPECIAL.APPLICANT)) {
        return redirectTo(req, "applicant/waiting");
      }
      return null;
      
    default:
      return null;
  }
}

// Line 106-125: Permission validation - optimized database query with type safety
async function validateRoutePermissions(
  pathname: string, 
  roleId: number | null,
  supabase: any
): Promise<boolean> {
  if (!roleId) return true;
  
  // Find matching route using longest-prefix matching
  const matchedRoute = Object.keys(PERMISSION_MAP)
    .sort((a, b) => b.length - a.length)
    .find(route => pathname.startsWith(route));
    
  // Type-safe check: ensure matchedRoute exists before using it
  if (!matchedRoute) return true;
  
  const requiredPermission = PERMISSION_MAP[matchedRoute];
  
  // Additional type safety: ensure requiredPermission is valid
  if (!requiredPermission) {
    console.error(`Invalid permission mapping for route: ${pathname}`);
    return false;
  }
  
  // Only fetch the specific permission we need
  const { data: rolePermissions, error } = await supabase
    .from("roles")
    .select(requiredPermission)
    .eq("id", roleId)
    .single();
    
  if (error || !rolePermissions) {
    console.error("Permission check failed:", error);
    return false;
  }
  
  return Boolean(rolePermissions[requiredPermission]);
}

// Line 126-175: Main middleware function - streamlined and optimized
export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    
    // Step 1: Handle public routes early exit
    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }
    
    // Step 2: Handle auth routes with minimal database calls
    if (isAuthRoute(pathname)) {
      const supabase = await createClientServerComponent();
      const { data: { user } } = await supabase.auth.getUser();
      
      return user ? redirectTo(req, "/home") : NextResponse.next();
    }
    
    // Step 3: Initialize supabase once for remaining checks
    const supabase = await createClientServerComponent();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Handle special routes
    if (pathname === ROUTE_CONFIG.SPECIAL.EMAIL_VERIFICATION) {
      return NextResponse.next();
    }
    
    if (authError || !user) {
      return redirectToLogin(req);
    }
    
    // Step 4: Email verification check
    if (!user.email_confirmed_at && pathname !== ROUTE_CONFIG.SPECIAL.EMAIL_VERIFICATION) {
      return redirectTo(req, ROUTE_CONFIG.SPECIAL.EMAIL_VERIFICATION);
    }
    
    // Step 5: Fetch user data with single query
    const { data: userData, error: userError } = await supabase
      .from("codev")
      .select("id, application_status, role_id")
      .eq("id", user.id)
      .single();
      
    if (userError || !userData) {
      console.error("User data fetch failed:", userError);
      return redirectToLogin(req);
    }
    
    // Step 6: Handle application status redirects
    const statusRedirect = handleApplicationStatus(userData.application_status, pathname, req);
    if (statusRedirect) return statusRedirect;
    
    // Step 7: Permission validation (only for routes that need it)
    const hasPermission = await validateRoutePermissions(pathname, userData.role_id, supabase);
    if (!hasPermission) {
      console.log(`Access denied: ${pathname} for role ${userData.role_id}`);
      return redirectTo(req, "/home");
    }
    
    return NextResponse.next();
    
  } catch (error) {
    console.error("Middleware error:", error);
    return redirectToLogin(req);
  }
}

// Line 176-190: Utility functions - clean and focused
function redirectToLogin(req: NextRequest): NextResponse {
  const redirectUrl = new URL("/auth/sign-in", req.url);
  
  if (!req.nextUrl.pathname.startsWith("/auth/")) {
    const returnPath = req.nextUrl.pathname;
    if (returnPath !== "/auth/sign-in") {
      redirectUrl.searchParams.set("from", returnPath);
    }
  }
  
  return NextResponse.redirect(redirectUrl);
}

function redirectTo(req: NextRequest, path: string): NextResponse {
  const redirectUrl = new URL(path, req.url);
  return NextResponse.redirect(redirectUrl);
}