import { User } from "@/types";
import { create } from "zustand";

export type ModalType = "profileModal";

interface ModalStore {
  type: ModalType | null;
  data?: User;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: User) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type: ModalType, data?: User) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
