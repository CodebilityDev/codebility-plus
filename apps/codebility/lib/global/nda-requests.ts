import { cache } from "react";

import { createClientServerComponent } from "@/lib/global/supabase-server";

export const getNdaRequestCodevId = cache(
  async (token: string): Promise<string | null> => {
    const supabase = await createClientServerComponent();

    const { data, error } = await supabase
      .from("nda_requests")
      .select("codev_id")
      .eq("token", token)
      .eq("status", "pending")
      .maybeSingle();

    if (error) {
      console.error("Error fetching codev ID:", error);
      return null;
    }

    return data?.codev_id ?? null;
  },
);
