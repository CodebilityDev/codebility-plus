import { useEffect, useState } from "react";
import DefaultAvatar from "@/Components/DefaultAvatar";
import {
  IconPriority1,
  IconPriority2,
  IconPriority3,
  IconPriority4,
  IconPriority5,
} from "@/public/assets/svgs";
import { SkillCategory, Task } from "@/types/home/codev";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import KanbanTaskViewEditModal from "./kanban_modals/KanbanTaskViewEditModal";

// Define a type for the sidekick member details.
interface CodevMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

interface Props {
  task: Task;
}

function KanbanTask({ task }: Props) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  // Access primary assignee's data using a type assertion.
  const primaryImage = (task as any).codev?.image_url;
  const primaryName = (task as any).codev?.first_name || "Assignee";

  // For sidekick IDs, fallback to an empty array.
  const sidekicks = task.sidekick_ids ?? [];

  // Map priority values (converted to lowercase) to icons.
  const PriorityIconMap: { [key: string]: React.FC<any> } = {
    critical: IconPriority1,
    high: IconPriority2,
    medium: IconPriority3,
    low: IconPriority4,
  };

  const PriorityIcon = task.priority
    ? PriorityIconMap[task.priority.toLowerCase()] || IconPriority5
    : IconPriority5;

  // State to store fetched sidekick member details.
  const [sidekickDetails, setSidekickDetails] = useState<CodevMember[]>([]);

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
        className="relative mt-2 flex cursor-grab flex-col gap-3 rounded-lg bg-white p-4 shadow-lg transition hover:scale-105 dark:bg-[#1E1F26]"
      >
        {/* Header: Task title with priority badge and primary assignee avatar */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
            {task.title}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full bg-red-100 p-1">
              <PriorityIcon className="h-4 w-4 text-red-500" />
            </div>
            <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-200 dark:border-gray-800">
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
            <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
              {(task as any).skill_category.name}
            </span>
          </div>
        )}

        {/* Additional Details */}
        <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
          {task.difficulty && <div>Difficulty: {task.difficulty}</div>}
          {typeof task.points === "number" && <div>Points: {task.points}</div>}
          {task.type && <div>Type: {task.type}</div>}
        </div>

        {/* Sidekick Avatars */}
        {sidekicks.length > 0 && (
          <div className="flex -space-x-2">
            {sidekicks.slice(0, 3).map((sidekickId) => {
              const member = sidekickDetails.find((m) => m.id === sidekickId);
              return (
                <div
                  key={sidekickId}
                  className="h-7 w-7 overflow-hidden rounded-full border-2 border-white dark:border-gray-800"
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
