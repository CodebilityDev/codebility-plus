"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { FeatureModal } from "./type";

export async function fetchActiveModal(): Promise<FeatureModal | null> {
  try {
    const supabase = await createClientServerComponent();

    const { data, error } = await supabase
      .from("feature_modals")
      .select("*")
      .eq("is_active", true);

    if (error) throw error;
    if (!data || data.length === 0) return null;

    // Pick a random one from all active modals
    const random = Math.floor(Math.random() * data.length);
    return data[random] as FeatureModal;
  } catch {
    return null;
  }
}
export async function fetchAllModals(): Promise<FeatureModal[]> {
  try {
    const supabase = await createClientServerComponent();
    const { data, error } = await supabase
      .from("feature_modals")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as FeatureModal[]) ?? [];
  } catch {
    return [];
  }
}

export async function fetchModalById(id: string): Promise<FeatureModal | null> {
  try {
    const supabase = await createClientServerComponent();
    const { data, error } = await supabase
      .from("feature_modals")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as FeatureModal;
  } catch {
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
  } catch {
    return { error: "Failed to save changes." };
  }
}

export async function createModal(): Promise<{
  id: string | null;
  error: string | null;
}> {
  try {
    const supabase = await createClientServerComponent();
    const { data, error } = await supabase
      .from("feature_modals")
      .insert({
        badge: "",
        headline: "New Promotional Modal",
        subheadline: "",
        cta_label: "Learn More",
        cta_href: "/",
        dismiss_label: "Maybe later",
        features: [],
        is_active: false,
        image_url: "",        // ← add this
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) throw error;
    return { id: data.id, error: null };
  } catch {
    return { id: null, error: "Failed to create modal." };
  }
}


export async function uploadModalImage(
  formData: FormData
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = await createClientServerComponent();
    const file = formData.get("file") as File;

    const ext = file.name.split(".").pop();
    const filename = `promoteModal/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("codebility")
      .upload(filename, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
      .from("codebility")
      .getPublicUrl(filename);

    return { url: data.publicUrl, error: null };
  } catch {
    return { url: null, error: "Failed to upload image." };
  }
}


export async function deleteModal(
  id: string
): Promise<{ error: string | null }> {
  try {
    const supabase = await createClientServerComponent();
    const { error } = await supabase
      .from("feature_modals")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return { error: null };
  } catch {
    return { error: "Failed to delete modal." };
  }
}

export async function toggleModalActive(
  id: string,
  is_active: boolean
): Promise<{ error: string | null }> {
  try {
    const supabase = await createClientServerComponent();

    const { error } = await supabase
      .from("feature_modals")
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    return { error: null };
  } catch {
    return { error: "Failed to update modal." };
  }
}