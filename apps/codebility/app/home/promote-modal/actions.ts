"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { FeatureModal } from "./type";

export async function fetchActiveModal(): Promise<FeatureModal | null> {
  try {
    const supabase = await createClientServerComponent();

    const { data, error } = await supabase
      .from("feature_modals")
      .select("*")
      .eq("is_active", true)
      .single();

    if (error) throw error;

    return data as FeatureModal;
  } catch (error) {
    return null;
  }
}

export async function upsertActiveModal(
  data: Partial<FeatureModal>
): Promise<{ error: string | null }> {
  try {
    const supabase = await createClientServerComponent();

    const { error } = await supabase.from("feature_modals").upsert({
      ...data,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    return { error: null };
  } catch (error) {
    return { error: "Failed to save changes." };
  }
}