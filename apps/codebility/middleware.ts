import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import pathsConfig from "./config/paths.config";
import { getCachedUser } from "./lib/server/supabase-server-comp";

export const config = {
  matcher: [
    "/((?!api|auth/signin|auth/signup|privacy-policy|terms|auth/forgot-password|codevs|index|profiles|waiting|declined|thank-you|campaign|services|ai-integration|bookacall|_next/static|.*\\..*|_next/image|$).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = getSupabaseServerComponentClient();
  const user = await getCachedUser();

  if (!user && !req.nextUrl.pathname.startsWith("/authv2")) {
    const url = req.nextUrl.clone();
    url.pathname = "/authv2/sign-in";
    return NextResponse.redirect(url);
  }

  if (!user) return res;

  const { data: codev } = await supabase
    .from("codev")
    .select("application_status, user(*, user_type(*))")
    .eq("user_id", user.id)
    .single();

  if (!codev) return res;

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

  const hasPermission = await checkPermissions(user.id, req.nextUrl.pathname);

  if (codev.application_status === "ACCEPTED" && !hasPermission) {
    const url = req.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return res;
}

const checkPermissions = async (userId: string, path: string) => {
  const supabase = getSupabaseServerComponentClient();
  const { data, error } = await supabase
    .from("user")
    .select("*, user_type(*)")
    .eq("id", userId)
    .single();

  if (error || !data) return false;

  const permissions = data.user_type;

  if (path === pathsConfig.app.home) {
    return permissions.dashboard === true;
  }

  const pathSegments = path.split("/");
  let lastSegment;

  if (
    pathSegments.length === 4 &&
    pathSegments[1] === "home" &&
    pathSegments[2] === "settings"
  ) {
    lastSegment = pathSegments[3];
  } else {
    lastSegment = pathSegments[2];
  }

  const segmentMap = {
    "in-house": "in_house",
    "time-tracker": "time_tracker",
    "account-settings": "account_settings",
  };

  lastSegment = segmentMap[lastSegment] || lastSegment;

  if (lastSegment && lastSegment in permissions) {
    return permissions[lastSegment] === true;
  }

  return false;
};
