import { create } from "zustand";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  portfolio_website: string | null;
  tech_stacks: string[];
  display_position: string;
  positions: string[];
  years_of_experience: number;
  facebook_link: string | null;
  linkedin: string | null;
  github: string | null;
  discord: string | null;
  image_url: string | null;
  application_status: "applying" | "passed" | "rejected";
  availability_status: "available" | "busy";
  nda_status: boolean;
  created_at: string;
  updated_at: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
