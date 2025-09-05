"use client";

import { useEffect, useState } from "react";
import { createClientClientComponent } from "@/utils/supabase/client";
import { Task } from "@/types/home/codev";
import { IconArchive } from "@/public/assets/svgs";

import toast from "react-hot-toast";
import ArchiveTask from "./ArchiveTask";

interface ArchiveColumnProps {
  projectId: string;
  boardId: string;
}

export default function ArchiveColumn({ projectId, boardId }: ArchiveColumnProps) {
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const fetchArchivedTasks = async () => {
      setIsLoading(true);
      try {
        // First get all column IDs for this board
        const { data: columns, error: columnsError } = await supabase
          .from("kanban_columns")
          .select("id")
          .eq("board_id", boardId);

        if (columnsError) throw columnsError;

        const columnIds = columns.map(col => col.id);

        if (columnIds.length === 0) {
          setArchivedTasks([]);
          return;
        }

        // Then fetch archived tasks for these columns
        const { data: tasks, error: tasksError } = await supabase
          .from("tasks")
          .select(`
            id,
            title,
            description,
            priority,
            difficulty,
            type,
            due_date,
            points,
            pr_link,
            sidekick_ids,
            created_by,
            kanban_column_id,
            is_archive,
            created_at,
            updated_at,
            skill_category_id,
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
          `)
          .in("kanban_column_id", columnIds)
          .eq("is_archive", true)
          .order("updated_at", { ascending: false });

        if (tasksError) throw tasksError;

        setArchivedTasks(tasks || []);
      } catch (error) {
        console.error("Error fetching archived tasks:", error);
        toast.error("Failed to load archived tasks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchivedTasks();
  }, [supabase, boardId]);

  const handleDeleteTask = async (taskId: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;

      // Remove from local state
      setArchivedTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center rounded-lg bg-lightgray p-4 dark:bg-black-100">
        <div className="flex items-center gap-3">
          <IconArchive className="h-6 w-6 text-secondary dark:text-secondary" />
          <div>
            <h2 className="text-lg font-semibold text-black-100 dark:text-white">
              Archive
            </h2>
            <p className="text-sm text-secondary dark:text-secondary">
              {archivedTasks.length} completed task{archivedTasks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-secondary">Loading archived tasks...</div>
        </div>
      ) : (
        <div className="mt-4 flex-1 overflow-y-auto">
          {archivedTasks.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-secondary">
              No archived tasks found
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {archivedTasks.map((task) => (
                <ArchiveTask
                  key={task.id}
                  task={task}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
