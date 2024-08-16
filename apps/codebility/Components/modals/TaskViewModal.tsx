"use client"

import { Dialog, DialogContent } from "@codevs/ui/dialog"
import { useModal } from "@/hooks/use-modal"
import RenderTeam from "@/Components/shared/dashboard/RenderTeam" 
import { Paragraph } from "@/Components/shared/home"
import { Button } from "@/Components/ui/button"
import { modals_TaskViewModal } from "@/types/components"
import { TaskT } from "@/types/index"

const TaskViewModal = () => {
  const { isOpen, onClose, type, data } = useModal()

  const isModalOpen = isOpen && type === "taskViewModal"

  const isTask = (data: TaskT | modals_TaskViewModal[] | undefined): data is TaskT => {
    return (data as TaskT)?.title !== undefined
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent hasButton className="h-[32rem] w-[80%] max-w-sm overflow-x-auto overflow-y-auto lg:h-auto">
        <div className="flex flex-col gap-6">
          {isTask(data) && (
            <div key={data.id}>
              <div className="relative flex flex-col gap-1">
                <p className="text-lg font-semibold">{data.title}</p>
                <p className="text-sm">{data.subheader}</p>
                <Paragraph>{data.full_description}</Paragraph>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray">
                  Duration Hours: <p className="text-sm uppercase text-dark-100 dark:text-white">{data.duration}</p>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray">
                  Points: <p className="text-sm uppercase text-dark-100 dark:text-white">{data.task_points}</p>
                </div>
                <p className="text-sm">Priority Level: {data.prio_level}</p>
              </div>

              <div className="flex flex-row justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <p className="text-sm">Members</p>
                  <div className="grid grid-cols-3 gap-1 ">
                    {data.userTask.map((userImage) => (
                      <RenderTeam key={userImage.id} imgURL={userImage.image_url} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <Button variant="default">Pin</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TaskViewModal
