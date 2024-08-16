import { useMemo } from "react"
import { useModal } from "@/hooks/use-modal"

import KanbanTask from "@/app/(protectedroutes)/kanban/components/KanbanTask"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { kanban_ColumnContainerT } from "@/types/protectedroutes"

function ColumnContainer(props: kanban_ColumnContainerT) {
  const { column, tasks, projectId } = props
  const { onOpen } = useModal()

  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  })

  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks])

  return (
    <li
      ref={setNodeRef}
      className="flex h-full max-h-dvh min-w-[18rem] cursor-pointer flex-col overflow-hidden rounded-md bg-[#FCFCFC] dark:bg-[#2C303A]"
    >
      <div className="text-md p-3 font-bold dark:bg-[#1E1F26]">
        <div className="flex items-center gap-3 text-gray">
          {column.name}

          <div className="flex items-center justify-center rounded-full bg-zinc-300 px-3 py-1 text-sm text-violet dark:bg-[#1C1C1C] dark:text-teal">
            {tasks.length}
          </div>
        </div>
      </div>
      {/* background-lightbox_darkbox */}
      <div className={`flex flex-grow flex-col px-2 pb-2 ${tasks.length > 0 && "pt-2"}`}>
        <div className={`flex max-h-[25rem] flex-grow flex-col gap-2 overflow-y-auto overflow-x-hidden`}>
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <KanbanTask key={task.id} task={task} listName={column.name} />
            ))}
          </SortableContext>
        </div>
        <div className="pt-2">
          <button
            onClick={() => onOpen("taskAddModal", projectId, { listId: column.id, listName: column.name })}
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 hover:bg-black-400/40"
          >
            <p className="text-2xl">+</p>
            <p>Add a card</p>
          </button>
        </div>
      </div>
    </li>
  )
}

export default ColumnContainer
