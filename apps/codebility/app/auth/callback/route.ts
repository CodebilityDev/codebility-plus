import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
      await supabase.auth.exchangeCodeForSession(code);
      // After verification, redirect to waiting page
      return NextResponse.redirect(new URL("/auth/waiting", requestUrl.origin));
    } catch (error) {
      console.error("Auth error:", error);
      return NextResponse.redirect(new URL("/auth/sign-in", requestUrl.origin));
    }
  }

  // No code present, redirect to sign in
  return NextResponse.redirect(new URL("/auth/sign-in", requestUrl.origin));
}
