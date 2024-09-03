import { Dialog, DialogContent, DialogTrigger } from "@codevs/ui/dialog"
import RenderTeam from "@/Components/shared/dashboard/RenderTeam" 
import { Paragraph } from "@/Components/shared/home"
import { Button } from "@/Components/ui/button"
import { Task } from "@/types/home/task";
import { Member } from "../../_types/member";

interface Props {
  children: React.ReactNode;
  task: Task;
  taskMembers: Member[];
}

export default function TaskViewModal({ children, task, taskMembers }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="h-[32rem] w-[80%] max-w-sm overflow-x-auto overflow-y-auto lg:h-auto">
        <div className="flex flex-col gap-6">
          <div key={task.id}>
            <div className="relative flex flex-col gap-1">
              <p className="text-lg font-semibold">{task.title}</p>
              {/* <p className="text-sm">{task.subheader}</p> */}
              <Paragraph>{task.description}</Paragraph>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray">
                Duration Hours: <p className="text-sm uppercase text-dark-100 dark:text-white">{task.duration}</p>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray">
                Points: <p className="text-sm uppercase text-dark-100 dark:text-white">{task.points}</p>
              </div>
              <p className="text-sm">Priority Level: {task.priority_level}</p>
            </div>

            <div className="flex flex-row justify-between gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-sm">Members</p>
                <div className="grid grid-cols-3 gap-1 ">
                  {taskMembers.map((member) => (
                    <RenderTeam key={member.id} imgURL={member.image_url} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Button variant="default">Pin</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
