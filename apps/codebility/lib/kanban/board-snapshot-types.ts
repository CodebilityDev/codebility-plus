export type BoardSnapshotInput = {
  boardId: string;
  projectId: string;
  columns: Array<{ id: string; position: number }>;
  tasks: Array<{ id: string; kanban_column_id: string; position: number }>;
};
