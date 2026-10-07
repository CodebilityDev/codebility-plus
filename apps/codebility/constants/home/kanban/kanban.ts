export const PROJECT_COLUMNS =
  "id, name, status, project_code, start_date, end_date, kanban_display";

export const SPRINT_COLUMNS = "id, name, start_at, end_at, board_id, project_id";

export const TASK_COLUMNS =
  "id, title, description, kanban_column_id, position, priority, codev_id, due_date, updated_at";

export const COLUMN_COLUMNS = "id, name, position, board_id";

export const BOARD_COLUMNS = "id, name, project_id";

export const DEFAULT_COLUMN_NAMES = ["Backlog", "In Progress", "Done"];
