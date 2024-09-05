"use server";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

export const getAllClients = async () => {
  const supabase = getSupabaseServerComponentClient();
  const { data, error } = await supabase.from("clients").select("*");

  if (error) {
    console.error("Error fetching clients:", error.message);
    return { data: null, error: error.message };
  }

  data.forEach((client) => {
    if (client.logo) {
      client.logo = supabase.storage
        .from("clients-image")
        .getPublicUrl(client.logo).data.publicUrl;
    }
  });

  return { data, error: null };
};
