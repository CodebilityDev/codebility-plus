"use server";

import { revalidatePath } from "next/cache";
import { Codev } from "@/types/home/codev";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

const supabase = getSupabaseServerActionClient();

const revalidate = () => revalidatePath("/home/applicants");

const toArray = (str: string) => str.split(",").map((item) => item.trim());

export async function rejectAction(id: string) {
  try {
    const { data: applicant, error: fetchError } = await supabase
      .from("codev")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !applicant) throw fetchError;

    const { error: insertError } = await supabase
      .from("declined_applicants")
      .insert({
        user_id: applicant.id,
        first_name: applicant.first_name,
        last_name: applicant.last_name,
        email: applicant.email_address,
        portfolio_website: applicant.portfolio_website,
        github_link: applicant.github_link,
        tech_stacks: applicant.tech_stacks,
        image_url: applicant.image_url,
      });

    if (insertError) throw insertError;

    const { error: updateError } = await supabase
      .from("codev")
      .update({ application_status: "DECLINED" })
      .eq("id", id);

    if (updateError) throw updateError;

    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Error rejecting applicant:", error);
    return { success: false, error: error };
  }
}

export async function approveAction(id: string) {
  try {
    const { data: applicant, error: fetchError } = await supabase
      .from("codev")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !applicant) throw fetchError;

    const { error: insertError } = await supabase.from("interns").insert({
      user_id: applicant.id,
      first_name: applicant.first_name,
      last_name: applicant.last_name,
      email_address: applicant.email_address,
      github_link: applicant.github_link,
      portfolio_website: applicant.portfolio_website,
      tech_stacks: applicant.tech_stacks,
    });

    if (insertError) throw insertError;

    const { error: updateError } = await supabase
      .from("codev")
      .update({ application_status: "ACCEPTED" })
      .eq("id", id);

    if (updateError) throw updateError;

    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Error approving applicant:", error);
    return { success: false, error: error };
  }
}

export async function createAction(applicant: Codev) {
  try {
    const { data: existingApplicant, error: fetchError } = await supabase
      .from("codev")
      .select("email_address")
      .eq("email_address", applicant.email_address)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
    if (existingApplicant) throw new Error("Email already exists");

    const { error: insertError } = await supabase
      .from("codev")
      .insert(applicant);
    if (insertError) throw insertError;

    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Error creating applicant:", error);
    return { success: false, error: error };
  }
}

export async function updateAction(id: string, formData: FormData) {
  try {
    const updatedData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email_address: formData.get("email_address") as string,
      github_link: formData.get("github_link") as string,
      portfolio_website: formData.get("portfolio_website") as string,
      tech_stacks: toArray(formData.get("tech_stacks") as string),
    };

    const { error: updateError } = await supabase
      .from("codev")
      .update(updatedData)
      .eq("id", id);
    if (updateError) throw updateError;

    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Error updating applicant:", error);
    return { success: false, error: error };
  }
}
