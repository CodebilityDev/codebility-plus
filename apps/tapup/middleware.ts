import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const nextUrl = req.nextUrl;

  const supabase = createMiddlewareClient({ req, res });
 
  // Refresh session if expired - required for Server Components
  const { data: {session}} = await supabase.auth.getSession();

  const authenticatedRoutes = [
    "/"
  ];

  const isApi = nextUrl.pathname.indexOf("/api") === 0;

  if (!session && authenticatedRoutes.includes(nextUrl.pathname) && !isApi) 
    return NextResponse.redirect(new URL("/auth/login",nextUrl));

  return res;
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
      '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};