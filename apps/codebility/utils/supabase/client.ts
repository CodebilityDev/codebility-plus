import { createBrowserClient } from "@supabase/ssr";

export const createClientClientComponent = () => {
  // Check if environment variables exist
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are not set in client component creation.");
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );

}
  