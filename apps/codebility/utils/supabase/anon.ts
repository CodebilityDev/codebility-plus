import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { ensureSupabaseEnv } from "./ensure-env";

let anonClient: SupabaseClient | null = null;

/**
 * Cookie-less anon client for server-side/public reads.
 *
 * ponytail: Singleton only. No unbounded growth because this module stores
 * exactly one client instance.
 */
export const createClientAnon = (): SupabaseClient => {
  if (anonClient) return anonClient;

  ensureSupabaseEnv();

  anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  return anonClient;
};

