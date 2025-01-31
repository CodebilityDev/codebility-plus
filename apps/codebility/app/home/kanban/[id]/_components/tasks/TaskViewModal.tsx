"use client";

import Image from "next/image";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useModal } from "@/hooks/use-modal";
import { Task } from "@/types/home/codev";
import { Ellipsis } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";

// Constants matching your schema
const PRIORITY_LEVELS = ["critical", "high", "medium", "low"];
const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];

const TaskViewModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "taskViewModal";
  const task = data as Task;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="h-[32rem] w-[90%] max-w-3xl overflow-y-auto lg:h-[44rem]">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <DialogHeader>
              <DialogTitle className="break-words text-left text-lg font-bold">
                {task?.title}
              </DialogTitle>
            </DialogHeader>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Ellipsis className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => onOpen("taskEditModal", task)}
                  className="cursor-pointer"
                >
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onOpen("taskDeleteModal", task)}
                  className="cursor-pointer"
                >
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Task Title" value={task?.title} disabled />

            <Input
              label="Points"
              type="number"
              value={task?.points || 0}
              disabled
            />

            <div>
              <label>Priority</label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder={task?.priority || "None"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup />
                </SelectContent>
              </Select>
            </div>

            <div>
              <label>Difficulty</label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder={task?.difficulty || "None"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup />
                </SelectContent>
              </Select>
            </div>

            <Input
              label="Pull Request Link"
              value={task?.pr_link || ""}
              disabled
            />
          </div>

          {task?.sidekick_ids && task.sidekick_ids.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {task.sidekick_ids.map((memberId) => (
                <div key={memberId} className="relative h-12 w-12 rounded-full">
                  <Image
                    alt="Member avatar"
                    src={`/api/placeholder/48/48`} // Replace with your actual member image source
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div>
            <label>Description</label>
            <Textarea
              value={task?.description || "No description provided"}
              className="h-32 resize-none"
              disabled
            />
          </div>

          <DialogFooter>
            <Button onClick={onClose} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskViewModal;
