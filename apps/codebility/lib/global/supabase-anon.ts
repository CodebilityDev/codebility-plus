import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import { ensureSupabaseEnv } from "@/lib/global/supabase-ensure-env";
import type { Database } from "@/types/global/supabase";

let anonClient: SupabaseClient<Database> | null = null;

export const createClientAnon = (): SupabaseClient<Database> => {
  if (anonClient) return anonClient;

  const { url, anonKey } = ensureSupabaseEnv();

  anonClient = createClient<Database>(
    url,
    anonKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  return anonClient;
};