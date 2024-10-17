"use server";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

export const getAllClients = async () => {
  const supabase = getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("clients").select("*");

  if (error) {
    console.error("Error fetching clients:", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};
