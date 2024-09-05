"use server";

import { createServer } from "@/utils/supabase";

export const getAllServiceCategories = async () => {
  const supabase = createServer();

  const { data, error } = await supabase.from("service-categories").select("*");

  if (error) {
    console.error("Error fetching service categories:", error.message);
    return null;
  }

  return data;
};
