"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupabaseServerComponentClient = getSupabaseServerComponentClient;
require("server-only");
var headers_1 = require("next/headers");
var auth_helpers_nextjs_1 = require("@supabase/auth-helpers-nextjs");
var cache_1 = require("next/cache");
/**
 * @name getSupabaseServerComponentClient
 * @description Get a Supabase client for use in the Server Components
 */
function getSupabaseServerComponentClient() {
    // prevent any caching (to be removed in Next v15)
    (0, cache_1.unstable_noStore)();
    return (0, auth_helpers_nextjs_1.createServerComponentClient)({ cookies: headers_1.cookies });
}
