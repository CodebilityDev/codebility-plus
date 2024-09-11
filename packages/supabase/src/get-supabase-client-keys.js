"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupabaseClientKeys = getSupabaseClientKeys;
var zod_1 = require("zod");
/**
 * Returns and validates the Supabase client keys from the environment.
 */
function getSupabaseClientKeys() {
    return zod_1.z
        .object({
        url: zod_1.z.string().min(1),
        anonKey: zod_1.z.string().min(1),
    })
        .parse({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
}
