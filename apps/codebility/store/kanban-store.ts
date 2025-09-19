import { create } from "zustand";
import { getBoardData } from "@/app/home/kanban/[projectId]/[id]/_services/query";

interface KanbanState {
  boardData: any;
  boardId: String | null;
  isLoading: boolean;
  setBoardId: (boardId: String) => Promise<void>;
  fetchBoardData: () => Promise<void>;
  setBoardData: (boardData: any) => void;
  removeTaskOptimistic: (taskId: string) => void;
  updateTaskOptimistic: (taskId: string, updates: any) => void;
  moveTaskOptimistic: (taskId: string, newColumnId: string) => void;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
    boardData: null,
    boardId: null,
    isLoading: false,
    setBoardId: async (boardId) => set({ boardId }),
    fetchBoardData: async () => {
        const id = get().boardId;
        if (!id) return;
        set({ isLoading: true });
        try {
            const boardData = await getBoardData(id);
            set({ boardData, isLoading: false });
        } catch (error) {
            console.error("Error fetching board data:", error);
            set({ isLoading: false });
        }
    },
    setBoardData: (boardData) => set({ boardData }),
    
    // Optimistic update: Remove task from UI immediately
    removeTaskOptimistic: (taskId) => set((state) => {
        if (!state.boardData?.columns) return state;
        
        const updatedColumns = state.boardData.columns.map((column: any) => ({
            ...column,
            tasks: column.tasks?.filter((task: any) => task.id !== taskId) || []
        }));
        
        return {
            boardData: {
                ...state.boardData,
                columns: updatedColumns
            }
        };
    }),
    
    // Optimistic update: Update task in UI immediately
    updateTaskOptimistic: (taskId, updates) => set((state) => {
        if (!state.boardData?.columns) return state;
        
        const updatedColumns = state.boardData.columns.map((column: any) => ({
            ...column,
            tasks: column.tasks?.map((task: any) => 
                task.id === taskId ? { ...task, ...updates } : task
            ) || []
        }));
        
        return {
            boardData: {
                ...state.boardData,
                columns: updatedColumns
            }
        };
    }),
    
    // Optimistic update: Move task between columns
    moveTaskOptimistic: (taskId, newColumnId) => set((state) => {
        if (!state.boardData?.columns) return state;
        
        let taskToMove: any = null;
        
        // Find and remove task from current column
        const updatedColumns = state.boardData.columns.map((column: any) => {
            const filteredTasks = column.tasks?.filter((task: any) => {
                if (task.id === taskId) {
                    taskToMove = { ...task, kanban_column_id: newColumnId };
                    return false;
                }
                return true;
            }) || [];
            
            return { ...column, tasks: filteredTasks };
        });
        
        // Add task to new column
        if (taskToMove) {
            const finalColumns = updatedColumns.map((column: any) => {
                if (column.id === newColumnId) {
                    return {
                        ...column,
                        tasks: [...(column.tasks || []), taskToMove]
                    };
                }
                return column;
            });
            
            return {
                boardData: {
                    ...state.boardData,
                    columns: finalColumns
                }
            };
        }
        
        return state;
    }),
}));
