"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

import { dateTimeFormat } from "@/lib/formDateTime";

export const signupUser = async (data: FieldValues) => {
    const supabase = createServerActionClient({ cookies });

    const [startTime, endTime] = data.schedule.split(" - ");
    const userData = {
        first_name: data.firstName,
        last_name: data.lastName,
        fb_link: data.facebook,
        email_address: data.email_address,
        ...(data.website !== "" && { portfolio_website: data.website }),
        tech_stacks: [...data.techstack.split(", ")],
        start_time: dateTimeFormat(startTime),
        end_time: dateTimeFormat(endTime),
        main_position: data.position,
    }

    console.log(userData);

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