import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import { ensureSupabaseEnv } from "@/lib/global/supabase-ensure-env";
import type { Database } from "@/types/global/supabase";

let anonClient: SupabaseClient<Database> | null = null;

export const createClientAnon = (): SupabaseClient<Database> => {
  if (anonClient) return anonClient;

  ensureSupabaseEnv();

  anonClient = createClient<Database>(
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