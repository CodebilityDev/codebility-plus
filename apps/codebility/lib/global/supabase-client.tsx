"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/global/supabase";

let browserClient: SupabaseClient<Database> | null = null;

export const createClientClientComponent = () => {
  if (typeof window === "undefined") return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return null;

  browserClient ??= createBrowserClient<Database, "public">(supabaseUrl, supabaseAnonKey);
  
  return browserClient;
};

export function getClientSupabase(): SupabaseClient<Database> {
  const client = createClientClientComponent();
  if (!client) {
    throw new Error("Supabase client is not available");
  }
  return client;
}