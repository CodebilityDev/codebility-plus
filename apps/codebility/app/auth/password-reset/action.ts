"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { headers } from "next/headers";

export const resetUserPassword = async (email: string) => {
    try {
        const normalizedEmail = email.toLowerCase().trim();
        const supabase = await createClientServerComponent();
        const headersList = await headers();
        const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_BASE_URL;

        if (!origin) {
            console.error("Password reset error: missing origin header or NEXT_PUBLIC_APP_BASE_URL");
            throw new Error("Unable to determine application URL for password reset");
        }

        // Check user record by email
        const { data, error: userError } = await supabase
            .from("codev")
            .select("id, application_status")
            .eq("email_address", normalizedEmail)
            .maybeSingle();

        if (userError) {
            console.error("Database query error:", userError);
            throw new Error(`Database error: ${userError.message}`);
        }

        // Close user-enumeration leak: return success even if user not found
        if (!data) {
            console.warn("Password reset requested for non-existent email:", normalizedEmail);
            return { success: true };
        }

        // Determine redirect destination after magic link callback
        const isPassed = data.application_status === "passed";
        const url = isPassed 
            ? `${origin}/auth/callback?redirect_to=/home/account-settings` 
            : `${origin}/auth/callback?redirect_to=/applicant/waiting`;

        // Send password reset email using Supabase Auth
        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
            redirectTo: url,
        });

        if (error) {
            console.error("Supabase auth error:", error);
            throw new Error(error.message || "Failed to send reset email");
        }

        return { success: true };
    } catch (error: any) {
        console.error("Error resetting password:", error);
        throw new Error(error.message || "Failed to reset password");
    }
};
