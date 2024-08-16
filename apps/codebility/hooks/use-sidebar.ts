import { create } from "zustand"

interface PostStore {
  isToggleOpen: Boolean
  toggleNav: () => void
  closeNav: () => void
}

export const useNavStore = create<PostStore>((set) => ({
  isToggleOpen: false,
  toggleNav: () => set((state) => ({ isToggleOpen: !state.isToggleOpen })),
  closeNav: () => set((state) => ({ isToggleOpen: false })),
}))
