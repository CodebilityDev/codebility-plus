"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
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

// Line 26-28: Configure which column names indicate completed work
const COMPLETED_COLUMN_NAMES = ["done", "finished", "completed", "approved"];

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

  // Line 48-54: Navigate to kanban board (preserves original functionality)
  const handleGoToKanban = () => {
    if (kanbanBoardId) {
      onClose();
      router.push(`/home/kanban/${projectId}/${kanbanBoardId}`);
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

        // Line 106-120: Enhanced query to include column name for filtering
        const { data: rawTasks, error: taskError } = await supabase
          .from("tasks")
          .select(
            `*,
            kanban_columns!kanban_column_id (
              id,
              name,
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

        // Line 125-134: Filter logic - exclude "Done" column tasks and match project
        const filteredTasks = (rawTasks || []).filter((task: any) => {
          const matchesProject = task.kanban_columns?.kanban_boards?.project_id === projectId;
          
          // Line 129-131: Check if task is in a "completed" column
          const columnName = task.kanban_columns?.name?.toLowerCase() || "";
          const isCompleted = COMPLETED_COLUMN_NAMES.some(completedName => 
            columnName.includes(completedName)
          );
          
          // Show only active tasks (not in Done/Completed columns)
          return matchesProject && !isCompleted;
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

  // Line 153-169: Loading skeleton with responsive grid
  if (isLoading) {
    return (
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className="
          w-[95vw] max-w-[95vw]
          md:w-[90vw] md:max-w-4xl
          lg:w-[80vw] lg:max-w-5xl
          max-h-[85vh] overflow-y-auto
        ">
          <DialogHeader>
            <DialogTitle className="mb-2 text-left text-lg text-gray-900 dark:text-white">
              Kanban Details
            </DialogTitle>
            <p className="text-gray-700 dark:text-gray-300">Your Active Ticket(s):</p>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="bg-gray-200 dark:bg-gray-800 relative mt-1 flex h-24 flex-col gap-2 rounded-lg p-2 md:mt-2 md:gap-3 md:p-4"></Skeleton>
            <Skeleton className="bg-gray-200 dark:bg-gray-800 relative mt-1 flex h-24 flex-col gap-2 rounded-lg p-2 md:mt-2 md:gap-3 md:p-4"></Skeleton>
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
      {/* Line 184-189: Responsive modal container with proper dark mode support */}
      <DialogContent 
        aria-describedby={undefined} 
        className="
          w-[95vw] max-w-[95vw]
          md:w-[90vw] md:max-w-4xl
          lg:w-[80vw] lg:max-w-5xl
          max-h-[85vh] overflow-y-auto
          bg-white dark:bg-gray-900
          border-gray-200 dark:border-gray-700
        "
      >
        <DialogHeader>
          <DialogTitle className="mb-2 text-left text-lg text-gray-900 dark:text-white">
            Kanban Details
          </DialogTitle>
        </DialogHeader>
        
        <p className="text-gray-700 dark:text-gray-300">Your Active Ticket(s):</p>
        
        {/* Line 204-207: Responsive grid layout */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          {error ? (
            <p className="text-red-500 dark:text-red-400">{error}</p>
          ) : tasks.length > 0 ? (
            tasks.map((tasked) => (
              <div
                key={tasked.id}
                className="
                  bg-gray-50 dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  relative mt-1 flex flex-col gap-2 rounded-lg p-2 
                  md:mt-2 md:gap-3 md:p-4
                  hover:border-customBlue-400 dark:hover:border-customBlue-500
                  transition-colors duration-200
                "
              >
                <div className="flex items-center justify-between">
                  <h3
                    className="
                      mr-2 line-clamp-2 flex-1 text-sm font-bold 
                      text-gray-800 dark:text-gray-100
                      md:text-base
                    "
                  >
                    {tasked.title}
                  </h3>
                  
                  {/* Line 232-252: Priority icon with dark mode colors */}
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

                {/* Line 258-294: Task metadata badges with dark mode support */}
                <div className="flex flex-wrap gap-1 text-xs text-gray-600 dark:text-gray-400 md:gap-2 md:text-sm">
                  {tasked.difficulty && (
                    <span
                      className="
                        inline-flex items-center rounded-md 
                        bg-purple-100 dark:bg-purple-900/30
                        px-1.5 py-0.5 text-xs font-medium 
                        text-purple-700 dark:text-purple-300 
                        md:px-2 md:py-1
                      "
                    >
                      {tasked.difficulty}
                    </span>
                  )}
                  {typeof tasked.points === "number" && (
                    <span
                      className="
                        inline-flex items-center rounded-md 
                        bg-green-100 dark:bg-green-900/30
                        px-1.5 py-0.5 text-xs font-medium 
                        text-green-700 dark:text-green-300 
                        md:px-2 md:py-1
                      "
                    >
                      {tasked.points} pts
                    </span>
                  )}
                  {tasked.type && (
                    <span
                      className="
                        inline-flex items-center rounded-md 
                        bg-gray-100 dark:bg-gray-700
                        px-1.5 py-0.5 text-xs font-medium 
                        text-gray-700 dark:text-gray-300 
                        md:px-2 md:py-1
                      "
                    >
                      {tasked.type}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            // Line 300-302: Empty state with dark mode
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 col-span-full text-center py-8">
              No active tickets assigned to you.
            </p>
          )}
        </div>

        {/* Line 307-322: Footer buttons with dark mode styling */}
        <DialogFooter>
          <div className="flex gap-2">
            <button
              onClick={handleGoToKanban}
              className="
                rounded bg-customBlue-600 hover:bg-customBlue-700 
                px-4 py-2 text-white font-medium
                transition-colors duration-200
                dark:bg-customBlue-500 dark:hover:bg-customBlue-600
              "
            >
              Go to Kanban
            </button>
            <button 
              onClick={onClose} 
              className="
                rounded bg-gray-300 hover:bg-gray-400 
                dark:bg-gray-700 dark:hover:bg-gray-600
                px-4 py-2 text-gray-900 dark:text-white font-medium
                transition-colors duration-200
              "
            >
              Close
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}