"use server";

import { createClientServerComponent } from "@/utils/supabase/server";

export const getMemberRatingScore = async (memberId: string): Promise<number> => {
  try {
    const supabase = await createClientServerComponent();

    const { data, error } = await supabase
      .rpc("calculate_member_rating_score", { member_uuid: memberId })
      .single();

    if (error) throw error;

    // unwrap the actual numeric value from the returned object
    const score =
      typeof data === "number" ? data : (data as any)?.calculate_member_rating_score;

    return score ?? 0; // default to 0 if null or undefined
  } catch (error) {
    console.error("Error fetching member score:", error);
    return 0; // fail gracefully
  }
};