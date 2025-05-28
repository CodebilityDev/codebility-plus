import { create } from "zustand";

export type ModalType = "sprintAddModal"

interface ModalState {
  isOpen: boolean;
  type: string | null;
  projectId: string | null;
  onOpen: (type: string, projectId?: string) => void;
  onClose: () => void;
}

export const useModal = create<ModalState>((set) => ({
  isOpen: false,
  type: null,
  projectId: null,
  onOpen: (type, projectId) => set({ isOpen: true, type, projectId }),
  onClose: () => set({ isOpen: false, type: null, projectId: null }),
}));
