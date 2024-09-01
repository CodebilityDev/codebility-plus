import { CSS } from "@dnd-kit/utilities"
import { useModal } from "@/hooks/use-modal"
import { useSortable } from "@dnd-kit/sortable"
import { IconPriority1 } from "@/public/assets/svgs"
import defautlAvatar from "@/public/assets/images/default-avatar-200x200.jpg"
import Image from "next/image"
import { Task } from "@/types/home/task"
import { Profile } from "@/types/home/user"

interface Props {
  task: Task;
}

function KanbanTask({ task }: Props) {
  const { onOpen } = useModal()

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="background-lightsmallbox_darksmallbox cursor-grabs relative flex h-auto cursor-pointer flex-col gap-5 rounded-lg p-2.5 text-left opacity-60"
      >
        <div className="flex justify-between">
          {task.title}
          <IconPriority1 />
        </div>
        <div className="flex">{`#01`}</div>
      </div>
    )
  }

  const codevs = task.codev_task.map(codevTask => {
    const { first_name, last_name, image_url } = codevTask.codev.user?.profile as Profile;

    return { first_name, last_name, image_url};
  })

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grabs relative flex h-auto max-w-72 cursor-grab flex-col gap-2 rounded-lg bg-white p-2.5 text-left ring-inset ring-violet hover:ring-2 dark:bg-[#1E1F26]"
      onClick={() => onOpen("taskViewEditModal", task, task)}
    >
      <div className="flex justify-between text-xs">
        {task.title}
        <IconPriority1 />
      </div>
      <div className="relative">
        <div className="float-left flex flex-wrap gap-3 text-sm">#{task.number.toString().padStart(2,"0")}</div>
        <div className=" float-right  mb-1 ml-1 flex flex-wrap justify-end gap-1 ">
          {codevs?.map((member, idx) => {
              return (
                <div key={idx} className="h-6 w-6 rounded-full ">
                  <Image
                    alt="Avatar"
                    src={member.image_url ?? defautlAvatar}
                    width={8}
                    height={8}
                    title={` ${member.first_name} ${member.last_name}`}
                    className="h-full w-full rounded-full bg-cover object-cover"
                    loading="eager"
                  />
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
export default KanbanTask
