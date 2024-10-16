"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

export const createServiceCategoryAction = async (formData: FormData) => {
  const name = formData.get("name") as string;

  const supabase = await getSupabaseServerActionClient();

  const { data, error } = await supabase
    .from("service-categories")
    .insert({ name })
    .single();

  if (error) {
    console.error("Error creating service category:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/home/settings/services/categories");
  return {
    success: true,
    message: "Service category created successfully",
    data,
  };
};

export const updateServiceCategoryAction = async (
  id: number,
  formData: FormData,
) => {
  const name = formData.get("name") as string;

  const supabase = await getSupabaseServerActionClient();

  const { data, error } = await supabase
    .from("service-categories")
    .update({ name })
    .eq("id", id);

  if (error) {
    console.error("Error updating service category:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/home/settings/services/categories");
  return {
    success: true,
    message: "Service category updated successfully",
    data,
  };
};

export const deleteServiceCategoryAction = async (id: number) => {
  const supabase = await getSupabaseServerActionClient();

  console.log("Deleting category with ID:", id);

  const { error } = await supabase
    .from("service-categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting service category:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/home/settings/services/categories");
  return { success: true, message: "Service category deleted successfully" };
};
