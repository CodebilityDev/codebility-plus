import { Codev } from "@/types/home/codev";
import { create } from "zustand";

export type ModalType = "profileModal";

interface ModalStore {
  type: ModalType | null;
  data?: Codev;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: Codev) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type: ModalType, data?: Codev) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
