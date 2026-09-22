import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { ensureSupabaseEnv } from "./ensure-env";

let anonClient: SupabaseClient | null = null;

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

