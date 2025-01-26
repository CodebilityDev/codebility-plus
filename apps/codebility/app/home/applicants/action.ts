"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

const supabase = getSupabaseServerActionClient();
const revalidate = () => revalidatePath("/home/applicants");

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

export async function approveAction(id: string) {
  try {
    // Update the applicant's application_status to "ACCEPTED"
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
