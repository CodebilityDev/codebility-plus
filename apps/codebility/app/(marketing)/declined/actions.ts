"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";
import { DeclinedApplicant } from "./_types";

export const reapply = async (data: DeclinedApplicant) => {
  const supabase = getSupabaseServerActionClient();

  const { error: insertError } = await supabase.from("applicants").insert({
    id: data.user_id,
    first_name: data.first_name,
    last_name: data.last_name,
    email_address: data.email,
    portfolio_website: data.portfolio_website,
    github_link: data.github_link,
    tech_stacks: data.tech_stacks,
    image_url: data.image_url,
  });

  if (insertError) {
    console.log("Error inserting applicants: ", insertError.message);
    return { success: false, error: insertError.message };
  }

  const { error: updateCodevError } = await supabase
    .from("codev")
    .update({
      application_status: "PENDING",
    })
    .eq("user_id", data.user_id)
    .single();

  if (updateCodevError) {
    console.log("Error updating applicants: ", updateCodevError.message);
    return { success: false, error: updateCodevError.message };
  }

  const { error: deleteError } = await supabase
    .from("declined_applicants")
    .delete()
    .eq("id", data.id)
    .single();

  if (deleteError) {
    console.log("Error deleting applicants: ", deleteError.message);
    return { success: false, error: deleteError.message };
  }

  revalidatePath("/declined");
  return { success: true };
};
