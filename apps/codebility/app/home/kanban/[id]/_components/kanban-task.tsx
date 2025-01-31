import DefaultAvatar from "@/Components/DefaultAvatar";
import {
  IconPriority1,
  IconPriority2,
  IconPriority3,
  IconPriority4,
  IconPriority5,
} from "@/public/assets/svgs";
import { ExtendedTask } from "@/types/home/codev";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import KanbanTaskViewEditModal from "./kanban_modals/kanban-task-view-edit-modal";

interface Props {
  task: ExtendedTask;
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
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const PriorityIconMap = {
    critical: IconPriority1,
    highest: IconPriority2,
    high: IconPriority3,
    medium: IconPriority4,
    low: IconPriority5,
  };

  const PriorityIcon = task.priority
    ? PriorityIconMap[
        task.priority.toLowerCase() as keyof typeof PriorityIconMap
      ]
    : IconPriority5;

  // Safely handle sidekicks with proper type checking
  const sidekicks = task.sidekick_ids ?? [];

  return (
    <KanbanTaskViewEditModal task={task}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`ring-violet relative flex h-auto max-w-72 cursor-grab flex-col gap-2 rounded-lg bg-white p-2.5 text-left ring-inset hover:ring-2 dark:bg-[#1E1F26] ${
          isDragging ? "opacity-60" : ""
        }`}
      >
        <div className="flex justify-between gap-2 text-xs">
          <p className="line-clamp-6 flex-1 break-words">{task.title}</p>
          {<PriorityIcon />}
        </div>
        <div className="relative">
          <div className="float-left flex flex-wrap gap-3 text-sm">
            {task.id.slice(0, 8)}
          </div>
          {sidekicks.length > 0 && (
            <div className="float-right mb-1 ml-1 flex flex-wrap justify-end gap-1">
              {sidekicks.slice(0, 3).map((sidekickId) => (
                <div key={sidekickId} className="h-6 w-6 rounded-full">
                  <DefaultAvatar size={24} />
                </div>
              ))}
              {sidekicks.length > 3 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs">
                  +{sidekicks.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
        {task.due_date && (
          <div className="text-xs text-gray-500">
            Due: {new Date(task.due_date).toLocaleDateString()}
          </div>
        )}
        {task.difficulty && (
          <div className="text-xs text-gray-500">
            Difficulty: {task.difficulty}
          </div>
        )}
      </div>
    </KanbanTaskViewEditModal>
  );
}

export default KanbanTask;
