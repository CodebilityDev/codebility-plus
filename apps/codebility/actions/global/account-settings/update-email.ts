"use server";

import { revalidatePath } from "next/cache";

import { authorize } from "@/lib/global/authorize";
import { createClientServerComponent } from "@/lib/global/supabase-server";

export async function updateCodevEmail(email: string) {
  const identity = await authorize("settings");
  const supabase = await createClientServerComponent();

  const { error } = await supabase
    .from("codev")
    .update({ email_address: email })
    .eq("id", identity.userId);

  if (error) {
    console.error("Error updating email in database:", error);
    return { error: "Failed to update email in database" };
  }

  revalidatePath("/home/account-settings");
  revalidatePath("/applicant/account-settings");
  revalidatePath("/home/applicants");

  return { error: null };
}
