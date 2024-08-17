import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, URLPattern } from 'next/server';
import type { NextRequest } from 'next/server';

import pathsConfig from './config/paths.config';
import appConfig from './config/app.config';

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

const getUser = (req: NextRequest, res: NextResponse) => {
  const supabase = createMiddlewareClient({req,res});

  return supabase.auth.getUser();
};

const getUserCards = (req: NextRequest, res: NextResponse, matcher: Record<string,any>) => {
  const supabase = createMiddlewareClient({req,res});

  return supabase.from("cards").select("*").match(matcher);
};

const getURL = (req: NextRequest) => {
  // get url including tenant
  let data =  req.url.split("://"); 
  const protocol = data[0] || "http";

  data = data[1]?.split("/") as string[];
  const paths = data && data.slice(1).join("/");

  const url = `${protocol}://${req.headers.get("host")}/${paths}`;
  return url;
}


export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // handle patterns for specific routes
  const handlePattern = matchUrlPattern(getURL(req));

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
    // middleware for multi tenant
    {
      pattern: new URLPattern({ hostname: (process.env.NODE_ENV === "production"? `*.${appConfig.url}`: `*.localhost`) }),
      handler:  async (req: NextRequest, res: NextResponse) => {
        const tenant = req.headers.get("host")?.split(".")[0];
        const protocol = req.url.split("://")[0];
        const originalHost = process.env.NODE_ENV === "production"? `.${appConfig.url}`: `.localhost:3000`; // adjust the port if needed.
        const profileData = await getUserCards(req,res,{username_url: `${protocol}://${tenant}${originalHost}/`});

        if (!profileData || (profileData.data && profileData.data.length === 0)) {
          return NextResponse.rewrite(new URL("/",req.url));
        } 

        return NextResponse.rewrite(new URL(`/profile/${tenant}`, req.url));
      }
    },
    {
      pattern: new URLPattern({ pathname: '/auth/*?' }),
      handler: async (req: NextRequest, res: NextResponse) => {
        const {
          data: { user },
        } = await getUser(req, res);

        // the user is logged out, so we don't need to do anything
        if (!user) {
          return;
        }

        // If user is logged in, redirect to home page.
        return NextResponse.redirect(
          new URL(pathsConfig.app.home, req.nextUrl.origin).href,
        );
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
          const signIn = pathsConfig.auth.signIn;
          const redirectPath = `${signIn}?next=${next}`;

          return NextResponse.redirect(new URL(redirectPath, origin).href);
        }

        if (next.indexOf(pathsConfig.app.builder) !== -1) {
          const cardId = next.split("/")[3]; // get card id from this path /home/user/cardId

          if (!cardId) return NextResponse.redirect(new URL(pathsConfig.app.cards, origin).href);

          try {
            const { error, data } = await getUserCards(req,res, { user_id: user.id });
            
            if (!data || data.length === 0) throw new Error();

            const card = data?.find(card => card.id === cardId);

            if (!card) throw new Error();
          } catch (e) {
            return NextResponse.redirect(new URL(pathsConfig.app.cards, origin).href);
          }
         
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