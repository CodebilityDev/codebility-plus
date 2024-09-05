import Image from "next/image";
import Box from "@/Components/shared/dashboard/Box";
import { Paragraph } from "@/Components/shared/home";
import { Task } from "@/types/home/task";

import useUser from "../../_hooks/use-user";
import { getTaskMembers } from "../../_lib/get-task-members";
import TaskViewModal from "./task-view-modal";

interface Props {
  task: Task;
}

export default function TaskCard({ task }: Props) {
  const user = useUser();

  const {
    title,
    priority_level,
    points,
    duration,
    description,
    project,
    number,
    created_at,
  } = task;

  let prioLevel = null;

  switch (priority_level.toLowerCase()) {
    case "highest":
      prioLevel = 1;
      break;
    case "critical":
      prioLevel = 2;
      break;
    case "high":
      prioLevel = 3;
      break;
    case "medium":
      prioLevel = 4;
      break;
    default:
      prioLevel = 5;
  }

  const members = getTaskMembers(task.codev_task);

  return (
    <TaskViewModal task={task} taskMembers={members}>
      <Box className="hover:border-violet cursor-pointer border bg-[#FFFFFF] dark:bg-[#1F1F1F]">
        <div className="flex h-full flex-col justify-between">
          <div className="relative flex flex-col gap-1">
            <Image
              width={20}
              height={20}
              src={`/assets/svgs/icon-priority-${prioLevel}.svg`}
              className="absolute right-0 top-0 "
              alt="prio level"
            />
            <p className="text-violet text-lg font-semibold">#{number}</p>
            <p>{title}</p>
            <Paragraph>{description}</Paragraph>
            <div className="text-gray flex items-center gap-2 text-xs">
              Project:{" "}
              <p className="text-dark-100 text-sm uppercase dark:text-white">
                {project?.name}
              </p>
            </div>
            <div className="text-gray mt-1 flex items-center gap-2 text-xs">
              Duration Hours:{" "}
              <p className="text-dark-100 text-sm uppercase dark:text-white">
                {duration}
              </p>
            </div>
            <div className="text-gray mt-1 flex items-center gap-2 text-xs">
              Points:{" "}
              <p className="text-dark-100 text-sm uppercase dark:text-white">
                {points}
              </p>
            </div>
            <div className="text-gray mt-1 flex items-center gap-2 text-xs">
              Created at:{" "}
              <p className="text-dark-100 text-sm uppercase dark:text-white">
                {created_at}
              </p>
            </div>
            <div className="text-gray mt-1 flex items-center gap-2 text-xs">
              You are the assignee:{" "}
              <p className="text-dark-100 text-sm uppercase dark:text-white">
                {user.first_name} {user.last_name}
              </p>
            </div>

            <div className="text-gray mt-1 items-center gap-2 text-xs">
              Members in this Task:{" "}
              {members.map((member) => (
                <p
                  key={member.id}
                  className="text-dark-100 text-sm uppercase dark:text-white"
                >
                  {member.first_name}
                </p>
              ))}
            </div>
          </div>
          <div className="mt-1">
            {/*   {tags.map(({ tag }, i) => (
              <RenderTag key={i} name={tag} />
            ))}
            {} */}
          </div>
          <div className="mt-1">
            {/*   {tagId.map((id) => (
              <RenderTeam key={id} />
            ))} */}
          </div>
        </div>
      </Box>
    </TaskViewModal>
  );
}
