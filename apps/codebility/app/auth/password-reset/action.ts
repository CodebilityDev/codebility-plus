"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { headers } from "next/headers";

export const resetUserPassword = async (email: string) => {
    try {

        const supabase =  await createClientServerComponent();
        const origin = (await headers()).get("origin");

        // check the user of the email
        const { data } = await supabase
            .from("codev")
            .select()
            .eq("email_address", email)
            .single();

        if (!data) {
            console.error("User not found");
            throw new Error("User not found");
        }

        const url = data.availability_status === "passed" ? `${origin}/auth/callback?redirect_to=/home/settings/account-settings` : `${origin}/auth/callback?redirect_to=/applicant/account-settings`;

        /* 
        * Send password reset email using Supabase
        * The redirectTo URL is where the user will be redirected after clicking the link in the email
        */
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: url,
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
