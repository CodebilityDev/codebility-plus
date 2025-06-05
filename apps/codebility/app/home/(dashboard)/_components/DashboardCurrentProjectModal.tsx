"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { useModal } from "@/hooks/use-modal";
import {
  IconPriority1,
  IconPriority2,
  IconPriority3,
  IconPriority4,
  IconPriority5,
} from "@/public/assets/svgs";
import { Task } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";

export default function DashboardCurrentProjectModal() {
  const { isOpen, onClose, type, data } = useModal();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error] = useState<string | null>(null);
  const [kanbanBoardId, setKanbanBoardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);

  const isModalOpen = isOpen && type === "dashboardCurrentProjectModal";

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  const router = useRouter();

  const projectId = data?.projectId;

  const handleGoToKanban = () => {
    if (kanbanBoardId) {
      onClose();
      router.push(`/home/kanban/project/${kanbanBoardId}`);
    }
  };

  useEffect(() => {
    if (!supabase) return;
    const fetchUserTasks = async () => {
      if (!isModalOpen || !projectId) return;

      setIsLoading(true);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Error getting user:", userError);
          return;
        }

        const { data: projectMemberships, error: pmError } = await supabase
          .from("project_members")
          .select("project_id")
          .eq("codev_id", user.id);

        if (pmError || !projectMemberships) {
          console.error("Error fetching user's project memberships:", pmError);
          return;
        }

        const projectIds = projectMemberships.map((pm: any) => pm.project_id);

        if (!projectIds.includes(projectId)) {
          console.log("User is not a member of this project.");
          setTasks([]);
          return;
        }

        const { data: kanbanBoards, error: kanbanError } = await supabase
          .from("kanban_boards")
          .select("id, project_id")
          .eq("project_id", projectId);

        if (kanbanError || !kanbanBoards) {
          console.error("Error fetching kanban boards:", kanbanError);
          return;
        }

        const board = kanbanBoards[0];
        if (board) {
          setKanbanBoardId(board.id);
        }

        const { data: rawTasks, error: taskError } = await supabase
          .from("tasks")
          .select(
            `*,
            kanban_columns!kanban_column_id (
              board_id,
              kanban_boards!board_id (
                id,
                project_id
              )
            )`,
          )
          .eq("codev_id", user.id);

        if (taskError) {
          console.error("Error fetching tasks:", taskError);
          return;
        }

        const filteredTasks = (rawTasks || []).filter((task: any) => {
          return task.kanban_columns?.kanban_boards?.project_id === projectId;
        });

        setTasks(filteredTasks);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTasks();
  }, [isModalOpen, projectId, supabase]);

  if (isLoading) {
    return (
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="w-[90%] max-w-3xl">
          <DialogHeader>
            <DialogTitle className="mb-2 text-left text-lg">
              Kanban Details
            </DialogTitle>
            <p>Your Ticket(s):</p>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="bg-black-100 relative mt-1 flex h-24 flex-col gap-2 rounded-lg p-2 md:mt-2 md:gap-3 md:p-4"></Skeleton>
            <Skeleton className="bg-black-100 relative mt-1 flex h-24 flex-col gap-2 rounded-lg p-2 md:mt-2 md:gap-3 md:p-4"></Skeleton>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!isModalOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent aria-describedby={undefined} className="w-[90%] max-w-3xl">
        <DialogHeader>
          <DialogTitle className="mb-2 text-left text-lg">
            Kanban Details
          </DialogTitle>
        </DialogHeader>
        <p>Your Ticket(s):</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : tasks.length > 0 ? (
            tasks.map((tasked) => (
              <div
                key={tasked.id}
                className="bg-lightgray dark:bg-black-100 relative mt-1 flex flex-col gap-2 rounded-lg p-2 md:mt-2 md:gap-3 md:p-4"
              >
                <div className="flex items-center justify-between">
                  <h3
                    className="mr-2 line-clamp-2 flex-1 text-sm font-bold 
            text-gray-800 transition-colors group-hover:text-blue-600
            dark:text-gray-200 dark:group-hover:text-blue-400 md:text-base"
                  >
                    {tasked.title}
                  </h3>
                  <div className="flex flex-shrink-0 items-center gap-1 md:gap-2">
                    <div
                      className={`flex items-center justify-center rounded-full p-0.5 md:p-1 ${
                        tasked.priority === "critical"
                          ? "bg-red-100 dark:bg-red-900/30"
                          : tasked.priority === "high"
                            ? "bg-orange-100 dark:bg-orange-900/30"
                            : tasked.priority === "medium"
                              ? "bg-yellow-100 dark:bg-yellow-900/30"
                              : "bg-green-100 dark:bg-green-900/30"
                      }`}
                    >
                      {tasked.priority === "critical" ? (
                        <IconPriority1 className="h-5 w-5 text-red-500" />
                      ) : tasked.priority === "high" ? (
                        <IconPriority2 className="h-5 w-5 text-orange-500" />
                      ) : tasked.priority === "medium" ? (
                        <IconPriority3 className="h-5 w-5 text-yellow-500" />
                      ) : tasked.priority === "low" ? (
                        <IconPriority4 className="h-5 w-5 text-green-500" />
                      ) : (
                        <IconPriority5 className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Task Details */}
                <div className="flex flex-wrap gap-1 text-xs text-gray-600 dark:text-gray-400 md:gap-2 md:text-sm">
                  {tasked.difficulty && (
                    <span
                      className="inline-flex items-center rounded-md bg-purple-100 
              px-1.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 
              dark:text-purple-300 md:px-2 md:py-1"
                    >
                      {tasked.difficulty}
                    </span>
                  )}
                  {typeof tasked.points === "number" && (
                    <span
                      className="inline-flex items-center rounded-md bg-green-100 
              px-1.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 
              dark:text-green-300 md:px-2 md:py-1"
                    >
                      {tasked.points} pts
                    </span>
                  )}
                  {tasked.type && (
                    <span
                      className="inline-flex items-center rounded-md bg-gray-100 
              px-1.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 
              dark:text-gray-300 md:px-2 md:py-1"
                    >
                      {tasked.type}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="mt-2 text-sm">No ticket(s) assigned to you.</p>
          )}
        </div>

        <DialogFooter>
          <div className="flex gap-2">
            <button
              onClick={handleGoToKanban}
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              Go to Kanban
            </button>
            <button onClick={onClose} className="rounded bg-gray-300 px-4 py-2">
              Close
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
