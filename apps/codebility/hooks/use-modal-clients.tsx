import { create } from "zustand"
import { client_ClientCardT } from "@/types/protectedroutes"

export type ModalType = "clientAddModal" | "clientEditModal"

interface ModalStore {
  type: ModalType | null
  data?: client_ClientCardT
  isOpen: boolean
  onOpen: (type: ModalType, data?: client_ClientCardT) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type: ModalType, data?: client_ClientCardT) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}))
