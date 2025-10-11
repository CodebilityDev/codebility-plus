"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { headers } from "next/headers";

export const resetUserPassword = async (email: string) => {
    try {
        console.log("Starting password reset for:", email);

        const supabase = await createClientServerComponent();
        const headersList = await headers();
        const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_BASE_URL;
        
        console.log("Origin determined as:", origin);

        // check the user of the email
        const { data, error: userError } = await supabase
            .from("codev")
            .select()
            .eq("email_address", email)
            .single();

        if (userError) {
            console.error("Database query error:", userError);
            throw new Error(`Database error: ${userError.message}`);
        }

        if (!data) {
            console.error("User not found for email:", email);
            throw new Error("User not found");
        }

        console.log("User found:", { name: data.first_name, status: data.availability_status });

        const url = data.availability_status === "passed" 
            ? `${origin}/auth/callback?redirect_to=/home/settings/account-settings` 
            : `${origin}/auth/callback?redirect_to=/applicant/account-settings`;

        console.log("Redirect URL:", url);

        /* 
        * Send password reset email using Supabase
        * The redirectTo URL is where the user will be redirected after clicking the link in the email
        */
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: url,
        });

        if (error) {
            console.error("Supabase auth error:", error);
            throw new Error(error.message || "Failed to send reset email");
        }

        console.log("Password reset email sent successfully");

    } catch (error) {
        console.error("Error resetting password:", error);
        throw new Error(`Failed to reset password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
