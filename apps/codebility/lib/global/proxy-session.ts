import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ensureSupabaseEnv } from "@/lib/global/supabase-ensure-env";
import type { Database } from "@/types/global/supabase";

export type ProxyClient = ReturnType<typeof createProxyClient>;

export function createProxyClient(request: NextRequest) {
  const { url, anonKey } = ensureSupabaseEnv();
  const state = { response: NextResponse.next({ request }) };

  const supabase = createServerClient<Database, "public">(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        state.response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          state.response.cookies.set(name, value, options);
        }
      },
    },
  });

  return { supabase, state };
}

export function passThrough(client: ProxyClient) {
  return client.state.response;
}

export function redirectTo(
  client: ProxyClient,
  request: NextRequest,
  pathname: string,
  from?: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  if (from) url.searchParams.set("from", from);

  const redirect = NextResponse.redirect(url);
  for (const cookie of client.state.response.cookies.getAll()) {
    redirect.cookies.set(cookie);
  }
  return redirect;
}
