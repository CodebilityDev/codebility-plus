# Kanban implementation plan

A realtime kanban area under `/home/kanban`, written fresh, inside the current
folder architecture.

Read before writing:

- `.cursor/skills/codebility-contribution-rules/SKILL.md`
- `AGENTS.md`

Rules that bite here: no comments in code, route-scoped folders, reuse before
writing, no fetch or check in a layout, no Suspense boundary around a whole page
body, no second implementation of something that already exists.

Stack: Next.js 16 with `cacheComponents: true`, React 19, Zustand, Supabase
Realtime, dnd-kit.

## Flow

Three levels, each a route.

| Route | Renders |
| --- | --- |
| `/home/kanban` | table of projects |
| `/home/kanban/[projectId]` | table of sprints for that project |
| `/home/kanban/[projectId]/[sprintId]` | the kanban board |

The sidebar gets one item, `Kanban`, in the Management section, gated on the
`roles.kanban` permission.

Data chain:

    projects
      -> kanban_sprints        where project_id = [projectId]
        -> kanban_boards       where id = sprint.board_id
          -> kanban_columns    where board_id = board.id
            -> tasks           where kanban_column_id in columnIds

`tasks` has no `board_id` and no `sprint_id`, so the board is reached through the
sprint and then through the columns. That is why the third segment is the sprint,
not the board.

Navigation within the area is plain links plus a breadcrumb. No client router
state, no tabs.

## Scope

MVP:

- projects table and sprints table, both read-only lists
- sprint creation, because a project with no sprints is a dead end
- board with columns and task cards
- drag inside a column and across columns
- order persisted with fractional positions
- Supabase Realtime sync between clients
- breadcrumb across the three levels
- page gated on `roles.kanban`

Not in the MVP:

- project creation and editing, projects come from the existing table
- board switching inside a sprint
- drafts, archive, comments, rich text, attachments
- filters, search, virtualization
- assignment editing UI
- realtime on the projects and sprints tables

The deleted implementation at `51d9eb1e` holds about 90 files. Reference only. Do
not port it.

## Locked decisions

| Area | Decision |
| --- | --- |
| Initial render | RSC pages, `"use cache"` loaders, Suspense around the streamed part only |
| Expected route markers | `◐` for all three routes |
| Live state | Zustand store created per provider render, selectors per card and column |
| Realtime | `postgres_changes` on `tasks` and `kanban_columns`, board route only |
| Writes | server actions, then `updateTag(CACHE_TAGS.kanbanBoard)` |
| TanStack Query | not used |
| `@tanstack/react-table` | not used by kanban |
| List tables | plain semantic `<table>` markup, server components, no client JS |
| Ordering | integer `position` with 1000 gaps, renumber only on collision |
| Subscription scope | client-side filter by the board column ids |
| Drag and drop | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |

Two notes on the table decision. The primitives in
`components/home/applicants/table.tsx` are route-scoped, so kanban cannot import
them, and copying them would be a second implementation. Promoting them to
`components/global/ui/` would force an edit to a working feature that this task
does not touch. The two kanban lists need no sorting, filtering or virtualizing,
so plain `<table>` markup is less code than any of those options.

The realtime publication for `tasks` and `kanban_columns` already exists
(`supabase/migrations/20260902_enable_kanban_realtime.sql`, with
`REPLICA IDENTITY FULL`). Do not recreate it. `kanban_boards` and
`kanban_sprints` are not published, which is why the two list pages are not live.

## Open questions, defaults chosen

| Question | Default | Override cost |
| --- | --- | --- |
| Project list filter | all projects, ordered by name, `kanban_display` selected for a badge | one `.eq()` |
| Sprint without a board | provisioned on first open | none, it is the fallback path |
| Task fields | title, description, priority, `codev_id`, `due_date` | small, columns exist |
| Who can edit | anyone whose role has `kanban` | adds a per-role check in the actions |

## Route map

All three resolve to lint route `home/kanban`, because the rule strips dynamic
segments. So every kanban component lives flat in `components/home/kanban/` and
all three pages can import it. No subfolders, no per-segment folder.

| Route file | Role |
| --- | --- |
| `app/home/kanban/page.tsx` | projects table |
| `app/home/kanban/loading.tsx` | skeleton |
| `app/home/kanban/[projectId]/page.tsx` | sprints table |
| `app/home/kanban/[projectId]/loading.tsx` | skeleton |
| `app/home/kanban/[projectId]/[sprintId]/page.tsx` | board |
| `app/home/kanban/[projectId]/[sprintId]/loading.tsx` | skeleton |

`params` is a Promise in this Next version. The page awaits it in the async child
that sits inside Suspense, not in the page body, so the shell stays static.

## File map

Every path is new unless marked.

| Path | Owner |
| --- | --- |
| `constants/home/kanban/kanban.ts` | stage 0 |
| `utils/home/kanban/position.ts` | stage 0 |
| `types/home/kanban/kanban.ts` | stage 0 |
| `lib/home/kanban/kanban-cached.ts` | DATA |
| `actions/home/kanban/board.ts` | DATA |
| `actions/home/kanban/sprints.ts` | DATA |
| `actions/home/kanban/tasks.ts` | DATA |
| `store/home/kanban/kanban-store.ts` | STATE |
| `hooks/home/kanban/use-kanban-realtime.ts` | STATE |
| `hooks/home/kanban/use-kanban-actions.ts` | STATE |
| `components/home/kanban/KanbanBoard.tsx` | BOARD-UI |
| `components/home/kanban/KanbanColumn.tsx` | BOARD-UI |
| `components/home/kanban/KanbanTaskCard.tsx` | BOARD-UI |
| `components/home/kanban/KanbanDragOverlay.tsx` | BOARD-UI |
| `components/home/kanban/KanbanBoardSkeleton.tsx` | BOARD-UI |
| `components/home/kanban/KanbanConnectionBadge.tsx` | BOARD-UI |
| `components/home/kanban/KanbanTaskComposer.tsx` | BOARD-UI |
| `components/home/kanban/KanbanBreadcrumb.tsx` | NAV-UI |
| `components/home/kanban/KanbanProjectsTable.tsx` | NAV-UI |
| `components/home/kanban/KanbanSprintsTable.tsx` | NAV-UI |
| `components/home/kanban/KanbanListSkeleton.tsx` | NAV-UI |
| `components/home/kanban/KanbanSprintCreateButton.tsx` | NAV-UI |
| `components/home/kanban/KanbanEmptyState.tsx` | NAV-UI |
| `providers/home/kanban/KanbanStoreProvider.tsx` | integration |
| the six route files above | integration |
| `constants/global/paths.ts` | stage 0, edit |
| `types/home/home.ts` | stage 0, edit |
| `actions/home/sidebar.ts` | stage 0, edit |
| `lib/global/cache-tags.ts` | stage 0, edit |
| `proxy.ts` | stage 0, edit |
| `apps/codebility/package.json` | stage 0, edit |

A file in `components/home/kanban/` may import from any `global/` folder and from
`actions/home/kanban/`, `hooks/home/kanban/`, `store/home/kanban/`,
`lib/home/kanban/`, `constants/home/kanban/`, `types/home/kanban/`,
`utils/home/kanban/`. It may not import from `components/home/applicants/` or
from `app/`.

## Stage 0, contract freeze

Owner: main agent. Blocks every sub-agent.

1. Add dependencies: `@dnd-kit/core@^6.3.1`, `@dnd-kit/sortable@^8.0.0`,
   `@dnd-kit/utilities@^3.2.2`.
2. Route wiring:
   - `constants/global/paths.ts`: add `kanban: "/home/kanban"` under `app`. Deeper
     URLs are built with template strings, the way `/profiles/[id]` already is.
   - `types/home/home.ts`: add `kanban: boolean` to `RolePermissions`.
   - `actions/home/sidebar.ts`: add `kanban` to the `roles` select, to
     `INACTIVE_PERMISSIONS`, and a Management link with
     `permission: "kanban"` and `imgURL: "/assets/svgs/icon-kanban.svg"`.
   - `lib/global/cache-tags.ts`: add `kanbanBoard: "kanban-board"`.
   - `proxy.ts`: add `"/home/kanban": "kanban"` to `routePermissionMap`. The
     existing prefix match covers the two nested routes.
3. Check the data once, read only:
   - a project count, and whether `kanban_display` is set on any row
   - a sprint count, and how many sprints have `board_id` null
   - a board and column count
   The answers decide whether the sprint creation and board provisioning paths are
   on the critical path for verification, or only defensive.
4. Freeze the contract files below. No other agent edits them.

### Contract

`types/home/kanban/kanban.ts`

```ts
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

export interface KanbanState {
  columnsById: Record<string, KanbanColumn>;
  columnOrder: string[];
  tasksById: Record<string, KanbanTask>;
  taskIdsByColumn: Record<string, string[]>;
  activeTaskId: string | null;
  pending: Record<string, boolean>;
  connection: "connecting" | "live" | "offline";
}
```

`constants/home/kanban/kanban.ts`

```ts
export const PROJECT_COLUMNS =
  "id, name, status, project_code, start_date, end_date, kanban_display";

export const SPRINT_COLUMNS = "id, name, start_at, end_at, board_id, project_id";

export const TASK_COLUMNS =
  "id, title, description, kanban_column_id, position, priority, codev_id, due_date, updated_at";

export const COLUMN_COLUMNS = "id, name, position, board_id";

export const DEFAULT_COLUMN_NAMES = ["Backlog", "In Progress", "Done"];
```

`utils/home/kanban/position.ts`

```ts
export const POSITION_GAP = 1000;
export interface PositionPlan {
  position: number;
  renumber: boolean;
}
export function resolvePosition(prev: number | null, next: number | null): PositionPlan;
export function assignPositions(orderedIds: string[]): { id: string; position: number }[];
```

Neighbours come from the destination column's ordered task list. `null` means
there is no neighbour on that side. Adjacent integer positions leave no room, so
`renumber: true` tells the caller to rewrite the column with `assignPositions`.
The live column is `integer`, not `numeric`, so the code must not assume a
fraction persists.

### Cached loaders, `lib/home/kanban/kanban-cached.ts`

```ts
getCachedProjects(): Promise<ProjectListItem[]>
getCachedSprints(projectId: string): Promise<SprintListItem[]>
getCachedBoard(sprintId: string): Promise<KanbanBoardSnapshot | null>
```

Each carries `"use cache"`, `cacheLife("hours")` and
`cacheTag(CACHE_TAGS.kanbanBoard)`, and uses `createClientAnon`.

### Actions

```ts
getBoardSnapshot(sprintId: string): Promise<KanbanBoardSnapshot | null>
ensureBoardForSprint(sprintId: string): Promise<{ boardId: string }>
createSprint(input: {
  projectId: string;
  name: string;
  startAt: string;
  endAt: string;
}): Promise<{ sprintId: string }>
moveTask(input: { taskId: string; toColumnId: string; targetIndex: number }): Promise<void>
createTask(input: { columnId: string; title: string; description?: string; priority?: string }): Promise<void>
updateTask(input: { taskId: string; title?: string; description?: string; priority?: string }): Promise<void>
deleteTask(taskId: string): Promise<void>
```

`getBoardSnapshot` is the uncached resync path and uses
`createClientServerComponent`. `createSprint` inserts the sprint, then provisions
the board and the default columns through the same helper
`ensureBoardForSprint` uses, so a sprint that ends up without a board heals the
next time it is opened.

### Store API

```ts
createKanbanStore(snapshot: KanbanBoardSnapshot | null)
applySnapshot(snapshot: KanbanBoardSnapshot): void
upsertTask(task: KanbanTask): void
removeTask(taskId: string): void
moveTaskLocally(taskId: string, toColumnId: string, targetIndex: number): void
setActiveTask(taskId: string | null): void
setConnection(status: KanbanState["connection"]): void
setPending(taskId: string, pending: boolean): void
```

## Stage 1, four parallel sub-agents

Spawn all four in one message, after stage 0 lands. Each brief repeats the
codebase rules and the two skill paths, because a sub-agent starts with no
context.

### Agent DATA

Owns: the migration, `lib/home/kanban/kanban-cached.ts`,
`actions/home/kanban/board.ts`, `actions/home/kanban/sprints.ts`,
`actions/home/kanban/tasks.ts`.

Requirements:

- Every action validates its input with zod before touching the database.
- Every write calls `updateTag(CACHE_TAGS.kanbanBoard)`.
- `moveTask` writes one row. It reads the neighbours, computes the midpoint, and
  updates `position` and `kanban_column_id` only.
- `getCachedSprints` and `getCachedBoard` map `board_id` to `hasBoard` and resolve
  the project and sprint names the breadcrumb needs.
- Selects name columns. No `select("*")`.
- `ensureBoardForSprint` is idempotent.

Acceptance: `tsc` clean, `moveTask` updates exactly one task row,
`ensureBoardForSprint` called twice creates one board.

### Agent STATE

Owns: `store/home/kanban/kanban-store.ts`,
`hooks/home/kanban/use-kanban-realtime.ts`,
`hooks/home/kanban/use-kanban-actions.ts`.

Requirements:

- The store is created per provider render. Never a module-level singleton,
  because the server would share one store across requests.
- One channel per board with `createClientClientComponent()`, listening to
  `postgres_changes` on `tasks` and `kanban_columns`, filtered by the board
  column ids, removed with `removeChannel` on unmount.
- Drop an incoming row when its `updated_at` is not newer than the local one.
  That is the echo guard for our own writes.
- On `SUBSCRIBED`, call `getBoardSnapshot` and `applySnapshot`. Realtime has no
  replay, so a reconnect resyncs from the server.
- `use-kanban-actions` applies the move locally first, marks the task pending,
  calls `moveTask`, then clears pending. On failure it restores the snapshot.
- No subscription or state in a component that renders cards.

Acceptance: `tsc` clean, channel removed on unmount, pending cleared on every
path.

### Agent BOARD-UI

Owns: every file under `components/home/kanban/` starting with `KanbanBoard`,
`KanbanColumn`, `KanbanTaskCard`, `KanbanDragOverlay`, `KanbanBoardSkeleton`,
`KanbanConnectionBadge`, `KanbanTaskComposer`.

Requirements:

- `KanbanBoard` renders `DndContext`, `DragOverlay` and the columns. It does not
  subscribe to task data. Task data is read inside `KanbanTaskCard` and
  `KanbanColumn` through selectors, so a move rerenders two columns, not the
  board.
- `KanbanTaskCard` and `KanbanColumn` are wrapped in `memo` and take primitive
  props (`taskId`, `columnId`).
- Sensors: `PointerSensor` with `{ distance: 8 }`, `TouchSensor` with
  `{ delay: 250, tolerance: 5 }`, `KeyboardSensor` with
  `sortableKeyboardCoordinates`.
- `collisionDetection={closestCorners}`,
  `measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}`.
- `DragOverlay` renders a presentational card only.
- Keyboard drag works. Every card has an accessible name.
- Does not import the breadcrumb, the tables or the route files. The pages compose
  those.
- Base UI comes from `@codevs/ui` where a component exists.

Acceptance: `tsc` clean, keyboard reorder works, no store read in the board
parent.

### Agent NAV-UI

Owns: `KanbanBreadcrumb`, `KanbanProjectsTable`, `KanbanSprintsTable`,
`KanbanListSkeleton`, `KanbanSprintCreateButton`, `KanbanEmptyState`.

Requirements:

- The two tables are server components. Plain `<table>`, `<thead>`, `<tbody>`,
  Tailwind for the look, one row per record, the row link is an `<a>` or a
  `next/link` covering the name cell. No `@tanstack/react-table`, no client
  component, no state.
- `KanbanSprintCreateButton` is the only client file here. It opens a minimal
  form, calls `createSprint`, then `router.refresh()`.
- The breadcrumb takes names as props and renders links. It fetches nothing.
- Empty states cover: no projects, no sprints, no board.
- Accessible table markup: a caption or an `aria-label`, and `scope="col"` on the
  headers.

Acceptance: `tsc` clean, and the two list pages ship zero client JavaScript of
their own.

## Stage 2, integration

Owner: main agent.

- `providers/home/kanban/KanbanStoreProvider.tsx` creates the store with
  `useState(() => createKanbanStore(snapshot))` and exposes it through context.
- Each of the six route files is a sync component. The shell, the breadcrumb and
  the heading render immediately. One Suspense boundary wraps the part that
  awaits: the table body or the board.
- `loading.tsx` in each segment returns the matching skeleton.
- No fetch and no permission check in a layout. There is no kanban layout.
- `params` is awaited inside the suspended child.

## Stage 3, verification

Owner: Agent VERIFY, then main agent for the final call.

1. `pnpm --filter codebility lint`
2. `pnpm --filter codebility typecheck`
3. `pnpm codebility:build`, expect exit 0 and all three kanban routes marked `◐`
4. Playwright, walk the flow: sidebar link, projects table, click a project,
   sprints table, click a sprint, board renders.
5. Playwright, two tabs on the same board: drag in tab A, assert the card moved in
   tab B within two seconds and without a reload.
6. Playwright: drop the realtime connection, confirm the badge leaves `live` and
   recovers.
7. Permission: a role with `kanban = false` has no sidebar link and is redirected
   from all three routes.
8. Delete every Playwright script and screenshot in the same turn it ran.

## Risks and ceilings

| Risk | Handling |
| --- | --- |
| Realtime echo of our own write | `updated_at` guard plus the pending map |
| Two users move the same card | last write wins, accepted for a team board |
| Two users open a boardless sprint at once | `ensureBoardForSprint` can create two boards, one orphaned. Rare, and the unique index on `kanban_sprints.board_id` keeps the visible one stable |
| Realtime traffic without `board_id` on `tasks` | client-side filter, add the column when board count grows |
| The two list pages are not live | accepted, they are cached and the board is the live surface |
| Sub-agent conflicts | stage 0 freezes every shared file and every signature |
