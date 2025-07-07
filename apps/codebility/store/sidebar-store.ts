import { create } from 'zustand';

interface SidebarState {
  refreshKey: number;
  triggerRefresh: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  refreshKey: 0,
  triggerRefresh: () =>
    set((state) => ({
      refreshKey: state.refreshKey + 1,
    })),

}));