import { useMemo } from "react";
import { Task } from "@/types/home/task";
import { SortableContext, useSortable } from "@dnd-kit/sortable";

import { List } from "../_types/board";
import KanbanTaskAddModal from "./kanban_modals/kanban-task-add-modal";
import KanbanTask from "./kanban-task";

interface Props {
  column: List;
  projectId: string;
  tasks: Task[];
}

export default function KanbanColumnContainer({
  column,
  projectId,
  tasks,
}: Props) {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <li
      ref={setNodeRef}
      className="flex h-full max-h-dvh min-w-[18rem] cursor-pointer flex-col overflow-hidden rounded-md bg-[#FCFCFC] dark:bg-[#2C303A]"
    >
      <div className="text-md p-3 font-bold dark:bg-[#1E1F26]">
        <div className="text-gray flex items-center gap-3">
          {column.name}

          <div className="text-violet dark:text-teal flex items-center justify-center rounded-full bg-zinc-300 px-3 py-1 text-sm dark:bg-[#1C1C1C]">
            {tasks.length}
          </div>
        </div>
      </div>
      {/* background-lightbox_darkbox */}
      <div
        className={`flex flex-grow flex-col px-2 pb-2 ${tasks.length > 0 && "pt-2"}`}
      >
        <div
          className={`flex max-h-[25rem] flex-grow flex-col gap-2 overflow-y-auto overflow-x-hidden`}
        >
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <KanbanTask key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>
        <div className="pt-2">
          <KanbanTaskAddModal
            listId={column.id}
            totalTask={tasks.length}
            listName={column.name}
            projectId={projectId}
          />
        </div>
      </div>
    </li>
  );
}
