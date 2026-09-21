"use client";

import { useEffect, useRef } from "react";
import type { Codev } from "@/types/home/codev";
import type { CurrentCodev } from "@/lib/server/current-codev";
import { useUserStore } from "@/store/codev-store";

/**
 * Seeds the user store from the server when `initialUser` is supplied, so no
 * client-side auth + profile round-trip is needed on first paint. Falls back to
 * hydrating on the client for callers that have no server-fetched user.
 *
 * Seeding during render is deliberate: children must see the user on the very
 * first pass, or `Navbar` (which returns null without a user) would paint empty
 * and every subscriber would render twice. The `seeded` ref keeps the write
 * idempotent across Strict Mode's double render.
 */
export function UserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: Codev | CurrentCodev | null;
}) {
  const seeded = useRef(false);

  if (initialUser && !seeded.current) {
    seeded.current = true;
    useUserStore.setState({ user: initialUser, isLoading: false });
  }

  const hydrate = useUserStore((state) => state.hydrate);

  useEffect(() => {
    if (initialUser) return;
    hydrate();
  }, [hydrate, initialUser]);

  return children;
}
