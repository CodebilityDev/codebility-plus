import type { KanbanBoardStoreApi } from "./create-kanban-board-store";

let activeBoardStore: KanbanBoardStoreApi | null = null;
let activeScopeKey: string | null = null;

export function registerKanbanBoardStore(
  store: KanbanBoardStoreApi,
  scopeKey: string,
): void {
  activeBoardStore = store;
  activeScopeKey = scopeKey;
}

export function unregisterKanbanBoardStore(
  store: KanbanBoardStoreApi,
  scopeKey: string,
): void {
  if (activeBoardStore === store && activeScopeKey === scopeKey) {
    activeBoardStore = null;
    activeScopeKey = null;
  }
}

export function getKanbanBoardStore(): KanbanBoardStoreApi {
  if (!activeBoardStore) {
    throw new Error("Kanban board store is not mounted");
  }
  return activeBoardStore;
}

export function tryGetKanbanBoardStore(): KanbanBoardStoreApi | null {
  return activeBoardStore;
}
