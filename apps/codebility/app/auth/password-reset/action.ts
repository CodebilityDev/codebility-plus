"use server";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";
import { headers } from "next/headers";

export const resetUserPassword = async (email: string) => {
    try {

        const supabase = getSupabaseServerActionClient();
        const origin = (await headers()).get("origin");


        /* 
        * Send password reset email using Supabase
        * The redirectTo URL is where the user will be redirected after clicking the link in the email
        */
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin}/auth/callback?redirect_to=/home/settings/account-settings`,
        });

        if (error) {
            console.error("Error resetting password:", error);
            throw new Error(error.message || "Failed to send reset email");
        }

    } catch (error) {
        console.error("Error resetting password:", error);
        throw new Error("Failed to reset password");
    }
};
