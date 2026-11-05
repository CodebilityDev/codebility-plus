"use server";

import { createClientServerComponent } from "@/lib/global/supabase-server";
import { toErrorMessage } from "@/utils/global/feedback";
import { headers } from "next/headers";

export const resetUserPassword = async (email: string) => {
    try {
        const normalizedEmail = email.toLowerCase().trim();
        const supabase = await createClientServerComponent();
        const headersList = await headers();
        const origin =
            headersList.get("origin") ??
            (process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : undefined) ??
            process.env.NEXT_PUBLIC_APP_BASE_URL ??
            "http://localhost:3000";

        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
            redirectTo: `${origin}/auth/callback`,
        });

        if (error) {
            console.error("Supabase auth error:", error);
            throw new Error(error.message || "Failed to send reset email");
        }

        return { success: true };
    } catch (error: unknown) {
        console.error("Error resetting password:", error);
        throw new Error(toErrorMessage(error, "Failed to reset password"));
    }
};
