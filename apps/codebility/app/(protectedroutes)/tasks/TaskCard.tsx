import Image from "next/image"
import { useModal } from "@/hooks/use-modal"

import Box from "@/Components/shared/dashboard/Box"
import { Paragraph } from "@/Components/shared/home"
import { TaskT } from "@/types/index"
import useAuth from "@/hooks/use-auth"

const TaskCard = ({ task }: { task: TaskT }) => {
  const { onOpen } = useModal()

  const { userData } = useAuth()

  const { title, subheader, prio_level, task_points, duration, full_description, projects, created_at } = task

  let prioLevel = null

  switch (prio_level.toLowerCase()) {
    case "highest":
      prioLevel = 1
      break
    case "critical":
      prioLevel = 2
      break
    case "high":
      prioLevel = 3
      break
    case "medium":
      prioLevel = 4
      break
    default:
      prioLevel = 5
  }

  console.log(task)
  return (
    <>
      <Box
        className="cursor-pointer border bg-[#FFFFFF] hover:border-violet dark:bg-[#1F1F1F]"
        onClick={() => onOpen("taskViewModal", task)}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="relative flex flex-col gap-1">
            <Image
              width={20}
              height={20}
              src={`/assets/svgs/icon-priority-${prioLevel}.svg`}
              className="absolute right-0 top-0 "
              alt="prio level"
            />
            <p className="text-lg font-semibold text-violet">#01</p>
            <p>{title}</p>
            <p className="text-sm">{subheader}</p>
            <Paragraph>{full_description}</Paragraph>
            <div className="flex items-center gap-2 text-xs text-gray">
              Project: <p className="text-sm uppercase text-dark-100 dark:text-white">{projects.project_name}</p>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray">
              Duration Hours: <p className="text-sm uppercase text-dark-100 dark:text-white">{duration}</p>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray">
              Points: <p className="text-sm uppercase text-dark-100 dark:text-white">{task_points}</p>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray">
              Created at: <p className="text-sm uppercase text-dark-100 dark:text-white">{created_at}</p>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray">
              You are the assignee:{" "}
              <p className="text-sm uppercase text-dark-100 dark:text-white">{userData?.first_name}</p>
            </div>

            {/* <div className="mt-1 items-center gap-2 text-xs text-gray">
              Members in this Task:{" "}
              {userTask.map((username) => (
                <p className="text-sm uppercase text-dark-100 dark:text-white">{username.first_name}</p>
              ))}
            </div> */}
          </div>
          <div className="mt-1">
            {/* {tags.map(({ tag }, i) => (
              <RenderTag key={i} name={tag} />
            ))} */}
            {}
          </div>
          <div className="mt-1">
            {/* {tagId.map((id) => (
              <RenderTeam key={id} />
            ))} */}
          </div>
        </div>
      </Box>
    </>
  )
}

export default TaskCard