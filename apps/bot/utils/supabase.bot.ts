import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// ✅ Load .env from the bot folder (same directory as index.ts)
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.DB_SERVICE_ROLE;

// Validate environment variables
if (!supabaseUrl || !supabaseUrl.startsWith("https")) {
  console.error("❌ Invalid or missing NEXT_PUBLIC_SUPABASE_URL in .env file");
  throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL in environment variables");
}

if (!supabaseServiceRole) {
  console.error("❌ Missing DB_SERVICE_ROLE in .env file");
  throw new Error("DB_SERVICE_ROLE is required in environment variables");
}

// ✅ Create and export Supabase client
export const supabaseBot = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

console.log("✅ Supabase bot client initialized successfully");
