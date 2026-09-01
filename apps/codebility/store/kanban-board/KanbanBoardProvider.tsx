"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { useStore } from "zustand";

import { useKanbanBoardSync } from "@/hooks/use-kanban-board-sync";
import { useKanbanRealtime } from "@/hooks/use-kanban-realtime";
import { getBoardFingerprint } from "@/lib/kanban/board-fingerprint";
import { KanbanBoardWithColumns } from "@/lib/kanban/board-mappers";

import {
  createKanbanBoardStore,
  type KanbanBoardStore,
  type KanbanBoardStoreApi,
} from "./create-kanban-board-store";
import {
  registerKanbanBoardStore,
  unregisterKanbanBoardStore,
} from "./registry";

const KanbanBoardStoreContext = createContext<KanbanBoardStoreApi | null>(null);

type KanbanBoardProviderProps = {
  boardId: string;
  projectId: string;
  initialBoard: KanbanBoardWithColumns;
  children: ReactNode;
};

function KanbanBoardRegistryHost({
  store,
  scopeKey,
}: {
  store: KanbanBoardStoreApi;
  scopeKey: string;
}) {
  const hostRef = useCallback(
    (node: HTMLSpanElement | null) => {
      if (node) {
        registerKanbanBoardStore(store, scopeKey);
        return;
      }

      unregisterKanbanBoardStore(store, scopeKey);
    },
    [store, scopeKey],
  );

  return <span ref={hostRef} hidden aria-hidden className="hidden" />;
}

function KanbanBoardRealtimeHost({ store }: { store: KanbanBoardStoreApi }) {
  const { refreshBoard } = useKanbanBoardSync();
  const boardId = useStore(store, (state) => state.boardId);

  useKanbanRealtime({
    boardId,
    store,
    onReconnect: refreshBoard,
  });

  return null;
}

export function KanbanBoardProvider({
  boardId,
  projectId,
  initialBoard,
  children,
}: KanbanBoardProviderProps) {
  const scopeKey = `${projectId}:${boardId}`;
  const storeRef = useRef<KanbanBoardStoreApi | null>(null);
  const scopeRef = useRef(scopeKey);
  const reconciledFingerprintRef = useRef(getBoardFingerprint(initialBoard));

  if (!storeRef.current || scopeRef.current !== scopeKey) {
    storeRef.current = createKanbanBoardStore(initialBoard, boardId, projectId);
    scopeRef.current = scopeKey;
    reconciledFingerprintRef.current = getBoardFingerprint(initialBoard);
  }

  const store = storeRef.current;
  const boardFingerprint = getBoardFingerprint(initialBoard);

  useLayoutEffect(() => {
    if (reconciledFingerprintRef.current === boardFingerprint) {
      return;
    }

    reconciledFingerprintRef.current = boardFingerprint;
    store.getState().reconcileBoard(initialBoard);
  }, [store, initialBoard, boardFingerprint]);

  return (
    <KanbanBoardStoreContext.Provider value={store}>
      <KanbanBoardRegistryHost store={store} scopeKey={scopeKey} />
      <KanbanBoardRealtimeHost store={store} />
      {children}
    </KanbanBoardStoreContext.Provider>
  );
}

function useKanbanBoardStoreApi(): KanbanBoardStoreApi {
  const store = useContext(KanbanBoardStoreContext);
  if (!store) {
    throw new Error("useKanbanBoardStore must be used within KanbanBoardProvider");
  }
  return store;
}

export function useKanbanBoardStore<T>(
  selector: (state: KanbanBoardStore) => T,
): T {
  return useStore(useKanbanBoardStoreApi(), selector);
}

export function useKanbanBoardActions() {
  return useKanbanBoardStore((state) => ({
    setColumns: state.setColumns,
    moveTaskLocal: state.moveTaskLocal,
    removeTaskLocal: state.removeTaskLocal,
    patchTaskLocal: state.patchTaskLocal,
    addTaskLocal: state.addTaskLocal,
    mergeTasksLocal: state.mergeTasksLocal,
    appendColumnTasksLocal: state.appendColumnTasksLocal,
    setColumnLoadMeta: state.setColumnLoadMeta,
    addColumnLocal: state.addColumnLocal,
    updateColumnLocal: state.updateColumnLocal,
    removeColumnLocal: state.removeColumnLocal,
    reconcileBoard: state.reconcileBoard,
  }));
}

export function useKanbanColumns() {
  return useKanbanBoardStore((state) => state.columns);
}

export function useKanbanBoardMeta() {
  return useKanbanBoardStore((state) => ({
    boardId: state.boardId,
    projectId: state.projectId,
    board: state.board,
  }));
}
