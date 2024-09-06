import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import pathsConfig from "~/config/paths.config";
import { getSupabaseRouteHandlerClient } from "@codevs/supabase/route-handler-client";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = getSupabaseRouteHandlerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(
    new URL(pathsConfig.app.home, process.env.NEXT_PUBLIC_APP_BASE_URL),
  );
}
