"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";



interface CreateBoardResult {
  success: boolean;
  error?: string;
  data?: any;
}

export const createNewBoard = async (
  formData: FormData,
): Promise<CreateBoardResult> => {
  const supabase = await createClientServerComponent();

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();

  if (!name) {
    return { success: false, error: "Board name is required" };
  }

  const { data, error } = await supabase
    .from("kanban_boards")
    .insert({
      name,
      description,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating board:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/home/kanban");
  return { success: true, data };
};
