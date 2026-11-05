import { cache } from "react";

import { computeProfilePoints } from "@/lib/global/profile-points";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import { profilePointsResponse } from "@/types/global/profile-points";
import type { ProfilePointsData, ProfilePointsResult } from "@/types/global/profile-points";

export const loadProfilePoints = cache(
  async (): Promise<ProfilePointsResult | null> => {
    const supabase = await createClientServerComponent();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    return computeProfilePoints(supabase, user.id);
  },
);

export async function loadProfilePointsResponse(): Promise<ProfilePointsData | null> {
  const result = await loadProfilePoints();
  if (!result) return null;
  return profilePointsResponse(result, result.breakdown);
}
