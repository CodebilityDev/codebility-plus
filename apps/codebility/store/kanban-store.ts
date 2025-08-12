import { create } from "zustand";
import { getBoardData } from "@/app/home/kanban/[projectId]/[id]/_services/query";

interface KanbanState {
  boardData: any;
  fetchBoardData: (boardId: String) => Promise<void>;
  setBoardData: (boardData: any) => void;
}

export const useKanbanStore = create<KanbanState>((set) => ({
    boardData: null,
    fetchBoardData: async (boardId) => {
        const boardData = await getBoardData(boardId);
        set({ boardData });
      },
    setBoardData: (boardData) => set({ boardData }),

}));
