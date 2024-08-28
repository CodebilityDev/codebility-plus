import { createClient } from "@supabase/supabase-js";

import { getSupabaseClientKeys } from '../get-supabase-client-keys';

/**
 * @name getSupabaseBrowserClient
 * @description Get a Supabase client for use in the Browser
 */
export function getSupabaseBrowserClient() {
  const keys = getSupabaseClientKeys();

  return createClient(keys.url, keys.anonKey);
}
