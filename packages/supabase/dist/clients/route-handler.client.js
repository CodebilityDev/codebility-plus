import 'server-only';
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { getSupabaseClientKeys } from '../get-supabase-client-keys';
const keys = getSupabaseClientKeys();
/**
 * @name getSupabaseRouteHandlerClient
 * @description Get a Supabase client for use in the Route Handler Routes
 */
export function getSupabaseRouteHandlerClient() {
    // prevent any caching (to be removed in Next v15)
    noStore();
    return createRouteHandlerClient({ cookies });
}
