"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupabaseBrowserClient = getSupabaseBrowserClient;
var supabase_js_1 = require("@supabase/supabase-js");
var get_supabase_client_keys_1 = require("../get-supabase-client-keys");
/**
 * @name getSupabaseBrowserClient
 * @description Get a Supabase client for use in the Browser
 */
function getSupabaseBrowserClient() {
    var keys = (0, get_supabase_client_keys_1.getSupabaseClientKeys)();
    return (0, supabase_js_1.createClient)(keys.url, keys.anonKey);
}
