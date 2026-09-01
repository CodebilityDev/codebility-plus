import { Task } from "@/types/home/codev";
import { create } from "zustand";

export type KanbanModalType =
  | "taskAddModal"
  | "taskViewModal"
  | "taskEditModal"
  | "taskDeleteModal"
  | "ColumnAddModal";

export type TaskAddModalPayload = {
  listId: string;
  listName: string;
  projectId: string;
  totalTask: number;
};

interface KanbanModalStore {
  type: KanbanModalType | null;
  data?: Task | string | TaskAddModalPayload;
  dataObject?: Record<string, unknown>;
  callback?: (taskId?: string) => void;
  isOpen: boolean;
  onOpen: (
    type: KanbanModalType,
    data?: Task | string | TaskAddModalPayload,
    dataObject?: Record<string, unknown> | ((taskId?: string) => void),
    callback?: (taskId?: string) => void,
  ) => void;
  onClose: () => void;
}

export const useKanbanModal = create<KanbanModalStore>((set) => ({
  type: null,
  dataObject: {},
  isOpen: false,
  callback: undefined,
  onOpen: (type, data, dataObject, callback) => {
    if (typeof dataObject === "function") {
      set({
        isOpen: true,
        type,
        data,
        callback: dataObject,
      });
      return;
    }

    set({
      isOpen: true,
      type,
      data,
      dataObject,
      callback,
    });
  },
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      data: undefined,
      dataObject: {},
      callback: undefined,
    }),
}));

/** @alias useKanbanModal.getState */
export const getKanbanModalsStore = () => useKanbanModal.getState();
