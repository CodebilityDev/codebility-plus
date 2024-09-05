"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

import pathsConfig from "~/config/paths.config";

export const signInWithPassword = async (email: string, password: string) => {
  const supabase = getSupabaseServerActionClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  redirect(pathsConfig.app.home);
};

export const signUp = async (email: string, password: string, name: string) => {
  const supabase = getSupabaseServerActionClient();

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/callback`,
    },
  });

  if (error) throw error;
  return data.user;
};

export const signInWithOAuth = async (
  provider: "google" | "facebook" | "linkedin_oidc",
) => {
  const supabase = getSupabaseServerActionClient();

  const res = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/callback`,
    },
  });

  if (res.data.url) redirect(res.data.url);
  throw res.error;
};

export const signOut = async () => {
  const cookieStore = cookies();
  const supabase = getSupabaseServerActionClient();
  await supabase.auth.signOut();

  const supabaseProjectReferenceId = process.env
    .NEXT_PUBLIC_SUPABASE_URL!.split("://")[1]
    ?.split(".")[0];

  cookieStore.delete(`sb-${supabaseProjectReferenceId}-auth-token`); // remove supabase authentication token.

  redirect("/");
};
