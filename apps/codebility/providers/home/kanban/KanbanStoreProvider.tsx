"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useStore } from "zustand";

import { createKanbanStore } from "@/store/home/kanban/kanban-store";
import type { KanbanBoardSnapshot } from "@/types/home/kanban/kanban";

type KanbanStoreApi = ReturnType<typeof createKanbanStore>;
type KanbanStoreState = ReturnType<KanbanStoreApi["getState"]>;

const KanbanStoreContext = createContext<KanbanStoreApi | null>(null);

export function KanbanStoreProvider({
  snapshot,
  children,
}: {
  snapshot: KanbanBoardSnapshot | null;
  children: ReactNode;
}) {
  const [store] = useState(() => createKanbanStore(snapshot));

  return (
    <KanbanStoreContext.Provider value={store}>
      {children}
    </KanbanStoreContext.Provider>
  );
}

export function useKanbanStoreApi(): KanbanStoreApi {
  const store = useContext(KanbanStoreContext);

  if (!store) {
    throw new Error("useKanbanStore must be used inside KanbanStoreProvider");
  }

  return store;
}

export function useKanbanStore<T>(selector: (state: KanbanStoreState) => T): T {
  return useStore(useKanbanStoreApi(), selector);
}
