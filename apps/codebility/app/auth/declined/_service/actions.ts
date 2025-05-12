"use server";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";
import { redirect } from "next/navigation";

export async function getUserData(): Promise<any> {
    try {
        const supabase = getSupabaseServerActionClient();

        const {
            data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
            redirect("/auth/sign-in");
        }

        const { data } = await supabase
            .from("codev")
            .select(`*,
                    applicant (*)
                `)
            .eq("id", session.user.id)
            .single();

        if (!data) {
            redirect("/auth/sign-in");
        }

        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

export async function reApplyAction({ user }: { user: any }) {
    try {
        const supabase = getSupabaseServerActionClient();

        const { error } = await supabase
            .from("codev")
            .update({
                application_status: "applying",
                rejected_count: (user.rejected_count || 0) + 1,
                updated_at: new Date().toISOString(),
                date_applied: new Date().toISOString(),
            })
            .eq("id", user.id);

        if (error) throw error;

        redirect("/auth/waiting");
    } catch (error) {
        console.error("Error reapplying:", error);
        throw error;
    }
}