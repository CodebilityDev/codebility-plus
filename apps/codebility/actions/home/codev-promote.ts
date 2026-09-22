"use server";
import { revalidatePath } from "next/cache";
import { createClientServerComponent } from "@/utils/supabase/server";
import { requireUser } from "@/lib/server/auth-guard";

// Role and promote_declined drive the shell, so the whole /home layout must
// refresh, not just the current page.
const revalidateHome = () => revalidatePath("/home", "layout");

/**
 * Resolves the row a promotion decision may touch.
 *
 * These are self-service actions: a user accepts or declines their OWN
 * promotion, and the promote modals pass the signed-in user's id. The userId
 * parameter used to be trusted outright, which let any caller set another
 * user's (or their own) role_id to Mentor or Codev.
 *
 * There is deliberately no admin override: promoting is a grant the user
 * accepts, and an admin path would need its own separate action.
 */
async function requireSelf(userId: string): Promise<string> {
  const { user } = await requireUser();

  if (user.id !== userId) {
    throw new Error("Forbidden");
  }

  return user.id;
}

export const declinePromotion = async (userId: string): Promise<void> => {
  if (!userId) {
    return;
  }

  const targetId = await requireSelf(userId);
  const supabase = await createClientServerComponent();

  const { error } = await supabase
    .from("codev")
    .update({ promote_declined: true })
    .eq("id", targetId);

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

  const targetId = await requireSelf(userId);
  const supabase = await createClientServerComponent();

  const { error } = await supabase
    .from("codev")
    .update({ role_id: 10 , promote_declined: null})
    .eq("id", targetId);

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

  const targetId = await requireSelf(userId);
  const supabase = await createClientServerComponent();

  const { error } = await supabase
    .from("codev")
    .update({ role_id: 5 , promote_declined: null})
    .eq("id", targetId);

  if (error) {
    console.error("Error updating role_id:", error);
    throw error;
  }

  revalidateHome();
};