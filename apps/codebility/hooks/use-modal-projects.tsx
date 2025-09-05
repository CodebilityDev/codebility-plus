import { Project } from "@/types/home/codev";
import { create } from "zustand";

export type ModalType =
  | "projectAddModal"
  | "projectEditModal"
  | "projectViewModal"
  | "projectDeleteModal"
  | "KanbanAddMembersModal";

interface ModalStore {
  type: ModalType | null;
  data?: Project;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: Project) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type: ModalType, data?: Project) =>
    set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
