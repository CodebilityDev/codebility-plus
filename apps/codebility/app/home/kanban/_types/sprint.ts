import { KanbanBoardType, KanbanSprintType } from "@/types/home/codev";

export interface KanbanSprintData extends KanbanSprintType {
  kanban_board: KanbanBoardType | null;
}

export interface KanbanProjectWithSprintsData {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
  kanban_sprints: KanbanSprintData[] | KanbanSprintData | null;
}
