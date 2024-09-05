import React from "react";
import RenderTeam from "@/Components/shared/dashboard/RenderTeam";
import { Paragraph } from "@/Components/shared/home";
import { Button } from "@/Components/ui/button";
import { Task } from "@/types/home/task";

import { Dialog, DialogContent, DialogTrigger } from "@codevs/ui/dialog";

import { Member } from "../../_types/member";

interface Props {
  children: React.ReactNode;
  task: Task;
  taskMembers: Member[];
}

export default function TaskViewModal({ children, task, taskMembers }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-[32rem] w-[80%] max-w-sm overflow-x-auto overflow-y-auto lg:h-auto">
        <div className="flex flex-col gap-6">
          <div key={task.id} className="flex flex-col gap-y-5">
            <div className="relative flex flex-col gap-1">
              <p className="text-lg font-semibold text-white">{task.title}</p>
              {/* <p className="text-sm">{task.subheader}</p> */}
              <Paragraph>{task.description}</Paragraph>
              <div className="text-gray mt-1 flex items-center gap-2 text-xs">
                Duration Hours:{" "}
                <p className="text-dark-100 text-sm uppercase dark:text-white">
                  {task.duration}
                </p>
              </div>
              <div className="text-gray mt-1 flex items-center gap-2 text-xs">
                Points:{" "}
                <p className="text-dark-100 text-sm uppercase dark:text-white">
                  {task.points}
                </p>
              </div>
              <div className="text-gray mt-1 flex items-center gap-2 text-xs">
                Priority Level:{" "}
                <p className="text-dark-100 text-sm uppercase dark:text-white">
                  {task.priority_level}
                </p>
              </div>
            </div>

            <div className="flex flex-row justify-between gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-white">Members</p>
                <div>
                  {taskMembers.map((member) => (
                    <RenderTeam
                      key={member.id}
                      imgURL={
                        member.image_url &&
                        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/${member.image_url}`
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Button variant="default">Pin</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
