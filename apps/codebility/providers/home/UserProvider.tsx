"use client";

import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { Codev } from "@/types/global/codev";
import { useUserStore } from "@/store/global/codev-store";

const InitialUserContext = createContext<Codev | null>(null);

/**
 * The user the server already fetched, so no client-side auth + profile
 * round-trip is needed on first paint. Components render this during the first
 * pass instead of reading a store that has not been seeded yet: writing to the
 * store during render notifies mounted subscribers, which React rejects.
 */
export function useInitialUser() {
  return useContext(InitialUserContext);
}

export function UserProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: Codev | null;
}) {
  const hydrate = useUserStore((state) => state.hydrate);

  useEffect(() => {
    if (initialUser) {
      useUserStore.setState({ user: initialUser, isLoading: false });
      return;
    }
    hydrate();
  }, [hydrate, initialUser]);

  return (
    <InitialUserContext.Provider value={initialUser ?? null}>
      {children}
    </InitialUserContext.Provider>
  );
}
