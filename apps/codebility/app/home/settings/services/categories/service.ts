"use server";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

export const getAllServiceCategories = async () => {
  const supabase = getSupabaseServerComponentClient();

  const { data, error } = await supabase.from("service-categories").select("*");
  const { data, error } = await supabase.from("service-categories").select("*");

  if (error) {
    console.error("Error fetching service categories:", error.message);
    return null;
  }
  if (error) {
    console.error("Error fetching service categories:", error.message);
    return null;
  }

  return data;
  return data;
};
