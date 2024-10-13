import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import pathsConfig from "./config/paths.config";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    // '/((?!_next/static|_next/image|favicon.ico).*)',
    "/((?!api|auth/signin|auth/signup|privacy-policy|terms|auth/forgot-password|codevs|index|profiles|waiting|declined|campaign|services|ai-integration|bookacall|_next/static|.*\\..*|_next/image|$).*)",
  ],
};

// const getUser = (req: NextRequest, res: NextResponse) => {
//   const supabase = createMiddlewareClient({ req, res });

//   return supabase.auth.getUser();
// };

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next();

//   // handle patterns for specific routes
//   const handlePattern = matchUrlPattern(req.url);

//   // if a pattern handler exists, call it
//   if (handlePattern) {
//     const patternHandlerResponse = await handlePattern(req, new NextResponse());

//     // if a pattern handler returns a response, return it
//     if (patternHandlerResponse) {
//       return patternHandlerResponse;
//     }
//   }

//   return res;
// }

/**
 * Define URL patterns and their corresponding handlers.
 */

// function getPatterns() {
//   return [
//     {
//       pattern: new URLPattern({ pathname: `${pathsConfig.auth.signIn.split("/")[1]}/*?` }), // get sign in / up auth prefix.
//       handler: async (req: NextRequest, res: NextResponse) => {
//         const supabase = createMiddlewareClient({ req, res });

//         const {
//           data: { user },
//         } = await getUser(req, res);

//         const { data: userData } = await supabase
//           .from("codev")
//           .select()
//           .eq("user_id", user?.id)
//           .single();

//         // the user is logged out, so we don't need to do anything
//         if (!user) return;

//         // If user is logged in, redirect to their respective page.
//         let nextURL = new URL(pathsConfig.app.home, req.nextUrl.origin).href; // default for now, mentor.
//         switch (userData?.application_status) {
//           case "PENDING":
//           case "DECLINED":
//             nextURL = new URL("/waiting", req.nextUrl.origin).href; // waiting page for now.
//             break;
//         }

//         return NextResponse.redirect(nextURL);
//       },
//     },
//     {
//       pattern: new URLPattern({ pathname: `${pathsConfig.app.home}/*?` }),
//       handler: async (req: NextRequest, res: NextResponse) => {
//         const supabase = createMiddlewareClient({req, res});

//         const {
//           data: { user },
//         } = await getUser(req, res);

//         const origin = req.nextUrl.origin;
//         const next = req.nextUrl.pathname;

//         const signIn = pathsConfig.auth.signIn;
//         const redirectPath = `${signIn}?next=${next}`; // redirect to sign in and pass the route to go after sign in.

//         const redirectToSignIn =  NextResponse.redirect(new URL(redirectPath, origin).href);

//         // If user is not logged in, redirect to sign in page.
//         if (!user) return redirectToSignIn;

//         const currDashboardPath = req.nextUrl.pathname.split("/home/")[1]; // the current path user is on.
//         const allowedPath = [
//           getSplit(pathsConfig.app.settings, "/", { getLast: true }),
//           getSplit(pathsConfig.app.orgchart, "/", { getLast: true }),
//         ]

//         if (!currDashboardPath || allowedPath.includes(currDashboardPath)) return; // checking won't be required because user is on their personal dashboard or when the path is allowed for everyone

//         // get user dashboard permissions
//         const { data, error } = await supabase.from("user")
//         .select(`
//           *,
//           user_type(${permissionsString})
//         `)
//         .eq("id", user.id)
//         .single();

//         if (error || !data) return redirectToSignIn;

//         // redirect to personal dashboard if user didn't have any permission to access the path.
//         if (!data.user_type[currDashboardPath as keyof typeof data.user_type]) return NextResponse.redirect(new URL(pathsConfig.app.home, origin).href);
//       },
//     },
//   ];
// }

/**
 * Match URL patterns to specific handlers.
 * @param url
 */
// function matchUrlPattern(url: string) {
//   const patterns = getPatterns();
//   const input = url.split("?")[0];
//   for (const pattern of patterns) {
//     const patternResult = pattern.pattern.exec(input);
//     if (patternResult !== null && "pathname" in patternResult) {
//       return pattern.handler;
//     }
//   }
// }

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = getSupabaseServerComponentClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if not signed in
  if (!user && !req.nextUrl.pathname.startsWith("/authv2")) {
    const url = req.nextUrl.clone();
    url.pathname = "/authv2/sign-in";
    return NextResponse.redirect(url);
  }

  const { data: codev } = await supabase
    .from("codev")
    .select("application_status, user(*, user_type(*))")
    .eq("user_id", user?.id)
    .single();

  // if the applicants is not yet accepted and trying to access home/dashboard
  if (
    codev?.application_status !== "ACCEPTED" &&
    req.nextUrl.pathname.startsWith("/home")
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/waiting";
    return NextResponse.redirect(url);
  }

  const hasPermission = await checkPermissions(user?.id!, req.nextUrl.pathname);

  // if no permission redirect to dashboard
  if (codev?.application_status === "ACCEPTED" && !hasPermission) {
    console.log(`Access denied for ${user?.email} on ${req.nextUrl.pathname}`);
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

  // if path is equal to "/home" and return true if the conditions met
  if (path === pathsConfig.app.home) {
    return permissions.dashboard === true;
  }

  // ex. /home/applicants => ["", "home", "applicants"]
  const pathSegments = path.split("/");

  let lastSegment;
  // if the path is from settings
  // ex. /home/settings/permissions => ["", "home", "settings", "permissions"]
  if (
    pathSegments.length === 4 &&
    pathSegments[1] === "home" &&
    pathSegments[2] === "settings" // in here we need to specify from what route, because we have another path with length of 4, which is in clients archive - /home/clients/archive => ["", "home", "clients", "archive"]
  ) {
    lastSegment = pathSegments[3]; // lastSegment now is equal to "permissions"
  } else {
    lastSegment = pathSegments[2]; // this will check the path (ex. /home/applicants => ["", "home", "applicants"])
  }

  // this one is renaming only because in the url it uses "-" not "_"
  if (lastSegment === "in-house") {
    lastSegment = "in_house";
  } else if (lastSegment === "time-tracker") {
    lastSegment = "time_tracker";
  }

  // if we have permission we can access that page
  if (lastSegment && lastSegment in permissions) {
    return permissions[lastSegment] === true;
  }

  return false;
};
