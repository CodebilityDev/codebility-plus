"use client";

import { useEffect } from "react";

import { NAV_USER_PROFILE_KEY } from "@/constants/global/marketing";
import { useLocalStorageValue } from "@/hooks/global/useLocalStorageValue";
import { getNavUserPromise } from "@/lib/global/nav-user-loader";
import type { NavUserProfile } from "@/types/global/database";

export function useNavUser(): NavUserProfile | null {
  const profile = useLocalStorageValue<NavUserProfile>(NAV_USER_PROFILE_KEY);

  useEffect(() => {
    void getNavUserPromise();
  }, []);

  return profile;
}
