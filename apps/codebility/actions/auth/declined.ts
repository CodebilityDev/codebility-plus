"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function getUserData(): Promise<any> {
    try {
        const supabase = await createClientServerComponent();

        // FIXED: Use getUser() instead of getSession()
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            redirect("/auth/sign-in");
        }

        const { data } = await supabase
            .from("codev")
            .select(`*,
                    applicant (*)
                `)
            .eq("id", user.id)
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
        const supabase = await createClientServerComponent();

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