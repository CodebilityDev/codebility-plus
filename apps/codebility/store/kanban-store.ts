import { create } from "zustand";
import { getBoardData } from "@/app/home/kanban/[projectId]/[id]/_services/query";

interface KanbanState {
  boardData: any;
  boardId: String | null;
  setBoardId: (boardId: String) => Promise<void>;
  fetchBoardData: () => Promise<void>;
  setBoardData: (boardData: any) => void;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
    boardData: null,
    boardId: null,
    setBoardId: async (boardId) => set({ boardId }),
    fetchBoardData: async () => {
        const id = get().boardId;
        if (!id) return;
        const boardData = await getBoardData(id);
        set({ boardData });
      },
    setBoardData: (boardData) => set({ boardData }),

}));
