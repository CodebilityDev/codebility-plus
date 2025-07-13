import { useEffect, useState } from "react";
import Image from "next/image";
import DefaultAvatar from "@/Components/DefaultAvatar";
import {
  IconPriority1,
  IconPriority2,
  IconPriority3,
  IconPriority4,
  IconPriority5,
} from "@/public/assets/svgs";
import { Task } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  onComplete?: (taskId: string) => void;
}

function KanbanTask({ task, columnId, onComplete }: Props) {
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
  const [supabase, setSupabase] = useState<any>(null);

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

  // Get skill category color
  const getSkillCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      "UI/UX Designer":
        "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      "Backend Developer":
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      "Mobile Developer":
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "QA Engineer":
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "Frontend Developer":
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    };

    return (
      colorMap[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    );
  };

  // Get task type color
  const getTaskTypeColor = (type: string): string => {
    const typeColorMap: Record<string, string> = {
      BUG: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      FEATURE: "bg-green text-white dark:bg-green-900/30 dark:text-green-300",
      IMPROVEMENT:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      DOCUMENTATION:
        "bg-gray text-white dark:bg-gray-200/20 dark:text-gray-200",
    };

    return (
      typeColorMap[type] ||
      "bg-gray text-white dark:bg-gray-700 dark:text-gray-300"
    );
  };

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    async function fetchSidekickDetails() {
      if (sidekicks.length === 0) return;

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
  }, [sidekicks, supabase]);

  return (
    <KanbanTaskViewEditModal task={task} onComplete={onComplete}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`group relative mt-1 flex cursor-grab flex-col gap-2 rounded-lg bg-white 
          p-2 md:mt-2 md:gap-3 md:p-4 
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
          <h3
            className="mr-2 line-clamp-2 flex-1 text-sm font-bold 
            text-gray-800 transition-colors group-hover:text-blue-600
            dark:text-gray-200 dark:group-hover:text-blue-400 md:text-base"
          >
            {task.title}
          </h3>
          <div className="flex flex-shrink-0 items-center gap-1 md:gap-2">
            <div
              className={`flex h-6 w-auto items-center justify-center gap-1 rounded-full px-2 py-1 text-xs font-medium md:h-8 md:text-sm
    ${
      task.priority === "critical"
        ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        : task.priority === "high"
          ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
          : task.priority === "medium"
            ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
            : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
    }`}
            >
              <span className="capitalize">{task.priority ?? "Low"}</span>
              <PriorityIcon className="h-3 w-3 md:h-4 md:w-4" />
            </div>
            {/* PRIMARY AVATAR - Fixed alignment */}
            <div
              className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-md transition-colors 
              group-hover:border-blue-200 dark:border-gray-800 md:h-8 md:w-8"
            >
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
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold md:px-3 md:py-1 ${getSkillCategoryColor(
                (task as any).skill_category.name,
              )}`}
            >
              {(task as any).skill_category.name}
            </span>
          </div>
        )}

        {/* Task Details */}
        <div className="flex flex-wrap gap-1 text-xs text-gray-600 dark:text-gray-400 md:gap-2 md:text-sm">
          {task.difficulty && (
            <span
              className="inline-flex items-center rounded-md bg-purple-100 
              px-1.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 
              dark:text-purple-300 md:px-2 md:py-1"
            >
              {task.difficulty}
            </span>
          )}
          {typeof task.points === "number" && (
            <span
              className="inline-flex items-center rounded-md bg-green-100 
              px-1.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 
              dark:text-green-300 md:px-2 md:py-1"
            >
              {task.points} pts
            </span>
          )}
          {task.type && (
            <span
              className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium md:px-2 md:py-1 ${getTaskTypeColor(
                task.type.toUpperCase(),
              )}`}
            >
              {task.type}
            </span>
          )}
        </div>

        {/* Sidekicks - Fixed alignment */}
        {sidekicks.length > 0 && (
          <div className="flex -space-x-1.5 pt-1 md:-space-x-2 md:pt-2">
            {sidekicks.slice(0, 3).map((sidekickId) => {
              const member = sidekickDetails.find((m) => m.id === sidekickId);
              return (
                <div
                  key={sidekickId}
                  className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border-2 border-white 
                    shadow-sm transition-colors group-hover:border-blue-200 dark:border-gray-800 
                    md:h-7 md:w-7"
                >
                  {member && member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.first_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <DefaultAvatar size={20} className="md:hidden" />
                      <DefaultAvatar size={28} className="hidden md:block" />
                    </>
                  )}
                </div>
              );
            })}
            {sidekicks.length > 3 && (
              <div
                className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 
                text-[10px] font-semibold dark:bg-gray-700 md:h-7 md:w-7 md:text-xs"
              >
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