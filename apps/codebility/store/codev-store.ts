import { Codev } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";
import { create } from "zustand";

interface UserState {
  user: Codev | null;
  userLevel: number | null;
  setUser: (user: Codev) => void;
  setUserLevel: (level: number) => void;
  clearUser: () => void;
  hydrate: () => Promise<void>;
  isLoading: boolean;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  userLevel: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setUserLevel: (userLevel) => set({ userLevel }),
  clearUser: () => set({ user: null }),
  hydrate: async () => {
    try {
      set({ isLoading: true });
      const supabase = createClientClientComponent();
      
      if (!supabase) {
        console.error("Supabase client is not initialized.");
        set({ user: null, isLoading: false });
        return;
      }

      // FIXED: Use getUser() instead of getSession()
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        set({ user: null, isLoading: false });
        return;
      }

      // If we have a user, fetch the user data
      const { data: userData, error } = await supabase
        .from("codev")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      set({ user: userData, isLoading: false });
    } catch (error) {
      console.error("Error hydrating user store:", error);
      set({ user: null, isLoading: false });
    }
  },
}));