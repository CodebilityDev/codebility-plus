import { createClient } from "@supabase/supabase-js";
import { getSupabaseClientKeys } from "../get-supabase-client-keys";
const keys = getSupabaseClientKeys();
const client = createClient(keys.url, keys.anonKey);
/**
 * @name getSupabaseBrowserClient
 * @description Get a Supabase client for use in the Browser
 */
export function getSupabaseBrowserClient() {
    return client;
}
