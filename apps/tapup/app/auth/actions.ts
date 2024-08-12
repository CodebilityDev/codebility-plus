"use server";

import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export const signInWithPassword = async (email: string, password: string) => {
    const supabase = createServerActionClient({ cookies });
  
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) throw error;
    redirect("/")
  };
  
export const signUp = async (email: string, password: string, name: string) => {
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

export const signOut = async () => {
  const supabase = createServerActionClient({ cookies });
  await supabase.auth.signOut();
  redirect("/");
};
