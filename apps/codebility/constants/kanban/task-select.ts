/** Card-level task fields shared by board and member-filter queries. */
export const KANBAN_BOARD_TASK_SELECT = `
  id,
  title,
  priority,
  difficulty,
  type,
  deadline,
  points,
  position,
  kanban_column_id,
  codev_id,
  sidekick_ids,
  codev!tasks_codev_id_fkey (
    id,
    first_name,
    last_name,
    image_url
  ),
  skill_category!tasks_skill_category_id_fkey (
    id,
    name
  )
`;
