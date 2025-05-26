"use client";

import { createBrowserClient } from "@supabase/ssr";

export const createClientClientComponent = () => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    throw new Error(
      "createClientClientComponent should only be called on the client side",
    );
  }

  // Check if environment variables exist
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

// Alternative safe version that returns null instead of throwing errors
export const createClientClientComponentSafe = () => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    console.warn("createClientClientComponent called on server side");
    return null;
  }

  // Check if environment variables exist
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase environment variables");
    return null;
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    return null;
  }
};
