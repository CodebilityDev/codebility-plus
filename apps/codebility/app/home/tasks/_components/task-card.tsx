import Image from "next/image";
import { Paragraph } from "@/Components/shared/home";
import { Task } from "@/types/home/task";

import {
  convertHoursToHMS,
  formatLongDate,
  getPriorityLevel,
} from "../_lib/utils";
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
    codev_task,
  } = task;

  const prioLevel = getPriorityLevel(priority_level);
  const members = getTaskMembers(codev_task);

  // console.log("user task card: ", user)
  console.log("task card: ", task)

  return (
    <TaskViewModal task={task} taskMembers={members}>
      <div className="background-box text-dark100_light900 hover:border-violet cursor-pointer rounded border border-zinc-200 p-6 shadow-sm dark:border-zinc-700">
        <div className="flex h-full flex-col justify-between">
          <div className="relative flex flex-col gap-1">
            <Image
              width={20}
              height={20}
              src={`/assets/svgs/icon-priority-${prioLevel}.svg`}
              className="absolute right-0 top-0 "
              alt="prio level"
              title={priority_level}
            />
            <p className="text-violet text-lg font-semibold">#{number}</p>
            <p>{title}</p>
            <Paragraph>{description}</Paragraph>
            <div className="text-gray flex items-center gap-2 text-xs">
              Project:{" "}
              <p className="text-dark-100 text-sm dark:text-white">
                {project?.name}
              </p>
            </div>
            <div className="text-gray mt-1 flex items-center gap-2 text-xs">
              Duration Hours:{" "}
              <p className="text-dark-100 text-sm dark:text-white">
                {convertHoursToHMS(duration)}
              </p>
            </div>
            <div className="text-gray mt-1 flex items-center gap-2 text-xs">
              Points:{" "}
              <p className="text-dark-100 text-sm dark:text-white">{points}</p>
            </div>
            <div className="text-gray mt-1 flex items-center gap-2 text-xs">
              Created at:{" "}
              <p className="text-dark-100 text-sm dark:text-white">
                {formatLongDate(created_at)}
              </p>
            </div>
            <div className="text-gray mt-1 flex items-center gap-2 text-xs">
              You are the assignee:{" "}
              <p className="text-dark-100 text-sm capitalize dark:text-white">
                {user.first_name} {user.last_name}
              </p>
            </div>
            <div className="text-gray mt-1 items-center gap-2 text-xs">
              Members in this Task:{" "}
              {members.map((member, index) => {
                return (
                  <p
                    key={index}
                    className="text-dark-100 text-sm capitalize dark:text-white"
                  >
                    {member.first_name}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </TaskViewModal>
  );
}
