import { create } from "zustand";
import type { ModalStore } from "@/types/global/hooks";


export const useModal = create<ModalStore>((set) => ({
  type: null,
  dataObject: {},
  isOpen: false,
  callback: undefined,
  onOpen: (type, data?: any, dataObject?, callback?) =>
    set({ isOpen: true, type, data, dataObject, callback }),
  onClose: () => set({ type: null, isOpen: false, callback: undefined }),
}));
