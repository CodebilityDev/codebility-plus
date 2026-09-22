import { Client } from "@/types/home/codev";
import { create } from "zustand";

export type ModalType = "clientAddModal" | "clientEditModal";

interface ModalStore {
  type: ModalType | null;
  data?: Client;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: Client) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type: ModalType, data?: Client) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
