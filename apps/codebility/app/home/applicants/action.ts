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
