import { create } from "zustand";
import type { ModalStore, ModalType } from "@/types/global/hooks";


export const useModal = create<ModalStore>((set) => ({
  type: null,
  dataObject: {},
  isOpen: false,
  callback: undefined,
  onOpen: (type: ModalType, data?: unknown, dataObject?: unknown, callback?: () => void) =>
    set({ isOpen: true, type, data, dataObject, callback }),
  onClose: () => set({ type: null, isOpen: false, callback: undefined }),
}));
