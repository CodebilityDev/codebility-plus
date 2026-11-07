"use server";
import { CACHE_TAGS } from "@/lib/global/cache-tags";

import { AuthorizationError, requireIdentity } from "@/lib/global/authorize";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import { revalidatePath, updateTag } from "next/cache";

export async function applicantTakeTest({
    applicantId,
    codevId,
}: {
    applicantId: string;
    codevId: string;
}) {
    const identity = await requireIdentity();

    if (codevId !== identity.userId) {
        throw new AuthorizationError("forbidden", "Forbidden");
    }

    try {
        const supabase = await createClientServerComponent();

        const { error } = await supabase
            .from("applicant")
            .update({
                test_taken: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq("id", applicantId)
            .eq("codev_id", identity.userId);

        if (error) {
            console.error("Error updating applicant test:", error);
            return undefined;
        }


        const { error: codevError } = await supabase
            .from("codev")
            .update({
                application_status: "testing",
                updated_at: new Date().toISOString(),
            })
            .eq("id", identity.userId);

        if (codevError) {
            console.error("Error updating codev test:", codevError);
            return undefined;
        }

        revalidatePath("/applicant/waiting");
        updateTag(CACHE_TAGS.applicants);
    } catch (error) {
        if (error instanceof AuthorizationError) throw error;
        console.error("Error taking test:", error);
    }
}

const PRIORITY_POSITIONS = ["QA Engineer", "Project Manager", "Admin", "Marketing"];

export async function applicantMoveToOnboard({
    codevId,
}: {
    codevId: string;
}) {
    const identity = await requireIdentity();

    if (codevId !== identity.userId) {
        throw new AuthorizationError("forbidden", "Forbidden");
    }

    const supabase = await createClientServerComponent();

    const { data: profile, error: profileError } = await supabase
        .from("codev")
        .select("application_status, display_position")
        .eq("id", identity.userId)
        .single();

    if (profileError || !profile) {
        throw new AuthorizationError("forbidden", "Forbidden: profile not found");
    }

    if (!PRIORITY_POSITIONS.includes(profile.display_position ?? "")) {
        throw new AuthorizationError(
            "forbidden",
            "Forbidden: this position must take the assessment",
        );
    }

    if (profile.application_status === "applying") {
        const { error: testingError } = await supabase
            .from("codev")
            .update({
                application_status: "testing",
                updated_at: new Date().toISOString(),
            })
            .eq("id", identity.userId);

        if (testingError) {
            throw testingError;
        }
    }

    const { error: codevError } = await supabase
        .from("codev")
        .update({
            application_status: "onboarding",
            updated_at: new Date().toISOString(),
        })
        .eq("id", identity.userId);

    if (codevError) {
        throw codevError;
    }

    revalidatePath("/applicant/waiting");
    updateTag(CACHE_TAGS.applicants);
}

export async function applicantSubmitTest({
    applicantId,
    forkUrl,
}: {
    applicantId: string;
    forkUrl: string;
}) {
    const identity = await requireIdentity();

    try {
        const supabase = await createClientServerComponent();

        const { error } = await supabase
            .from("applicant")
            .update({
                fork_url: forkUrl,
                updated_at: new Date().toISOString(),
            })
            .eq("id", applicantId)
            .eq("codev_id", identity.userId);

        if (error) {
            console.error("Error updating applicant test:", error);
            return undefined;
        }

        revalidatePath("/applicant/waiting");
        updateTag(CACHE_TAGS.applicants);
    } catch (error) {
        if (error instanceof AuthorizationError) throw error;
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
    const identity = await requireIdentity();

    try {
        const supabase = await createClientServerComponent();

        const { error } = await supabase
            .from("applicant")
            .update({
                fork_url: forkUrl,
                updated_at: new Date().toISOString(),
            })
            .eq("id", applicantId)
            .eq("codev_id", identity.userId);

        if (error) {
            console.error("Error updating applicant test submission:", error);
            return undefined;
        }

        revalidatePath("/applicant/waiting");
        updateTag(CACHE_TAGS.applicants);
    } catch (error) {
        if (error instanceof AuthorizationError) throw error;
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
    const identity = await requireIdentity();

    try {
        const supabase = await createClientServerComponent();

        const updateData: {
            updated_at: string;
            joined_discord?: boolean;
            joined_messenger?: boolean;
        } = {
            updated_at: new Date().toISOString(),
        };

        if (joinedDiscord !== undefined) {
            updateData.joined_discord = joinedDiscord;
        }
        
        if (joinedMessenger !== undefined) {
            updateData.joined_messenger = joinedMessenger;
        }

        const { error } = await supabase
            .from("applicant")
            .update(updateData)
            .eq("id", applicantId)
            .eq("codev_id", identity.userId);

        if (error) {
            console.error("Error updating applicant joined status:", error);
            return undefined;
        }

        revalidatePath("/applicant/waiting");
        updateTag(CACHE_TAGS.applicants);
    } catch (error) {
        if (error instanceof AuthorizationError) throw error;
        console.error("Error updating joined status:", error);
    }
}