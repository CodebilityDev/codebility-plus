"use server";

import { revalidatePath } from "next/cache";
import { getCodevs } from "@/lib/server/codev.service";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

const supabase = getSupabaseServerActionClient();
const revalidate = () => revalidatePath("/home/applicants");

// Reject an applicant permanently
export async function rejectAction(id: string) {
  try {
    // Fetch the applicant's current data
    const { data: applicant, error: fetchError } = await supabase
      .from("codev")
      .select("rejected_count")
      .eq("id", id)
      .single();

    if (fetchError || !applicant) throw fetchError;

    // Update the applicant's application_status and increment rejected_count
    const { error: updateError } = await supabase
      .from("codev")
      .update({
        application_status: "rejected",
        rejected_count: (applicant.rejected_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw updateError;

    // Revalidate the cache
    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Error rejecting applicant:", error);
    return { success: false, error };
  }
}

// Deny an applicant (can reapply later)
export async function denyAction(id: string) {
  try {
    const { error: updateError } = await supabase
      .from("codev")
      .update({
        application_status: "denied",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw updateError;

    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Error denying applicant:", error);
    return { success: false, error };
  }
}

// Move applicant to testing phase (after sending assessment)
export async function moveToTestingAction(id: string) {
  try {
    const { error: updateError } = await supabase
      .from("codev")
      .update({
        application_status: "testing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw updateError;

    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Error moving applicant to testing:", error);
    return { success: false, error };
  }
}

// Move applicant to onboarding (passed assessment)
export async function moveToOnboardingAction(id: string) {
  try {
    const { error: updateError } = await supabase
      .from("codev")
      .update({
        application_status: "onboarding",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw updateError;

    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Error moving applicant to onboarding:", error);
    return { success: false, error };
  }
}

// Approve an applicant (final acceptance)
export async function approveAction(id: string) {
  try {
    // Update the applicant's application_status to "passed"
    const { error: updateError } = await supabase
      .from("codev")
      .update({
        application_status: "passed",
        role_id: 4,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw updateError;

    // Revalidate the cache
    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Error approving applicant:", error);
    return { success: false, error };
  }
}

export async function updateAction(id: string, formData: FormData) {
  try {
    const updateData = {
      first_name: formData.get("first_name")?.toString().trim(),
      last_name: formData.get("last_name")?.toString().trim(),
      email_address: formData.get("email_address")?.toString().trim(),
      github: formData.get("github_link")?.toString().trim() || null,
      portfolio_website:
        formData.get("portfolio_website")?.toString().trim() || null,
      tech_stacks: formData
        .get("tech_stacks")
        ?.toString()
        .split(",")
        .map((item) => item.trim()),
    };

    // Validate required fields
    if (
      !updateData.first_name ||
      !updateData.last_name ||
      !updateData.email_address
    ) {
      throw new Error("Required fields missing");
    }

    const { error } = await supabase
      .from("codev")
      .update(updateData)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/home/applicants");
    return { success: true };
  } catch (error) {
    console.error("Error updating applicant:", error);
    return { success: false, error };
  }
}

// Fetch applicants for all statuses
export async function fetchApplicants() {
  try {
    // Modified to fetch all applicants with role_id 7, regardless of status
    const { data, error } = await getCodevs({
      filters: { role_id: 7 },
    });

    if (error) throw new Error(error);
    return { applicants: data || [], error: null };
  } catch (err) {
    return { applicants: [], error: "Unable to fetch applicants" };
  }
}
