import { cache } from "react";

import { createClientServerComponent } from "@/lib/global/supabase-server";
import type { MfaFactor } from "@/types/global/account-settings";

export const getMfaFactors = cache(async (): Promise<MfaFactor[]> => {
  const supabase = await createClientServerComponent();
  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error) {
    console.error("Error fetching 2FA factors:", error);
    return [];
  }

  return (data?.totp ?? []).map((factor) => ({
    id: factor.id,
    status: factor.status,
    friendly_name: factor.friendly_name ?? null,
  }));
});
