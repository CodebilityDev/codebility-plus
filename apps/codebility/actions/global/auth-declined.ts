"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClientServerComponent } from "@/lib/global/supabase-server";
import type { WaitingUser } from "@/types/global/waiting-user";

export async function getUserData(): Promise<WaitingUser | null> {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/sign-in");
  }

  const { data } = await supabase
    .from("codev")
    .select(
      "id, first_name, display_position, application_status, rejected_count, date_applied, applicant(id, codev_id, test_taken, fork_url, joined_discord, joined_messenger, created_at, updated_at)",
    )
    .eq("id", user.id)
    .single();

  if (!data) {
    redirect("/auth/sign-in");
  }

  return data;
}

export async function reApplyAction() {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: current } = await supabase
    .from("codev")
    .select("rejected_count")
    .eq("id", user.id)
    .maybeSingle();

  const { error } = await supabase
    .from("codev")
    .update({
      application_status: "applying",
      rejected_count: (current?.rejected_count ?? 0) + 1,
      updated_at: new Date().toISOString(),
      date_applied: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error reapplying:", error);
    throw error;
  }

  revalidatePath("/home/applicants");
  revalidatePath("/auth/declined");

  redirect("/auth/waiting");
}
