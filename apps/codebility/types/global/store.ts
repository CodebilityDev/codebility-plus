import { Codev } from "@/types/global/codev";

export interface UserState {
  user: Codev | null;
  userLevel: number | null;
  setUser: (user: Codev) => void;
  setUserLevel: (level: number) => void;
  clearUser: () => void;
  hydrate: () => Promise<void>;
  isLoading: boolean;
}
