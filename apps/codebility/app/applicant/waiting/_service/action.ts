
"use server";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";
import { revalidatePath } from "next/cache";
import { applicantSchema, ApplicantType } from "./type";


export async function getApplicantData(applicantId: string): Promise<ApplicantType | undefined> {
    try {
        const supabase = getSupabaseServerActionClient();

        if (!applicantId) {
            console.error("Applicant ID is required");
            return undefined;
        }

        const { data, error } = await supabase
            .from("applicant")
            .select("*")
            .eq("id", applicantId)
            .single();

        if (error) {
            console.error("Error fetching applicant data:", error);
            return undefined;
        }

        if (!data) {
            console.error("No applicant data found");
            return undefined;
        }

        const parsedData = applicantSchema.safeParse(data);

        if (!parsedData.success) {
            console.error("Error parsing applicant data:", parsedData.error);
            return undefined;
        }

        return parsedData.data;
    } catch (error) {
        console.error("Error fetching applicant data:", error);
        return undefined;
    }
}

export async function applicantTakeTest(applicantId: string) {
    try {
        const supabase = getSupabaseServerActionClient();

        const { data, error } = await supabase
            .from("applicant")
            .update({
                test_taken: new Date(),
                test_status: "pending",
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