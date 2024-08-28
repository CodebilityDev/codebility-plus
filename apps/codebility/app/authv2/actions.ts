"use server";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";
import { FieldValues } from "react-hook-form";

import { formatToUnix } from "@/lib/format-date-time";
import { redirect } from "next/navigation";

export const signupUser = async (data: FieldValues) => {
    const supabase = getSupabaseServerActionClient();

    const [startTime, endTime] = data.schedule.split(" - ");
    const userData = {
        first_name: data.firstName,
        last_name: data.lastName,
        fb_link: data.facebook,
        email_address: data.email_address,
        ...(data.website !== "" && { portfolio_website: data.website }),
        tech_stacks: [...data.techstack.split(", ")],
        start_time: formatToUnix(startTime),
        end_time: formatToUnix(endTime),
        main_position: data.position,
    }

    const { error, data: { user } } = await supabase.auth.signUp({
        email: data.email_address,
        password: data.password,
        options: {
            data: userData,
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/authv2/callback`,
        },
    });

    if (error) throw error;
    return user;
}

export const signinUser = async (email: string, password: string) => {
    const supabase = getSupabaseServerActionClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    redirect("/authv2/signin"); // will cause a reload so middleware would know the updated session.
}

export const signOut = async () => {
    const supabase = getSupabaseServerActionClient();
    await supabase.auth.signOut();
    redirect("/");
  };
  