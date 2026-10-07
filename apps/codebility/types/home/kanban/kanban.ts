export interface ProjectListItem {
  id: string;
  name: string;
  status: string | null;
  projectCode: string | null;
  startDate: string | null;
  endDate: string | null;
  kanbanDisplay: boolean;
}

export interface SprintListItem {
  id: string;
  name: string | null;
  startAt: string;
  endAt: string;
  hasBoard: boolean;
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string | null;
  columnId: string;
  position: number;
  priority: string | null;
  codevId: string | null;
  dueDate: string | null;
  updatedAt: string | null;
}

export interface KanbanColumn {
  id: string;
  name: string;
  position: number;
}

export interface KanbanBoardSnapshot {
  boardId: string;
  boardName: string;
  projectId: string;
  projectName: string;
  sprintId: string;
  sprintName: string | null;
  columns: KanbanColumn[];
  tasks: KanbanTask[];
}

export interface KanbanSprintsPageProps {
  params: Promise<{ projectId: string }>;
}

export interface KanbanBoardPageProps {
  params: Promise<{ projectId: string; sprintId: string }>;
}

export type KanbanConnection = "connecting" | "live" | "offline";

export interface KanbanState {
  columnsById: Record<string, KanbanColumn>;
  columnOrder: string[];
  tasksById: Record<string, KanbanTask>;
  taskIdsByColumn: Record<string, string[]>;
  activeTaskId: string | null;
  pending: Record<string, boolean>;
  connection: KanbanConnection;
}
