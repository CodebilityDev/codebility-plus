
"use server";


import { createClientServerComponent } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";


export async function applicantTakeTest({
    applicantId,
    codevId,
}: {
    applicantId: string;
    codevId: string;
}) {
    try {
        const supabase = await createClientServerComponent();

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


        const { data: codevData, error: codevError } = await supabase
            .from("codev")
            .update({
                application_status: "testing",
                updated_at: new Date(),
            })
            .eq("id", codevId);

        if (codevError) {
            console.error("Error updating codev test:", codevError);
            return undefined;
        }

        /*         revalidatePath("/applicant/waiting"); */
    } catch (error) {
        console.error("Error taking test:", error);
    }
}

export async function applicantMoveToOnboard({
    codevId,
}: {
    codevId: string;
}) {
    try {
        const supabase = await createClientServerComponent();

        const { data: codevData, error: codevError } = await supabase
            .from("codev")
            .update({
                application_status: "onboarding",
                updated_at: new Date(),
            })
            .eq("id", codevId);

        if (codevError) {
            console.error("Error updating codev test:", codevError);
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
        const supabase = await createClientServerComponent();

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

export async function applicantUpdateTestSubmission({
    applicantId,
    forkUrl,
}: {
    applicantId: string;
    forkUrl: string;
}) {
    try {
        const supabase = await createClientServerComponent();

        const { data, error } = await supabase
            .from("applicant")
            .update({
                fork_url: forkUrl,
                updated_at: new Date(),
            })
            .eq("id", applicantId);

        if (error) {
            console.error("Error updating applicant test submission:", error);
            return undefined;
        }

        revalidatePath("/applicant/waiting");
    } catch (error) {
        console.error("Error updating test submission:", error);
    }
}

export async function applicantUpdateJoinedStatus({
    applicantId,
    joinedDiscord,
    joinedMessenger,
}: {
    applicantId: string;
    joinedDiscord?: boolean;
    joinedMessenger?: boolean;
}) {
    try {
        const supabase = await createClientServerComponent();

        const updateData: any = {
            updated_at: new Date(),
        };

        if (joinedDiscord !== undefined) {
            updateData.joined_discord = joinedDiscord;
        }
        
        if (joinedMessenger !== undefined) {
            updateData.joined_messenger = joinedMessenger;
        }

        const { data, error } = await supabase
            .from("applicant")
            .update(updateData)
            .eq("id", applicantId);

        if (error) {
            console.error("Error updating applicant joined status:", error);
            return undefined;
        }

        revalidatePath("/applicant/waiting");
    } catch (error) {
        console.error("Error updating joined status:", error);
    }
}