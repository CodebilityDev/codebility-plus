"use server";
import { revalidatePath } from "next/cache";
import { createClientServerComponent } from "@/utils/supabase/server";

// Role and promote_declined drive the shell, so the whole /home layout must
// refresh, not just the current page.
const revalidateHome = () => revalidatePath("/home", "layout");

export const declinePromotion = async (userId: string): Promise<void> => {
  if (!userId) {
    return;
  }

  const supabase = await createClientServerComponent();

  const { error } = await supabase
    .from("codev")
    .update({ promote_declined: true })
    .eq("id", userId);

  if (error) {
    console.error("Error updating promote_declined:", error);
    throw error;
  }

  revalidateHome();
};

export const acceptPromotionToCodev = async (userId: string): Promise<void> => {
  if (!userId) {
    return;
  }

  const supabase = await createClientServerComponent();

  const { error } = await supabase
    .from("codev")
    .update({ role_id: 10 , promote_declined: null})
    .eq("id", userId);

  if (error) {
    console.error("Error updating role_id:", error);
    throw error;
  }

  revalidateHome();
};

export const acceptPromotionToMentor = async (userId: string): Promise<void> => {
  if (!userId) {
    return;
  }

  const supabase = await createClientServerComponent();

  const { error } = await supabase
    .from("codev")
    .update({ role_id: 5 , promote_declined: null})
    .eq("id", userId);

  if (error) {
    console.error("Error updating role_id:", error);
    throw error;
  }

  revalidateHome();
};