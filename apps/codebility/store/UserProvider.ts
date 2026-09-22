"use client";

import { useRef } from "react";
import type { Codev } from "@/types/home/codev";
import type { CurrentCodev } from "@/lib/server/current-codev";
import { useUserStore } from "@/store/codev-store";

export function UserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: Codev | CurrentCodev | null;
}) {
  const seeded = useRef(false);

  if (!seeded.current) {
    seeded.current = true;
    useUserStore.setState({ user: initialUser, isLoading: false });
  }

  return children;
}
