import { Codev } from "@/types/home/codev";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { create } from "zustand";

interface UserState {
  user: Codev | null;
  setUser: (user: Codev) => void;
  clearUser: () => void;
  hydrate: () => Promise<void>;
  isLoading: boolean;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  hydrate: async () => {
    try {
      set({ isLoading: true });
      const supabase = createClientComponentClient();

      // First check if we have a session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        set({ user: null, isLoading: false });
        return;
      }

      // If we have a session, fetch the user data
      const { data: userData, error } = await supabase
        .from("codev")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      set({ user: userData, isLoading: false });
    } catch (error) {
      console.error("Error hydrating user store:", error);
      set({ user: null, isLoading: false });
    }
  },
}));
