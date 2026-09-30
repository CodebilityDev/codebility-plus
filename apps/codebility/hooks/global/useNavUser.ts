"use client";

import { useEffect, useState } from "react";

import { getNavUserPromise } from "@/lib/global/nav-user-loader";
import type { NavUserProfile } from "@/types/global/database";

export function useNavUser(): NavUserProfile | null {
  const [profile, setProfile] = useState<NavUserProfile | null>(null);

  useEffect(() => {
    let active = true;

    getNavUserPromise().then((data) => {
      if (active) setProfile(data);
    });

    return () => {
      active = false;
    };
  }, []);

  return profile;
}
