"use client";

import RenderTeam from "@/components/shared/dashboard/RenderTeam";
import { Paragraph } from "@/components/shared/home";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Task } from "@/types/home/codev";

interface Member {
  image_url: string;
  // other fields if needed
}

interface Props {
  children: React.ReactNode;
  task: Task;
  taskMembers: Member[];
}

export default function TaskViewModal({ children, task, taskMembers }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent aria-describedby={undefined} className="w-[90%] max-w-md">
        <DialogHeader className="relative hidden">
          <DialogTitle className="mb-2 text-left text-xl">
            Task View
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div key={task.id} className="flex flex-col gap-y-5">
            <div className="relative flex flex-col gap-1">
              <p className="text-lg font-semibold text-white">{task.title}</p>
              <Paragraph>{task.description}</Paragraph>

              <div className="text-gray mt-1 flex items-center gap-2 text-xs">
                Points:{" "}
                <p className="text-dark-100 text-sm uppercase dark:text-white">
                  {task.points}
                </p>
              </div>

              <div className="text-gray mt-1 flex items-center gap-2 text-xs">
                Priority Level:{" "}
                <p className="text-dark-100 text-sm dark:text-white">
                  {task.priority}
                </p>
              </div>
            </div>

            <div className="flex flex-row justify-between gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-white">Members</p>
                <div>
                  {taskMembers.map((member, index) => (
                    <RenderTeam key={index} imgURL={member.image_url} />
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
