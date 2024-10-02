import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

export const getApplicationStatus = async (userId: string) => {
  const supabase = getSupabaseServerComponentClient();

  const { data, error } = await supabase
    .from("codev")
    .select("application_status")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error: ", error.message);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};
