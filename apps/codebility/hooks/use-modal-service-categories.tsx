import { Category } from "@/app/home/settings/services/categories/_types/category"
import { create } from "zustand"

export type ModalType = "serviceCategoriesModal" | "serviceCategoriesDeleteModal"

type ModalStore = {
  type: ModalType | null
  data?: Category
  isOpen: boolean
  onOpen: (type: ModalType, data?: Category) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type: ModalType, data?: Category) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false, data: undefined }),
}))
