"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

import { ApplicantsFormValues } from "./_lib/applicants-schema";
import { ApplicantsList_Types } from "./_types/applicants";

const supabase = getSupabaseServerActionClient();
const revalidate = () => revalidatePath("/home/applicants");

export async function rejectAction(email_address: string) {
  try {
    const { error: deleteError } = await supabase
      .from("applicants")
      .delete()
      .eq("email_address", email_address);

    if (deleteError) throw deleteError;

    revalidate();
    return { success: true };
  } catch (error) {
    console.error("Error deleting data:", error);
    return { success: false, error: error };
  }
}

export async function approveAction(email_address: string) {
  try {
    const { data: applicants, error: fetchError } = await supabase
      .from("applicants")
      .select("*")
      .eq("email_address", email_address);

    if (fetchError) throw fetchError;

    const { error: insertError } = await supabase
      .from("interns")
      .insert(applicants);

    if (insertError) throw insertError;

    const { error: deleteError } = await supabase
      .from("applicants")
      .delete()
      .in(
        "email_address",
        applicants.map((item) => item.email_address),
      );

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
  const tech_stacks = formData.get("tech_stacks") as string;

  try {
    const { data: applicantExist, error: fetchError } = await supabase
      .from("applicants")
      .select("*")
      .eq("email_address", email_address);

    if (fetchError) throw fetchError;
    if (applicantExist?.length > 0) throw "Email already exist";

    const { error: updateError } = await supabase
      .from("applicants")
      .update({
        first_name,
        last_name,
        email_address,
        github_link,
        portfolio_website,
        tech_stacks,
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
