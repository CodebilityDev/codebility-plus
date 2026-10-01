"use server";

import { revalidatePath } from "next/cache";

import { createClientServerComponent } from "@/lib/global/supabase-server";

export async function updateCodevEmail(email: string) {
  const supabase = await createClientServerComponent();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not found" };
  }

  const { error } = await supabase
    .from("codev")
    .update({ email_address: email })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating email in database:", error);
    return { error: "Failed to update email in database" };
  }

  revalidatePath("/home/account-settings");
  revalidatePath("/applicant/account-settings");
  revalidatePath("/home/applicants");

  return { error: null };
}
