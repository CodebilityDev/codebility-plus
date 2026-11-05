"use client";

import { toast } from "sonner";

import { deleteColumn, updateColumn } from "@/actions/home/kanban/columns";
import { useModal } from "@/hooks/global/use-modal";
import { useKanbanStoreApi } from "@/providers/home/kanban/KanbanStoreProvider";

export function useColumnActions() {
  const store = useKanbanStoreApi();
  const onOpen = useModal((state) => state.onOpen);

  async function renameColumn(columnId: string, name: string) {
    const previous = store.getState().columnsById[columnId];

    if (previous) {
      store.getState().upsertColumn({ ...previous, name });
    }

    try {
      await updateColumn(columnId, name);
    } catch (caught) {
      if (previous) store.getState().upsertColumn(previous);
      toast.error(
        caught instanceof Error
          ? caught.message
          : "Could not rename the column.",
      );
    }
  }

  async function remove(columnId: string) {
    const previous = store.getState();
    const column = previous.columnsById[columnId];
    const tasks = Object.values(previous.tasksById).filter(
      (task) => task.columnId === columnId,
    );

    store.getState().removeColumn(columnId);

    try {
      await deleteColumn(columnId);
    } catch (caught) {
      if (column) store.getState().upsertColumn(column);
      for (const task of tasks) store.getState().upsertTask(task);
      toast.error(
        caught instanceof Error
          ? caught.message
          : "Could not delete the column.",
      );
    }
  }

  function confirmDeleteColumn(columnId: string) {
    const state = store.getState();
    const name = state.columnsById[columnId]?.name ?? "";
    const count = (state.taskIdsByColumn[columnId] ?? []).length;

    onOpen(
      "deleteWarningModal",
      {
        title: `Delete "${name}"?`,
        description: `This deletes the column and its ${count} ${
          count === 1 ? "task" : "tasks"
        }. This cannot be undone.`,
        confirmLabel: "Delete column",
      },
      undefined,
      () => {
        void remove(columnId);
      },
    );
  }

  return {
    renameColumn,
    deleteColumn: remove,
    confirmDeleteColumn,
  };
}
