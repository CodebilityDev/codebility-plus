import { cache } from "react";
import type { User } from "@supabase/supabase-js";

import { getCurrentCodev } from "@/lib/global/current-codev";
import { getAccess } from "@/lib/global/permissions";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import { logPerf } from "@/lib/global/timing";
import type { CurrentUserProfile } from "@/types/global/current-user";

export type SessionSupabaseClient = Awaited<
  ReturnType<typeof createClientServerComponent>
>;

export interface SessionUser {
  user: User | null;
  supabase: SessionSupabaseClient;
}

export type SessionAccess = Awaited<ReturnType<typeof getAccess>>;

export interface SessionIdentity {
  userId: string | null;
  codev: CurrentUserProfile | null;
  access: SessionAccess;
}

export const getSessionUser = cache(async (): Promise<SessionUser> => {
  const supabase = await createClientServerComponent();

  const authStartedAt = performance.now();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  logPerf("auth.getUser", authStartedAt);

  return { user, supabase };
});

export const getSessionIdentity = cache(
  async (): Promise<SessionIdentity> => {
    const codev = await getCurrentCodev();
    const { user } = await getSessionUser();
    const access = await getAccess();

    return { userId: user?.id ?? null, codev, access };
  },
);
