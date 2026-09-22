"use server";


import { createClientServerComponent } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/server/auth-guard";

/**
 * Applicant pipeline actions are self-service: an applicant moves their own
 * record through testing/onboarding/waitlist.
 *
 * `codevId` used to be trusted from the caller, so any caller could set another
 * user's `application_status` (e.g. push themselves or someone else to
 * "waitlist"). The codev row written is now always the signed-in user; the
 * caller's `codevId` argument must match it.
 */
async function requireSelfCodev(codevId: string): Promise<string> {
    const { user } = await requireUser();

    if (user.id !== codevId) {
        throw new Error("Forbidden");
    }

    return user.id;
}


export async function applicantTakeTest({
    applicantId,
    codevId,
}: {
    applicantId: string;
    codevId: string;
}) {
    try {
        const selfCodevId = await requireSelfCodev(codevId);
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
            .eq("id", selfCodevId);

        if (codevError) {
            console.error("Error updating codev test:", codevError);
            return undefined;
        }

        /*         revalidatePath("/applicant/waiting"); */
    } catch (error) {
        console.error("Error taking test:", error);
    }
}

/**
 * Confirms an `applicant` row belongs to the signed-in user before it is
 * written. `applicantId` arrives from the client, so without this any caller
 * could edit another applicant's fork URL or join flags.
 */
async function assertOwnApplicant(
    supabase: Awaited<ReturnType<typeof createClientServerComponent>>,
    applicantId: string,
    codevId: string,
) {
    const { data } = await supabase
        .from("applicant")
        .select("codev_id")
        .eq("id", applicantId)
        .maybeSingle();

    if (!data || data.codev_id !== codevId) {
        throw new Error("Forbidden");
    }
}

export async function applicantMoveToOnboard({
    codevId,
}: {
    codevId: string;
}) {
    try {
        const selfCodevId = await requireSelfCodev(codevId);
        const supabase = await createClientServerComponent();

        const { data: codevData, error: codevError } = await supabase
            .from("codev")
            .update({
                application_status: "onboarding",
                updated_at: new Date(),
            })
            .eq("id", selfCodevId);

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
        const { user } = await requireUser();
        const supabase = await createClientServerComponent();

        await assertOwnApplicant(supabase, applicantId, user.id);

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
        const { user } = await requireUser();
        const supabase = await createClientServerComponent();

        await assertOwnApplicant(supabase, applicantId, user.id);

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
        const { user } = await requireUser();
        const supabase = await createClientServerComponent();

        await assertOwnApplicant(supabase, applicantId, user.id);

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