import { create } from "zustand"
import { ClientDetails } from "@/app/home/clients/_types/clients"

export type ModalType = "clientAddModal" | "clientEditModal"

interface ModalStore {
  type: ModalType | null
  data?: ClientDetails
  isOpen: boolean
  onOpen: (type: ModalType, data?: ClientDetails) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type: ModalType, data?: ClientDetails) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}))
