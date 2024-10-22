"use server";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";
import { revalidatePath } from "next/cache";

export const createNewBoard = async (formData: FormData) => {
  const supabase = getSupabaseServerActionClient();
  const { data, error } = await supabase.from("board").insert({
    name: formData.get("name"),
    project_id: formData.get("projectId"),
  });

  if (error) {
    console.log("Error creating board: ", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/home/kanban")
  return { success: true, data }
};
