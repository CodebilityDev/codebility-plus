import type { NextRequest } from "next/server";
import { NextResponse, URLPattern } from "next/server";

import { createMiddlewareClient } from "@codevs/supabase/middleware-client";

import pathsConfig from "./config/paths.config";
import { permissionsString } from "./constants";
import { getSplit } from "./lib/get-split";

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
    "/((?!api|auth/signin|auth/signup|privacy-policy|terms|auth/forgot-password|codevs|index|profiles|waiting|campaign|services|ai-integration|bookacall|_next/static|.*\\..*|_next/image|$).*)",
  ],
};

const getUser = (req: NextRequest, res: NextResponse) => {
  const supabase = createMiddlewareClient({ req, res });

  return supabase.auth.getUser();
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // handle patterns for specific routes
  const handlePattern = matchUrlPattern(req.url);

  // if a pattern handler exists, call it
  if (handlePattern) {
    const patternHandlerResponse = await handlePattern(req, new NextResponse());

    // if a pattern handler returns a response, return it
    if (patternHandlerResponse) {
      return patternHandlerResponse;
    }
  }

  return res;
}

/**
 * Define URL patterns and their corresponding handlers.
 */

function getPatterns() {
  return [
    {   
      pattern: new URLPattern({ pathname: `${pathsConfig.auth.signIn.split("/")[1]}/*?` }), // get sign in / up auth prefix.
      handler: async (req: NextRequest, res: NextResponse) => {
        const supabase = createMiddlewareClient({ req, res });

        const {
          data: { user },
        } = await getUser(req, res);

        const { data: userData } = await supabase
          .from("codev")
          .select()
          .eq("user_id", user?.id)
          .single();

        // the user is logged out, so we don't need to do anything
        if (!user) return;

        // If user is logged in, redirect to their respective page.
        let nextURL = new URL(pathsConfig.app.home, req.nextUrl.origin).href; // default for now, mentor.
        switch (userData?.application_status) {
          case "PENDING":
          case "DECLINED":
            nextURL = new URL("/waiting", req.nextUrl.origin).href; // waiting page for now.
            break;
        }

        return NextResponse.redirect(nextURL);
      },
    },
    {
      pattern: new URLPattern({ pathname: `${pathsConfig.app.home}/*?` }),
      handler: async (req: NextRequest, res: NextResponse) => {
        const supabase = createMiddlewareClient({req, res});

        const {
          data: { user },
        } = await getUser(req, res);

        const origin = req.nextUrl.origin;
        const next = req.nextUrl.pathname;
        
        const signIn = pathsConfig.auth.signIn;
        const redirectPath = `${signIn}?next=${next}`; // redirect to sign in and pass the route to go after sign in.

        const redirectToSignIn =  NextResponse.redirect(new URL(redirectPath, origin).href);

        // If user is not logged in, redirect to sign in page.
        if (!user) return redirectToSignIn;

        const currDashboardPath = req.nextUrl.pathname.split("/home/")[1]; // the current path user is on.
        const allowedPath = [
          getSplit(pathsConfig.app.settings, "/", { getLast: true }),
          getSplit(pathsConfig.app.orgchart, "/", { getLast: true }),
        ]

        if (!currDashboardPath || allowedPath.includes(currDashboardPath)) return; // checking won't be required because user is on their personal dashboard or when the path is allowed for everyone 

        // get user dashboard permissions
        const { data, error } = await supabase.from("user")
        .select(`
          *, 
          user_type(${permissionsString})
        `)
        .eq("id", user.id)
        .single();

        if (error || !data) return redirectToSignIn;
        
        // redirect to personal dashboard if user didn't have any permission to access the path.
        if (!data.user_type[currDashboardPath as keyof typeof data.user_type]) return NextResponse.redirect(new URL(pathsConfig.app.home, origin).href);
      },
    },
  ];
}

/**
 * Match URL patterns to specific handlers.
 * @param url
 */
function matchUrlPattern(url: string) {
  const patterns = getPatterns();
  const input = url.split("?")[0];
  for (const pattern of patterns) {
    const patternResult = pattern.pattern.exec(input);
    if (patternResult !== null && "pathname" in patternResult) {
      return pattern.handler;
    }
  }
}
