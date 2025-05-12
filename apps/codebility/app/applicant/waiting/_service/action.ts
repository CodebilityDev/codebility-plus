
"use server";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";
import { revalidatePath } from "next/cache";

export async function applicantTakeTest(applicantId: string) {
    try {
        const supabase = getSupabaseServerActionClient();

        const { data, error } = await supabase
            .from("applicant")
            .update({
                test_taken: new Date(),
                updated_at: new Date(),
            })
            .eq("id", applicantId);

        if (error) {
            console.error("Error updating applicant test:", error);
            return undefined;
        }

        revalidatePath("/applicant/waiting");
    } catch (error) {
        console.error("Error taking test:", error);
    }
}

export async function applicantSubmitTest({
    applicantId,
    forkUrl,
}: {
    applicantId: string;
    forkUrl: string;
}) {
    try {
        const supabase = getSupabaseServerActionClient();

        const { data, error } = await supabase
            .from("applicant")
            .update({
                fork_url: forkUrl,
                updated_at: new Date(),
            })
            .eq("id", applicantId);

        if (error) {
            console.error("Error updating applicant test:", error);
            return undefined;
        }

        revalidatePath("/applicant/waiting");
    } catch (error) {
        console.error("Error submitting test:", error);
    }
}