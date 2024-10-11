"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

import { ApplicantsList_Types } from "./_types/applicants";

const supabase = getSupabaseServerActionClient();
const revalidate = () => revalidatePath("/home/applicants");

const toArray = (str: string) => {
  return str.split(",").map((item) => item.trim()); // Split by comma and trim spaces
};

export async function rejectAction(id: string) {
  try {
    const { error: updateCodevError } = await supabase
      .from("codev")
      .update({
        application_status: "DECLINED",
      })
      .eq("user_id", id)
      .single();

    if (updateCodevError) throw updateCodevError;

    const { error: deleteError } = await supabase
      .from("applicants")
      .delete()
      .eq("id", id)
      .single();

    if (deleteError) throw deleteError;

    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Error deleting data:", error);
    return { success: false, error: error };
  }
}

export async function approveAction(id: string) {
  try {
    const { data: applicants, error: fetchError } = await supabase
      .from("applicants")
      .select("*")
      .eq("id", id);

    if (fetchError) throw fetchError;

    const applicant = applicants[0];

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

    const { error: updateCodevError } = await supabase
      .from("codev")
      .update({
        application_status: "ACCEPTED",
      })
      .eq("user_id", id)
      .single();

    if (updateCodevError) throw updateCodevError;

    const { error: deleteError } = await supabase
      .from("applicants")
      .delete()
      .eq("id", id)
      .single();

    if (deleteError) throw deleteError;

    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Error transferring data:", error);
    return { success: false, error: error };
  }
}

export async function createAction(applicants: ApplicantsList_Types) {
  try {
    const { data: applicantExist, error: fetchError } = await supabase
      .from("applicants")
      .select("*")
      .eq("email_address", applicants?.email_address);

    if (fetchError) throw fetchError;
    if (applicantExist?.length > 0) throw "Email already exist";

    const { error: createError } = await supabase
      .from("applicants")
      .insert(applicants);

    if (createError) throw createError;

    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Error creating data:", error);
    return { success: false, error: error };
  }
}

export async function updateAction(id: string, formData: FormData) {
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const email_address = formData.get("email_address") as string;
  const github_link = formData.get("github_link") as string;
  const portfolio_website = formData.get("portfolio_website") as string;
  const tech_stacks = formData.get("tech_stacks") as any;

  try {
    const { error: updateError } = await supabase
      .from("applicants")
      .update({
        first_name: first_name,
        last_name: last_name,
        email_address: email_address,
        github_link: github_link,
        portfolio_website: portfolio_website,
        tech_stacks: toArray(tech_stacks),
      })
      .eq("id", id)
      .single();

    if (updateError) throw updateError;

    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Error updating data:", error);
    return { success: false, error: error };
  }
}
