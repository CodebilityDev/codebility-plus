"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/codev-store";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useUserStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return children;
}
