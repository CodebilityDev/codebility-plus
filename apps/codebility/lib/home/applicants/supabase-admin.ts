"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { ensureSupabaseEnv } from "@/lib/global/supabase-ensure-env";

export const createAdminClient = async () => {
  const { url, serviceRoleKey } = ensureSupabaseEnv();

  const cookieStore = await cookies();

  return createServerClient(
    url,
    serviceRoleKey ?? "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have a proxy refreshing
            // user sessions.
          }
        },
      },
    },
  );
};
