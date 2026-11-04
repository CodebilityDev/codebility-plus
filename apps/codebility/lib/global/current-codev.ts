import { connection } from "next/server";
import { cache } from "react";
import type { CurrentUserProfile } from "@/types/global/current-user";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import { logPerf } from "@/lib/global/timing";

export const getCurrentCodev = cache(
  async (): Promise<CurrentUserProfile | null> => {
    await connection();

    const startedAt = performance.now();
    const supabase = await createClientServerComponent();

    const authStartedAt = performance.now();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    logPerf("auth.getUser", authStartedAt);

    if (!user) {
      logPerf("codev.total", startedAt);
      return null;
    }

    const selectStartedAt = performance.now();
    const { data, error } = await supabase
      .from("codev")
      .select(
        "id, first_name, last_name, email_address, image_url, role_id, application_status, internal_status, availability_status",
      )
      .eq("id", user.id)
      .single();
    logPerf("codev.select", selectStartedAt);

    if (error) {
      console.error("Error fetching current codev:", error);
      logPerf("codev.total", startedAt);
      return null;
    }

    logPerf("codev.total", startedAt);
    return data;
  },
);
