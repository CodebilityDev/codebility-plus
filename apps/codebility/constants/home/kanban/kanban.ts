export const PROJECT_COLUMNS =
  "id, name, status, project_code, start_date, end_date, kanban_display";

export const SPRINT_COLUMNS = "id, name, start_at, end_at, board_id, project_id";

export const TASK_COLUMNS =
  "id, title, priority, due_date, kanban_column_id, position, updated_at";

export const TASK_DETAIL_COLUMNS =
  "id, title, description, kanban_column_id, position, priority, codev_id, due_date, updated_at, difficulty, points, type, skill_category_id, deadline, sidekick_ids";

export const COLUMN_COLUMNS = "id, name, position, board_id";

export const BOARD_COLUMNS = "id, name, project_id";

export const DEFAULT_COLUMN_NAMES = ["Backlog", "In Progress", "Done"];

export const PRIORITY_LEVELS = ["urgent", "high", "medium", "low"] as const;

export const TASK_TYPES = [
  "FEATURE",
  "BUG",
  "IMPROVEMENT",
  "DOCUMENTATION",
] as const;

export const DIFFICULTY_LEVELS = [
  "easy",
  "medium",
  "hard",
  "expert",
  "legendary",
] as const;

export const DIFFICULTY_POINTS: Record<string, number> = {
  easy: 10,
  medium: 20,
  hard: 40,
  expert: 80,
  legendary: 150,
};
