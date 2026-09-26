import { create } from "zustand";
import type { PostStore } from "@/types/home/home";


export const useNavStore = create<PostStore>((set) => ({
  isToggleOpen: true,
  toggleNav: () => set((state) => ({ isToggleOpen: !state.isToggleOpen })),
  closeNav: () => set((state) => ({ isToggleOpen: false })),
}));
