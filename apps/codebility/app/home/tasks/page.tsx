"use client";

import { useEffect, useState } from "react";
import H1 from "@/Components/shared/dashboard/H1";
import { useUserStore } from "@/store/codev-store";
import { Task } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";

import TasksContainer from "./_components/TasksContainer";

export default function TaskPage() {
  const { user, isLoading: userLoading } = useUserStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskLoading, setIsTaskLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      if (!user) return;

      setIsTaskLoading(true);
      setError(null);

      try {
        const supabase = createClientClientComponent();

        const { data, error } = await supabase
          .from("tasks")
          .select(
            `
            id,
            title,
            description,
            priority,
            difficulty,
            type,
            due_date,
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
          `,
          )
          .eq("codev_id", user.id);

        if (error) throw error;

        // Normalize any array responses to single objects
        const fetchedTasks: Task[] = (data || []).map((task) => {
          // If kanban_column is an array, grab the first element
          const column = Array.isArray(task.kanban_column)
            ? task.kanban_column[0]
            : task.kanban_column;

          if (!column) {
            // No column, return task as is
            return { ...task, kanban_column: undefined };
          }

          // If board is an array, grab the first element
          const board = Array.isArray(column.board)
            ? column.board[0]
            : column.board;

          if (!board) {
            // Column is valid but no board
            return {
              ...task,
              kanban_column: { ...column, board: undefined },
            };
          }

          // Safely check if board has project property
          const hasProject =
            board && typeof board === "object" && "project" in board;

          // If it has project property, normalize it
          const project = hasProject
            ? Array.isArray(board.project)
              ? board.project[0]
              : board.project
            : undefined;

          return {
            ...task,
            kanban_column: {
              ...column,
              board: {
                ...board,
                project: project || undefined,
              },
            },
          };
        });

        setTasks(fetchedTasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Unable to load tasks. Please try again later.");
      } finally {
        setIsTaskLoading(false);
      }
    }

    fetchTasks();
  }, [user]);

  // Loading state
  if (userLoading || isTaskLoading) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-screen-xl flex-col gap-4">
        <H1>My Tasks</H1>
        <p>Loading tasks...</p>
      </div>
    );
  }

  // No user
  if (!user) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-screen-xl flex-col gap-4">
        <H1>My Tasks</H1>
        <p>Please log in to view your tasks.</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-screen-xl flex-col gap-4">
        <H1>My Tasks</H1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-screen-xl flex-col gap-4">
      <div className="flex justify-between gap-4">
        <H1>My Tasks</H1>
      </div>
      <TasksContainer tasks={tasks} />
    </div>
  );
}
