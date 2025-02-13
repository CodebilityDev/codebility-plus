import { useEffect, useState } from "react";
import DefaultAvatar from "@/Components/DefaultAvatar";
import {
  IconPriority1,
  IconPriority2,
  IconPriority3,
  IconPriority4,
  IconPriority5,
} from "@/public/assets/svgs";
import { Task } from "@/types/home/codev";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import KanbanTaskViewEditModal from "./kanban_modals/KanbanTaskViewEditModal";

interface CodevMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

interface Props {
  task: Task;
  columnId?: string;
}

function KanbanTask({ task, columnId }: Props) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
      columnId: columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const primaryImage = (task as any)?.codev?.image_url;
  const primaryName = (task as any)?.codev?.first_name || "Assignee";

  const sidekicks = task.sidekick_ids ?? [];

  const PriorityIconMap: { [key: string]: React.FC<any> } = {
    critical: IconPriority1,
    high: IconPriority2,
    medium: IconPriority3,
    low: IconPriority4,
  };

  const PriorityIcon = task.priority
    ? PriorityIconMap[task.priority.toLowerCase()] || IconPriority5
    : IconPriority5;

  const [sidekickDetails, setSidekickDetails] = useState<CodevMember[]>([]);

  // Get priority-based styles
  const getPriorityStyles = () => {
    const baseClasses = "absolute top-0 left-0 w-1 h-full rounded-l-lg";
    switch (task.priority?.toLowerCase()) {
      case "critical":
        return `${baseClasses} bg-red-500`;
      case "high":
        return `${baseClasses} bg-orange-500`;
      case "medium":
        return `${baseClasses} bg-yellow-500`;
      case "low":
        return `${baseClasses} bg-green-500`;
      default:
        return `${baseClasses} bg-gray-500`;
    }
  };

  useEffect(() => {
    async function fetchSidekickDetails() {
      if (sidekicks.length === 0) return;
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from("codev")
        .select("id, first_name, last_name, image_url")
        .in("id", sidekicks);
      if (error) {
        console.error("Error fetching sidekick details:", error.message);
      } else if (data) {
        setSidekickDetails(data as CodevMember[]);
      }
    }
    fetchSidekickDetails();
  }, [sidekicks]);

  return (
    <KanbanTaskViewEditModal task={task}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`group relative mt-2 flex cursor-grab flex-col gap-3 rounded-lg bg-white p-4 
          ${
            isDragging
              ? "rotate-3 scale-105 shadow-2xl ring-2 ring-blue-500 ring-offset-2"
              : "hover:shadow-lg hover:ring-2 hover:ring-blue-200 hover:ring-offset-2"
          } 
          transform transition-all duration-200 ease-in-out dark:bg-[#1E1F26]`}
        data-type="Task"
      >
        {/* Priority Indicator Bar */}
        <div className={getPriorityStyles()} />

        {/* Task Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-800 transition-colors group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400">
            {task.title}
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center rounded-full p-1
              ${
                task.priority === "critical"
                  ? "bg-red-100 dark:bg-red-900/30"
                  : task.priority === "high"
                    ? "bg-orange-100 dark:bg-orange-900/30"
                    : task.priority === "medium"
                      ? "bg-yellow-100 dark:bg-yellow-900/30"
                      : "bg-green-100 dark:bg-green-900/30"
              }`}
            >
              <PriorityIcon
                className={`h-4 w-4 
                ${
                  task.priority === "critical"
                    ? "text-red-500"
                    : task.priority === "high"
                      ? "text-orange-500"
                      : task.priority === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                }`}
              />
            </div>
            <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white shadow-md transition-colors group-hover:border-blue-200 dark:border-gray-800">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={primaryName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <DefaultAvatar size={32} />
              )}
            </div>
          </div>
        </div>

        {/* Skill Category Badge */}
        {(task as any).skill_category && (
          <div>
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {(task as any).skill_category.name}
            </span>
          </div>
        )}

        {/* Task Details */}
        <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
          {task.difficulty && (
            <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              {task.difficulty}
            </span>
          )}
          {typeof task.points === "number" && (
            <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
              {task.points} pts
            </span>
          )}
          {task.type && (
            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {task.type}
            </span>
          )}
        </div>

        {/* Sidekicks */}
        {sidekicks.length > 0 && (
          <div className="flex -space-x-2 pt-2">
            {sidekicks.slice(0, 3).map((sidekickId) => {
              const member = sidekickDetails.find((m) => m.id === sidekickId);
              return (
                <div
                  key={sidekickId}
                  className="h-7 w-7 overflow-hidden rounded-full border-2 border-white shadow-sm transition-colors group-hover:border-blue-200 dark:border-gray-800"
                >
                  {member && member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.first_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <DefaultAvatar size={28} />
                  )}
                </div>
              );
            })}
            {sidekicks.length > 3 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold dark:bg-gray-700">
                +{sidekicks.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </KanbanTaskViewEditModal>
  );
}

export default KanbanTask;
