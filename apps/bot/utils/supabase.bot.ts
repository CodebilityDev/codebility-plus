import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// ✅ Load .env from the bot folder (same directory as index.ts)
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseUrl.startsWith("https")) {
  console.error("❌ Invalid or missing SUPABASE_URL in .env file");
  throw new Error("SUPABASE_URL must be a valid HTTPS URL in environment variables");
}

if (!supabaseServiceRole) {
  console.error("❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env file");
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required in environment variables");
}

// ✅ Create and export Supabase client
export const supabaseBot = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

console.log("✅ Supabase bot client initialized successfully");
