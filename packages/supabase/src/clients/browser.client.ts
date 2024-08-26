import { createBrowserClient } from '@supabase/ssr';

import { getSupabaseClientKeys } from '../get-supabase-client-keys';

/**
 * @name getSupabaseBrowserClient
 * @description Get a Supabase client for use in the Browser
 */
export function getSupabaseBrowserClient() {
  const keys = getSupabaseClientKeys();

  return createBrowserClient(keys.url, keys.anonKey);
}
