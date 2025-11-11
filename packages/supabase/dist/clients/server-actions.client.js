import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
function createServerSupabaseClient() {
    return createServerActionClient({ cookies });
}
export function getSupabaseServerActionClient() {
    // prevent any caching (to be removed in Next v15)
    noStore();
    return createServerSupabaseClient();
}
