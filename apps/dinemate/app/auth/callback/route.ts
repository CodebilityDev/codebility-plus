import { createRoute } from "~/utils/supabase"
import { NextResponse } from "next/server"

import pathsConfig from '~/config/paths.config';
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRoute()
    await supabase.auth.exchangeCodeForSession(code)
  }
  
  return NextResponse.redirect(new URL(pathsConfig.app.dashboard, process.env.NEXT_PUBLIC_APP_BASE_URL));
}