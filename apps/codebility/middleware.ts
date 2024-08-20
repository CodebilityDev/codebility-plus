// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, URLPattern } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from "@/lib/tokenVerification"
import { jwtDecode } from "jwt-decode"
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

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
  const supabase = createMiddlewareClient({req,res});

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

  ///////// OLD CODEBILITY MIDDLEWARE //////////// - uncomment this and comment the above code if using old be.
/*   const { nextUrl, cookies } = req
  if (!cookies.has("codebility-auth")) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }
  if (nextUrl.pathname === "/auth/signout") {
    const response = NextResponse.redirect(new URL("/auth/signin", req.url))
    response.cookies.delete("codebility-auth")
    return response
  }
  if (cookies.has("codebility-auth")) {
    const result = await isAuthenticated(req)
    if (!result) {
      const response = NextResponse.redirect(new URL("/auth/signin", req.url))
      response.cookies.delete("codebility-auth")
      return response
    }
    const decoded: any = jwtDecode(cookies.get("codebility-auth")?.value as string)
    if (decoded && decoded.userType.name === "APPLICANT") {
      const response = NextResponse.redirect(new URL("/waiting", req.url))
      return response
    }
    const applicantUrl = req.url.split("/")
    if (applicantUrl[applicantUrl.length - 1] === "applicants" && decoded && decoded.userType.name !== "ADMIN") {
      const response = NextResponse.redirect(new URL("/dashboard", req.url))
      return response
    }
    const internsUrl = req.url.split("/")
    if (internsUrl[internsUrl.length - 1] === "interns" && decoded && decoded.userType.name !== "ADMIN") {
      const response = NextResponse.redirect(new URL("/dashboard", req.url))
      return response
    }
    const inhouseUrl = req.url.split("/") 
    if(inhouseUrl[inhouseUrl.length - 1]  === "in-house" && decoded && decoded.userType.name !== "ADMIN"){
      const response = NextResponse.redirect(new URL("/dashboard", req.url))
      return response
    }
  } */
}

/**
 * Define URL patterns and their corresponding handlers.
 */

function getPatterns() {
  return [{
    pattern: new URLPattern({ pathname: '/authv2/*?' }),
    handler: async (req: NextRequest, res: NextResponse) => {
      const supabase = createMiddlewareClient({req,res});

      const {
        data: { user },
      } = await getUser(req, res);

      const { data: userData } = await supabase.from("codev")
      .select()
      .eq("user_id", user?.id)
      .single();

      // the user is logged out, so we don't need to do anything
      if (!user) return;
      
      // If user is logged in, redirect to their respective page.
      let nextURL = new URL("/home", req.nextUrl.origin).href; // default for now, mentor.
      switch ( userData?.application_status ) {
        case "PENDING":
        case "DECLINED":
          nextURL = new URL("/waiting", req.nextUrl.origin).href; // waiting page for now.
          break;
      }

      return NextResponse.redirect(nextURL);
    },
  },
  {
    pattern: new URLPattern({ pathname: '/home/*?' }),
    handler: async (req: NextRequest, res: NextResponse) => {
      const {
        data: { user },
      } = await getUser(req, res);

      const origin = req.nextUrl.origin;
      const next = req.nextUrl.pathname;

       // If user is not logged in, redirect to sign in page.
       if (!user) {
        const signIn = `/authv2/signin`;
        const redirectPath = `${signIn}?next=${next}`;

        return NextResponse.redirect(new URL(redirectPath, origin).href);
      }
    }
  }
];
}

/**
 * Match URL patterns to specific handlers.
 * @param url
 */
function matchUrlPattern(url: string) {
  const patterns = getPatterns();
  const input = url.split('?')[0];
  for (const pattern of patterns) {
    const patternResult = pattern.pattern.exec(input);
    if (patternResult !== null && 'pathname' in patternResult) {
      return pattern.handler;
    }
  }
}