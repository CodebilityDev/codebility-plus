import { getSprintsData } from "@/app/home/kanban/[projectId]/_services/query";
import { KanbanProjectWithSprintsData } from "@/app/home/kanban/[projectId]/page";
import { create } from "zustand";

interface SprintState {
  sprintsData: KanbanProjectWithSprintsData | null;
  projectId: string | null;
  error: string | null;
  setProjectId: (projectId: string) => Promise<void>;
  fetchSprintsData: () => Promise<void>;
  setSprintsData: (sprintsData: any) => void;
}

export const useSprintStore = create<SprintState>((set, get) => ({
  sprintsData: null,
  projectId: null,
  error: null,
  setProjectId: async (projectId) => set({ projectId }),
  fetchSprintsData: async () => {
    const id = get().projectId;
    if (!id) return;
    
    try {
      const sprintsData = await getSprintsData(id);
      set({ sprintsData: sprintsData as unknown as KanbanProjectWithSprintsData});
    } catch (err: any) {
      set({ error: err.message ?? "Failed to fetch sprints" });
    }
  },
  setSprintsData: (sprintsData) => set({ sprintsData }),
}));
