import { Codev } from "@/types/home/codev";
import { create } from "zustand";

interface UserState {
  user: Codev | null;
  setUser: (user: Codev) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
