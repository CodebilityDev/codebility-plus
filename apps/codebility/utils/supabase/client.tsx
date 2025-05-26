"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

export const createClientClientComponent = () => {
  // Create client immediately for first render
  const [supabase] = useState(() => 
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  );

  return supabase;
};

/* // Original function for backwards compatibility
export const createClientClientComponent = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
 */