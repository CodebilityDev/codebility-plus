import { create } from "zustand"
import { ProjectT } from "@/types"

export type ModalType = "projectAddModal" | "projectEditModal" | "projectViewModal" | "projectDeleteModal"

interface ModalStore {
  type: ModalType | null
  data?: ProjectT
  isOpen: boolean
  onOpen: (type: ModalType, data?: ProjectT) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type: ModalType, data?: ProjectT) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}))