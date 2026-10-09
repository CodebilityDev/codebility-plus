export interface SupabaseEnv {
  url: string;
  anonKey: string;
  serviceRoleKey: string | undefined;
}

export const ensureSupabaseEnv = (): SupabaseEnv => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error("Supabase environment variables missing:", {
      hasUrl: Boolean(url),
      hasKey: Boolean(anonKey),
      nodeEnv: process.env.NODE_ENV,
    });

    throw new Error(
      "Supabase environment variables not configured. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment file.",
    );
  }

  return {
    url,
    anonKey,
    serviceRoleKey: process.env.DB_SERVICE_ROLE,
  };
};
