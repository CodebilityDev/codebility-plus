import { create } from "zustand";

interface PostStore {
  isToggleOpen: boolean;
  toggleNav: () => void;
  closeNav: () => void;
}

export const useNavStore = create<PostStore>((set) => ({
  isToggleOpen: true,
  toggleNav: () => set((state) => ({ isToggleOpen: !state.isToggleOpen })),
  closeNav: () => set((state) => ({ isToggleOpen: false })),
}));
