"use server";

import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export const loginWithPassword = async (email: string, password: string) => {
    const supabase = createServerActionClient({ cookies });
  
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) throw error;
    redirect("/dashboard")
};  
  
export const register = async (email: string, password: string, name: string) => {
    const supabase = createServerActionClient({ cookies });

    const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
        data: {
            full_name: name
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/callback`,
        },
    });

    if (error) throw error;
    return data.user;
};

export const loginWithOAuth = async (provider: 'google' | 'github') => {
  const supabase = createServerActionClient({ cookies });

  const res = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/callback`},
  });
  console.log(res.data.url);
  if (res.data.url) redirect(res.data.url);
  throw res.error;
};

export const logOut = async () => {
  const supabase = createServerActionClient({ cookies });
  await supabase.auth.signOut();
  redirect("/");
};
