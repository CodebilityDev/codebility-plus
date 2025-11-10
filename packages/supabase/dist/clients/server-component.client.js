import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
/**
 * @name getSupabaseServerComponentClient
 * @description Get a Supabase client for use in the Server Components
 */
export function getSupabaseServerComponentClient() {
    // prevent any caching (to be removed in Next v15)
    noStore();
    return createServerComponentClient({ cookies });
}
