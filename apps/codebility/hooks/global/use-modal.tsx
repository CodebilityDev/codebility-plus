import { Client, Task } from "@/types/global/codev";
import { create } from "zustand";
import type { ModalStore } from "@/types/global/hooks";


export const useModal = create<ModalStore>((set) => ({
  type: null,
  dataObject: {},
  isOpen: false,
  callback: undefined,
  onOpen: (type, data?: Task | Client[] | any, dataObject?, callback?) =>
    set({ isOpen: true, type, data, dataObject, callback }),
  onClose: () => set({ type: null, isOpen: false, callback: undefined }),
}));
