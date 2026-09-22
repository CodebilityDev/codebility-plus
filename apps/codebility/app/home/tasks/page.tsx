import { ReactNode, Suspense } from "react";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import H1 from "@/components/shared/dashboard/H1";
import { Task } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";

import { TaskWithRelations } from "./_components/TaskCard";
import TasksContainer from "./_components/TasksContainer";
import TasksLoading from "./loading";

const TASKS_SELECT = `
    id,
    title,
    description,
    priority,
    difficulty,
    type,
    due_date,
    deadline,
    points,
    codev_id,
    kanban_column:kanban_columns (
      id,
      name,
      board:kanban_boards (
        id,
        name,
        project:projects (
          id,
          name
        )
      )
    ),
    created_by,
    created_at,
    updated_at
  `;

type MaybeArray<T> = T | T[] | null;

interface RawProject {
  id: string;
  name: string;
}

interface RawBoard {
  id: string;
  name: string;
  project?: MaybeArray<RawProject>;
}

interface RawColumn {
  id: string;
  name: string;
  board?: MaybeArray<RawBoard>;
}

interface RawTask extends Task {
  kanban_column?: MaybeArray<RawColumn>;
}

// Supabase returns nested relations as either an object or a single-element
// array depending on how it resolves the join, so flatten them to objects.
function normalizeTask(task: RawTask): TaskWithRelations {
  const column = Array.isArray(task.kanban_column)
    ? task.kanban_column[0]
    : task.kanban_column;

  if (!column) {
    return { ...task, kanban_column: undefined };
  }

  const board = Array.isArray(column.board) ? column.board[0] : column.board;

  if (!board) {
    return { ...task, kanban_column: { ...column, board: undefined } };
  }

  const project = Array.isArray(board.project)
    ? board.project[0]
    : board.project;

  return {
    ...task,
    kanban_column: {
      ...column,
      board: { ...board, project: project || undefined },
    },
  };
}

function TasksShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-screen-xl flex-col gap-4">
      <div className="flex justify-between gap-4">
        <H1>My Tasks</H1>
      </div>
      {children}
    </div>
  );
}

async function TasksData() {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return (
      <TasksShell>
        <p>Please log in to view your tasks.</p>
      </TasksShell>
    );
  }

  const { data: codev, error: codevError } = await supabase
    .from("codev")
    .select("id")
    .eq("id", user.id)
    .single();

  if (codevError || !codev) {
    return (
      <TasksShell>
        <p>Please log in to view your tasks.</p>
      </TasksShell>
    );
  }

  const { data, error } = await supabase
    .from("tasks")
    .select(TASKS_SELECT)
    .eq("codev_id", codev.id);

  if (error) {
    console.error("Error fetching tasks:", error);
    return (
      <TasksShell>
        <p>Unable to load tasks. Please try again later.</p>
      </TasksShell>
    );
  }

  const tasks = (data ?? []).map((task) => normalizeTask(task as RawTask));

  return (
    <TasksShell>
      <TasksContainer tasks={tasks} />
    </TasksShell>
  );
}

export default function TaskPage() {
  return (
    <AsyncErrorBoundary
      fallback={
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 text-4xl">📝</div>
          <h2 className="mb-2 text-xl font-semibold">Unable to load tasks</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Something went wrong while fetching your tasks. Please refresh to
            try again.
          </p>
        </div>
      }
    >
      <Suspense fallback={<TasksLoading />}>
        <TasksData />
      </Suspense>
    </AsyncErrorBoundary>
  );
}
