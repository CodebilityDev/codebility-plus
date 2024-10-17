import Image from "next/image";
import {
  IconPriority1,
  IconPriority2,
  IconPriority3,
  IconPriority4,
  IconPriority5,
} from "@/public/assets/svgs";
import { Task } from "@/types/home/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { DEFAULT_AVATAR } from "../_lib/constants";
import { getTaskMembers } from "../../../_lib/get-task-members";
import KanbanTaskViewEditModal from "./kanban_modals/kanban-task-view-edit-modal";

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
    CRITICAL: IconPriority1,
    HIGHEST: IconPriority2,
    HIGH: IconPriority3,
    MEDIUM: IconPriority4,
    LOW: IconPriority5,
  };

  const PriorityIcon = task.priority_level
    ? PriorityIconMap[task.priority_level as keyof typeof PriorityIconMap]
    : IconPriority5;

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="background-lightsmallbox_darksmallbox cursor-grabs relative flex h-auto cursor-pointer flex-col gap-5 rounded-lg p-2.5 text-left opacity-60"
      >
        <div className="flex justify-between">
          {task.title}
          {<PriorityIcon />}
        </div>
        <div className="flex">#{task.number.toString().padStart(2, "0")}</div>
      </div>
    );
  }

  const codevs = getTaskMembers(task.codev_task);

  return (
    <KanbanTaskViewEditModal task={task}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="cursor-grabs ring-violet relative flex h-auto max-w-72 cursor-grab flex-col gap-2 rounded-lg bg-white p-2.5 text-left ring-inset hover:ring-2 dark:bg-[#1E1F26]"
      >
        <div className="flex justify-between gap-2 text-xs">
          <p className="line-clamp-6 flex-1 break-words">{task.title}</p>
          {<PriorityIcon />}
        </div>
        <div className="relative">
          <div className="float-left flex flex-wrap gap-3 text-sm">
            #{task.number.toString().padStart(2, "0")}
          </div>
          <div className=" float-right  mb-1 ml-1 flex flex-wrap justify-end gap-1 ">
            {codevs?.map((member, idx) => {
              return (
                <div key={idx} className="h-6 w-6 rounded-full ">
                  <Image
                    alt="Avatar"
                    src={member.image_url || DEFAULT_AVATAR}
                    width={8}
                    height={8}
                    title={` ${member.first_name} ${member.last_name}`}
                    className="h-full w-full rounded-full bg-cover object-cover"
                    loading="eager"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </KanbanTaskViewEditModal>
  );
}
export default KanbanTask;
