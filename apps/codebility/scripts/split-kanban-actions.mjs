import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const srcPath = path.join(
  root,
  "app/home/kanban/[projectId]/[id]/actions.ts",
);
const lines = fs.readFileSync(srcPath, "utf8").split("\n");

const commonImports = `"use server";

import { Task, TaskDraft } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";
import { requireUser } from "@/lib/server/auth-guard";
import { createNotificationAction } from "@/actions/notifications/notification.actions";
import {
  fetchTaskDetail,
  type KanbanTaskDetail,
} from "@/lib/server/kanban-task-query";
import { fetchMemberBoardTasks as fetchMemberBoardTasksQuery } from "@/lib/server/kanban-member-tasks-query";
import { fetchColumnTasksPage as fetchColumnTasksPageQuery } from "@/lib/server/kanban-column-tasks-query";
import { KANBAN_COLUMN_TASK_PAGE_SIZE } from "@/lib/kanban/board-pagination";
import type { BoardSnapshotInput } from "@/lib/kanban/board-snapshot-types";
import { persistBoardSnapshot } from "@/lib/server/kanban-board-snapshot-sync";
import { updateDeveloperLevels } from "@/lib/kanban/update-developer-levels";
import {
  type CodevMember,
  type GuardSupabase,
  assertProjectMembership,
  buildPositionUpdates,
  fetchColumnTasks,
  getProjectIdForBoard,
  getProjectIdForColumn,
  getProjectIdForTask,
  persistTaskPositions,
  revalidateKanbanBoardLists,
} from "@/lib/kanban/action-helpers";

`;

const files = {
  "board.ts": [
    [225, 297],
    [1120, 1134],
  ],
  "tasks.ts": [
    [354, 737],
    [916, 1278],
    [1769, lines.length],
  ],
  "columns.ts": [[737, 916]],
  "drafts.ts": [[1278, 1668]],
  "queries.ts": [[1668, 1769]],
};

for (const [fname, ranges] of Object.entries(files)) {
  const chunks = ranges.flatMap(([start, end]) => lines.slice(start, end));
  let body = chunks.join("\n");
  if (fname === "board.ts") {
    body =
      'export type { BoardSnapshotInput } from "@/lib/kanban/board-snapshot-types";\n\n' +
      body;
  }
  fs.writeFileSync(
    path.join(root, "actions/kanban", fname),
    commonImports + body + "\n",
  );
}

fs.copyFileSync(
  path.join(root, "app/home/kanban/actions.ts"),
  path.join(root, "actions/kanban/boards-list.ts"),
);
fs.copyFileSync(
  path.join(root, "app/home/kanban/[projectId]/actions.ts"),
  path.join(root, "actions/kanban/sprints.ts"),
);

const index = [
  'export * from "./board";',
  'export * from "./tasks";',
  'export * from "./columns";',
  'export * from "./drafts";',
  'export * from "./queries";',
  'export * from "./boards-list";',
  'export * from "./sprints";',
  "",
].join("\n");
fs.writeFileSync(path.join(root, "actions/kanban/index.ts"), index);

console.log("Split kanban actions into actions/kanban/");
