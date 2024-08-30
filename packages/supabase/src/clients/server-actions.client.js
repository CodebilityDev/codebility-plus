"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupabaseServerActionClient = getSupabaseServerActionClient;
require("server-only");
var cache_1 = require("next/cache");
var headers_1 = require("next/headers");
var auth_helpers_nextjs_1 = require("@supabase/auth-helpers-nextjs");
function createServerSupabaseClient() {
    return (0, auth_helpers_nextjs_1.createServerActionClient)({ cookies: headers_1.cookies });
}
function getSupabaseServerActionClient() {
    // prevent any caching (to be removed in Next v15)
    (0, cache_1.unstable_noStore)();
    return createServerSupabaseClient();
}
