"use server";


import { revalidatePath } from "next/cache";
import { NewApplicantType } from "./types";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClientServerComponent } from "@/utils/supabase/server";


export async function deleteApplicantAction(applicant: NewApplicantType) {
    try {
        const supabase = await createAdminClient();

        // safety measures
        if (!applicant.id) {
            throw new Error("Applicant ID is required");
        }
        if (applicant.application_status === "passed") {
            throw new Error("Cannot delete an applicant who has passed status");
        }

        // delete from codev table
        const { error } = await supabase
            .from("codev")
            .delete()
            .eq("id", applicant.id);

        if (error) {
            console.error("Error deleting applicant from codev:", error);
            throw new Error("Failed to delete applicant from codev");
        }

        //delete from auth
        const { error: authError } = await supabase.auth.admin.deleteUser(applicant.id);

        if (authError) {
            console.error("Error deleting applicant from auth:", authError);
            throw new Error("Failed to delete applicant from auth");
        }

        //revalidate the cache
        revalidatePath("/home/new-applicants");
    } catch (error) {
        console.error("Error deleting applicant:", error);
        throw new Error("Failed to delete applicant");
    }
}

export async function multipleDeleteApplicantAction(applicant: NewApplicantType[]) {
    try {
        const supabase = await createAdminClient();

        // safety measures
        if (!applicant.length) {
            throw new Error("Applicant IDs are required");
        }
        if (applicant.some(app => app.application_status === "passed")) {
            throw new Error("Cannot delete applicants who have passed status");
        }

        // delete from codev table
        const { error } = await supabase
            .from("codev")
            .delete()
            .in("id", applicant.map(app => app.id));

        if (error) {
            console.error("Error deleting applicants from codev:", error);
            throw new Error("Failed to delete applicants from codev");
        }

        //delete from auth
        // Using Promise.all to handle multiple user deletions
        const authResults = await Promise.all(
            applicant.map(async (applicant) => {
                if (!applicant.id) {
                    throw new Error("Applicant ID is required");
                }
                return supabase.auth.admin.deleteUser(applicant.id);
            })
        );

        // Check if any of the deletions failed
        const authError = authResults.find(result => result.error)?.error;

        if (authError) {
            console.error("Error deleting applicants from auth:", authError);
            throw new Error("Failed to delete applicants from auth");
        }

        revalidatePath("/home/new-applicants");
    } catch (error) {
        console.error("Error deleting applicants:", error);
        throw new Error("Failed to delete applicants");
    }
}

export async function passApplicantTestAction(applicantId: string) {
    try {
        const supabase = await createClientServerComponent();

        // update codev table
        const { error } = await supabase
            .from("codev")
            .update({
                application_status: "onboarding",
                updated_at: new Date().toISOString()
            })
            .eq("id", applicantId);

        if (error) {
            console.error("Error updating applicant status in codev:", error);
            throw new Error("Failed to update applicant status in codev");
        }

        revalidatePath("/home/new-applicants");
    } catch (error) {
        console.error("Error passing applicant test:", error);
        throw new Error("Failed to pass applicant test");
    }
}

export async function denyApplicantAction(applicantId: string) {
    try {
        const supabase = await createClientServerComponent();

        // update codev table
        const { error } = await supabase
            .from("codev")
            .update({
                application_status: "denied",
                updated_at: new Date().toISOString()
            })
            .eq("id", applicantId);

        if (error) {
            console.error("Error updating applicant status in codev:", error);
            throw new Error("Failed to update applicant status in codev");
        }

        // update rejected_count
        // Get the current rejected_count
        const { data } = await supabase
            .from("codev")
            .select("rejected_count")
            .eq("id", applicantId)
            .single();

        // Increment the rejected_count by 1
        const { error: rejectedCountError } = await supabase
            .from("codev")
            .update({
                rejected_count: (data?.rejected_count || 0) + 1,
                updated_at: new Date().toISOString()
            })
            .eq("id", applicantId);

        if (rejectedCountError) {
            console.error("Error updating rejected_count in codev:", rejectedCountError);
            throw new Error("Failed to update rejected_count in codev");
        }

        revalidatePath("/home/new-applicants");
    } catch (error) {
        console.error("Error rejecting applicant test:", error);
        throw new Error("Failed to reject applicant test");
    }
}

export async function multiplePassApplicantTestAction(applicantIds: string[]) {
    try {
        const supabase = await createClientServerComponent();

        // update codev table
        const { error } = await supabase
            .from("codev")
            .update({
                application_status: "onboarding",
                updated_at: new Date().toISOString()
            })
            .in("id", applicantIds);

        if (error) {
            console.error("Error updating applicants status in codev:", error);
            throw new Error("Failed to update applicants status in codev");
        }

        revalidatePath("/home/new-applicants");
    } catch (error) {
        console.error("Error passing multiple applicants test:", error);
        throw new Error("Failed to pass multiple applicants test");
    }
}

export async function multipleDenyApplicantAction(applicantIds: string[]) {
    try {
        const supabase = await createClientServerComponent();

        // update codev table
        const { error } = await supabase
            .from("codev")
            .update({
                application_status: "denied",
                updated_at: new Date().toISOString()
            })
            .in("id", applicantIds);

        if (error) {
            console.error("Error updating applicants status in codev:", error);
            throw new Error("Failed to update applicants status in codev");
        }

        // update rejected_count
        // Using Promise.all to handle multiple updates
        const updatePromises = applicantIds.map(async (applicantId) => {
            // Get the current rejected_count
            const { data } = await supabase
                .from("codev")
                .select("rejected_count")
                .eq("id", applicantId)
                .single();

            // Increment the rejected_count by 1
            return supabase
                .from("codev")
                .update({
                    rejected_count: (data?.rejected_count || 0) + 1,
                    updated_at: new Date().toISOString()
                })
                .eq("id", applicantId);
        }
        );

        // Wait for all updates to complete
        const results = await Promise.all(updatePromises);
        // Check for any errors
        const errorOccurred = results.some(result => result.error);
        if (errorOccurred) {
            console.error("Error updating rejected_count for multiple applicants");
            throw new Error("Failed to update rejected_count for multiple applicants");
        }

        revalidatePath("/home/new-applicants");
    } catch (error) {
        console.error("Error rejecting multiple applicants test:", error);
        throw new Error("Failed to reject multiple applicants test");
    }
}

export async function acceptApplicantAction(applicantId: string) {
    try {
        const supabase = await createClientServerComponent();

        // update codev table
        const { error } = await supabase
            .from("codev")
            .update({
                application_status: "passed",
                role_id: 4,
                updated_at: new Date().toISOString()
            })
            .eq("id", applicantId);

        if (error) {
            console.error("Error updating applicant status in codev:", error);
            throw new Error("Failed to update applicant status in codev");
        }

        revalidatePath("/home/new-applicants");
    } catch (error) {
        console.error("Error accepting applicant test:", error);
        throw new Error("Failed to accept applicant test");
    }
}

export async function multipleAcceptApplicantAction(applicantIds: string[]) {
    try {
        const supabase = await createClientServerComponent();

        // update codev table
        const { error } = await supabase
            .from("codev")
            .update({
                application_status: "passed",
                role_id: 4,
                updated_at: new Date().toISOString()
            })
            .in("id", applicantIds);

        if (error) {
            console.error("Error updating applicants status in codev:", error);
            throw new Error("Failed to update applicants status in codev");
        }

        revalidatePath("/home/new-applicants");
    } catch (error) {
        console.error("Error accepting multiple applicants test:", error);
        throw new Error("Failed to accept multiple applicants test");
    }
}

export async function moveApplicantToApplyingAction(applicantId: string) {
    try {
        const supabase = await createClientServerComponent();

        const { error } = await supabase
            .from("applicant")
            .update({
                test_taken: null,
                fork_url: null,
                updated_at: new Date().toISOString()
            })
            .eq("codev_id", applicantId);

        if (error) {
            console.error("Error updating applicant status in applicant:", error);
            throw new Error("Failed to update applicant status in applicant");
        }

        // update codev table
        const { error: CodevError } = await supabase
            .from("codev")
            .update({
                application_status: "applying",
                updated_at: new Date().toISOString()
            })
            .eq("id", applicantId);

        if (CodevError) {
            console.error("Error updating applicant status in codev:", error);
            throw new Error("Failed to update applicant status in codev");
        }

        revalidatePath("/home/new-applicants");

    } catch (error) {
        console.error("Error moving applicant to applying:", error);
        throw new Error("Failed to move applicant to applying");
    }
}

export async function multipleMoveApplicantToApplyingAction(applicantIds: string[]) {
    try {
        const supabase = await createClientServerComponent();

        const { error } = await supabase
            .from("applicant")
            .update({
                test_taken: null,
                fork_url: null,
                updated_at: new Date().toISOString()
            })
            .in("codev_id", applicantIds);

        if (error) {
            console.error("Error updating applicants status in applicant:", error);
            throw new Error("Failed to update applicants status in applicant");
        }

        // update codev table
        const { error: CodevError } = await supabase
            .from("codev")
            .update({
                application_status: "applying",
                updated_at: new Date().toISOString()
            })
            .in("id", applicantIds);

        if (CodevError) {
            console.error("Error updating applicants status in codev:", CodevError);
            throw new Error("Failed to update applicants status in codev");
        }

        revalidatePath("/home/new-applicants");
    } catch (error) {
        console.error("Error moving multiple applicants to applying:", error);
        throw new Error("Failed to move multiple applicants to applying");
    }
}

export async function moveApplicantToTestingAction(applicantId: string) {
    try {
        const supabase = await createClientServerComponent();

        const { error } = await supabase
            .from("applicant")
            .update({
                test_taken: new Date().toISOString(),
                fork_url: null,
                updated_at: new Date().toISOString()
            })
            .eq("codev_id", applicantId);

        if (error) {
            console.error("Error updating applicant status in applicant:", error);
            throw new Error("Failed to update applicant status in applicant");
        }

        // update codev table
        const { error: CodevError } = await supabase
            .from("codev")
            .update({
                application_status: "testing",
                updated_at: new Date().toISOString()
            })
            .eq("id", applicantId);

        if (CodevError) {
            console.error("Error updating applicant status in codev:", error);
            throw new Error("Failed to update applicant status in codev");
        }

        revalidatePath("/home/new-applicants");
    } catch (error) {
        console.error("Error moving applicant to testing:", error);
        throw new Error("Failed to move applicant to testing");
    }
}

export async function multipleMoveApplicantToTestingAction(applicantIds: string[]) {
    try {
        const supabase = await createClientServerComponent();;

        const { error } = await supabase
            .from("applicant")
            .update({
                test_taken: new Date().toISOString(),
                fork_url: null,
                updated_at: new Date().toISOString()
            })
            .in("codev_id", applicantIds);

        if (error) {
            console.error("Error updating applicants status in applicant:", error);
            throw new Error("Failed to update applicants status in applicant");
        }

        // update codev table
        const { error: CodevError } = await supabase
            .from("codev")
            .update({
                application_status: "testing",
                updated_at: new Date().toISOString()
            })
            .in("id", applicantIds);

        if (CodevError) {
            console.error("Error updating applicants status in codev:", CodevError);
            throw new Error("Failed to update applicants status in codev");
        }

        revalidatePath("/home/new-applicants");
    } catch (error) {
        console.error("Error moving multiple applicants to testing:", error);
        throw new Error("Failed to move multiple applicants to testing");
    }
}

export async function moveApplicantToOnboardingAction(applicantId: string) {
    try {
        const supabase = await createClientServerComponent();

        // update codev table
        const { error } = await supabase
            .from("codev")
            .update({
                application_status: "onboarding",
                updated_at: new Date().toISOString()
            })
            .eq("id", applicantId);

        if (error) {
            console.error("Error updating applicant status in codev:", error);
            throw new Error("Failed to update applicant status in codev");
        }

        revalidatePath("/home/new-applicants");
    } catch (error) {
        console.error("Error moving applicant to onboarding:", error);
        throw new Error("Failed to move applicant to onboarding");
    }
}

export async function multipleMoveApplicantToOnboardingAction(applicantIds: string[]) {
    try {
        const supabase = await createClientServerComponent();

        // update codev table
        const { error } = await supabase
            .from("codev")
            .update({
                application_status: "onboarding",
                updated_at: new Date().toISOString()
            })
            .in("id", applicantIds);

        if (error) {
            console.error("Error updating applicants status in codev:", error);
            throw new Error("Failed to update applicants status in codev");
        }

        revalidatePath("/home/new-applicants");
    } catch (error) {
        console.error("Error moving multiple applicants to onboarding:", error);
        throw new Error("Failed to move multiple applicants to onboarding");
    }
}