import React, { useEffect, useState, useMemo, memo } from "react";
import DefaultAvatar from "@/components/DefaultAvatar";
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

// Local interface for fetched sidekick data
interface SidekickMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

interface Props {
  task: Task; // Use the global Task type, not ExtendedTask
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

  const primaryImage = task.codev?.image_url;
  const primaryName = task.codev?.first_name || "Assignee";

  const sidekicks = task.sidekick_ids ?? [];

  const PriorityIconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = useMemo(() => ({
    critical: IconPriority1,
    high: IconPriority2,
    medium: IconPriority3,
    low: IconPriority4,
  }), []);

  const PriorityIcon = useMemo(() => 
    task.priority
      ? PriorityIconMap[task.priority.toLowerCase()] || IconPriority5
      : IconPriority5
  , [task.priority, PriorityIconMap]);

  const [sidekickDetails, setSidekickDetails] = useState<SidekickMember[]>([]);
  const [supabase, setSupabase] = useState<any>(null);

  // Calculate deadline urgency
  const getDeadlineStatus = useMemo(() => {
    if (!task.deadline) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const deadlineDate = new Date(task.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'overdue', text: 'Overdue', color: 'bg-red-600 text-white border-red-700' };
    } else if (diffDays === 0) {
      return { status: 'today', text: 'Due Today', color: 'bg-orange-600 text-white border-orange-700' };
    } else if (diffDays <= 3) {
      return { status: 'urgent', text: `${diffDays}d left`, color: 'bg-yellow-500 text-gray-900 border-yellow-600' };
    } else if (diffDays <= 7) {
      return { status: 'soon', text: `${diffDays}d left`, color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300' };
    } else {
      const dateStr = deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return { status: 'normal', text: dateStr, color: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300' };
    }
  }, [task.deadline]);

  // Get priority-based styles
  const priorityStyles = useMemo(() => {
    const baseClasses = "absolute top-0 left-0 w-1 h-full rounded-l-lg";
    switch (task.priority?.toLowerCase()) {
      case "critical":
        return `${baseClasses} bg-red-500`;
      case "high":
        return `${baseClasses} bg-red-500`;
      case "medium":
        return `${baseClasses} bg-yellow-500`;
      case "low":
        return `${baseClasses} bg-green-500`;
      default:
        return `${baseClasses} bg-gray-500`;
    }
  }, [task.priority]);

  // Get skill category color
  const getSkillCategoryColor = useMemo(() => (category: string): string => {
    const colorMap: Record<string, string> = {
      "UI/UX Designer":
        "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-800",
      "Backend Developer":
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800",
      "Mobile Developer":
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800",
      "QA Engineer":
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800",
      "Frontend Developer":
        "bg-customBlue-600 text-white border-customBlue-700 dark:bg-customBlue-600 dark:text-white dark:border-customBlue-700",
    };

    return (
      colorMap[category] ||
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-800"
    );
  }, []);

  // Get task type color
  const getTaskTypeColor = useMemo(() => (type: string): string => {
    const typeColorMap: Record<string, string> = {
      BUG: "bg-red-200 text-red-900 border-red-300 dark:bg-red-900/60 dark:text-red-200 dark:border-red-800",
      FEATURE: "bg-blue-200 text-blue-900 border-blue-300 dark:bg-blue-900/60 dark:text-blue-200 dark:border-blue-800",
      IMPROVEMENT: "bg-amber-200 text-amber-900 border-amber-300 dark:bg-amber-900/60 dark:text-amber-200 dark:border-amber-800",
      DOCUMENTATION: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-200 dark:border-indigo-800",
    };

    return (
      typeColorMap[type] ||
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
    );
  }, []);

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
        setSidekickDetails(data as SidekickMember[]);
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
        className={`group relative mt-1 flex cursor-grab flex-col gap-2 rounded-xl bg-white dark:bg-gray-800
          p-3 md:mt-2 md:gap-3 md:p-4 
          ${
            isDragging
              ? "rotate-1 scale-[1.01] shadow-lg shadow-customBlue-500/15 ring-1 ring-customBlue-400 z-40"
              : "hover:shadow-md hover:shadow-gray-300/30 dark:hover:shadow-gray-900/30 hover:-translate-y-0.5 hover:bg-gray-50 dark:hover:bg-gray-750 z-10"
          } 
          border border-gray-200 dark:border-gray-600 shadow-sm
          transform transition-all duration-200 ease-out`}
        data-type="Task"
      >
        {/* Priority Indicator Bar */}
        <div className={`${priorityStyles} transition-all duration-300`} />

        {/* Task Header */}
        <div className="flex items-center justify-between">
          <h3
            className="mr-2 line-clamp-2 flex-1 text-sm font-semibold 
            text-gray-900 transition-colors duration-200 group-hover:text-customBlue-600
            dark:text-gray-100 dark:group-hover:text-customBlue-100 md:text-base"
          >
            {task.title}
          </h3>
          <div className="flex flex-shrink-0 items-center gap-1 md:gap-2">
            <div
              className={`flex h-6 w-auto items-center justify-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm transition-all duration-200 md:h-7 md:text-sm
    ${
      task.priority === "critical"
        ? "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800"
        : task.priority === "high"
          ? "bg-red-600 text-white border border-red-700 dark:bg-red-800 dark:text-white dark:border-red-700"
          : task.priority === "medium"
            ? "bg-yellow-100 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800"
            : task.priority === "low"
              ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800"
              : "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800/40 dark:text-gray-300 dark:border-gray-600"
    }`}
            >
              <span className="capitalize">{task.priority ?? "Low"}</span>
              <PriorityIcon className="h-3 w-3 md:h-4 md:w-4" />
            </div>
            {/* PRIMARY AVATAR */}
            <div
              className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-sm transition-all duration-200 
              group-hover:border-customBlue-300 group-hover:scale-110 dark:border-gray-700 md:h-8 md:w-8"
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
        {task.skill_category && (
          <div>
            <span
              className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium shadow-sm border md:px-3 md:py-1 ${getSkillCategoryColor(
                task.skill_category.name,
              )} transition-all duration-200 hover:scale-105`}
            >
              {task.skill_category.name}
            </span>
          </div>
        )}

        {/* Task Details */}
        <div className="flex flex-wrap gap-1 text-xs text-gray-600 dark:text-gray-400 md:gap-2 md:text-sm">
          {task.difficulty && (
            <span
              className="inline-flex items-center rounded-md bg-purple-100 border border-purple-200
              px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/40 
              dark:text-purple-300 dark:border-purple-800 shadow-sm md:px-2.5 md:py-1"
            >
              {task.difficulty}
            </span>
          )}
          {typeof task.points === "number" && (
            <span
              className="inline-flex items-center rounded-md bg-green-100 border border-green-200
              px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 
              dark:text-green-300 dark:border-green-800 shadow-sm md:px-2.5 md:py-1"
            >
              {task.points} pts
            </span>
          )}
          {task.type && (
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium shadow-sm border md:px-2.5 md:py-1 ${getTaskTypeColor(
                task.type.toUpperCase(),
              )} transition-all duration-200`}
            >
              {task.type}
            </span>
          )}
          {/* Deadline Badge */}
          {getDeadlineStatus && (
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium shadow-sm border md:px-2.5 md:py-1 ${getDeadlineStatus.color} transition-all duration-200`}
              title={`Deadline: ${new Date(task.deadline!).toLocaleDateString()}`}
            >
              📅 {getDeadlineStatus.text}
            </span>
          )}
        </div>

        {/* Sidekicks */}
        {sidekicks.length > 0 && (
          <div className="flex -space-x-1.5 pt-1 md:-space-x-2 md:pt-2">
            {sidekicks.slice(0, 3).map((sidekickId) => {
              const member = sidekickDetails.find((m) => m.id === sidekickId);
              return (
                <div
                  key={sidekickId}
                  className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-white 
                    shadow-sm transition-all duration-200 hover:scale-110 hover:border-customBlue-300 dark:border-gray-700 
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
                className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 border border-gray-200
                text-[10px] font-medium text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 shadow-sm md:h-7 md:w-7 md:text-xs"
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

export default memo(KanbanTask);