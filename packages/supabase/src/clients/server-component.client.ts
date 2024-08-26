import 'server-only';

import { cookies } from "next/headers";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * @name getSupabaseServerComponentClient
 * @description Get a Supabase client for use in the Server Components
 */
export function getSupabaseServerComponentClient() {
    return createServerComponentClient({ cookies });
}