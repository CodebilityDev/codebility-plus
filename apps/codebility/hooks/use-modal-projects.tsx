import { ProjectT } from "@/types";
import { create } from "zustand";

export type ModalType =
  | "projectAddModal"
  | "projectEditModal"
  | "projectViewModal"
  | "projectDeleteModal"
  | "projectMembersModal";

interface ModalStore {
  type: ModalType | null;
  data?: ProjectT;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ProjectT) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type: ModalType, data?: ProjectT) =>
    set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
