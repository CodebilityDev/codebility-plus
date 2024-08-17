// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from "@/lib/tokenVerification"
import { jwtDecode } from "jwt-decode"


export async function middleware(req: NextRequest) {
  // const res = NextResponse.next();
  // const nextUrl = req.nextUrl;

  // const supabase = createMiddlewareClient({ req, res });
 
  // // Refresh session if expired - required for Server Components
  // const session = await supabase.auth.getSession();

  // return res;
  ///////// DONT REMOVE THE ABOVE CODE ////////////
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