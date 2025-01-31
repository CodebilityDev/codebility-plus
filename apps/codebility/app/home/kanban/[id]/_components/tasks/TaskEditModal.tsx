"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import KanbanAddModalMembers from "@/app/home/kanban/[id]/_components/kanban_modals/kanban-add-modal-members";
import { updateTask } from "@/app/home/kanban/[id]/actions";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { useModal } from "@/hooks/use-modal";
import { IconCopy } from "@/public/assets/svgs";
import { Task } from "@/types/home/codev";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";
import { Textarea } from "@codevs/ui/textarea";

// Define constants based on your schema
const PRIORITY_LEVELS = ["critical", "high", "medium", "low"];
const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];
const TASK_TYPES = ["feature", "bug", "improvement", "documentation"];

interface Props {
  task?: Task;
}

const TaskEditModal = ({ task }: Props) => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "taskEditModal";
  const router = useRouter();

  // State based on your Task schema
  const [taskData, setTaskData] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "",
    difficulty: "",
    type: "",
    pr_link: "",
    points: 0,
    sidekick_ids: [],
  });

  useEffect(() => {
    if (data && isModalOpen) {
      setTaskData({
        title: data.title || "",
        description: data.description || "",
        priority: data.priority || "",
        difficulty: data.difficulty || "",
        type: data.type || "",
        pr_link: data.pr_link || "",
        points: data.points || 0,
        sidekick_ids: data.sidekick_ids || [],
      });
    }
  }, [isModalOpen, data]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(taskData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, value.join(","));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await updateTask(formData, data.id);
      if (response.success) {
        toast.success("Task updated successfully.");
        router.refresh();
      } else {
        toast.error(response.error || "Failed to update task.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Something went wrong.");
    } finally {
      onClose();
    }
  };

  const handleInputChange = (
    key: keyof Task,
    value: string | number | string[],
  ) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="h-[32rem] w-[90%] max-w-3xl overflow-y-auto lg:h-[44rem]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="text-left text-lg font-bold">
              Edit Task: {taskData.title}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Task Title"
              value={taskData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />

            <div className="flex flex-col gap-2">
              <label>Priority</label>
              <Select
                value={taskData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PRIORITY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label>Difficulty</label>
              <Select
                value={taskData.difficulty}
                onValueChange={(value) =>
                  handleInputChange("difficulty", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Input
              type="number"
              label="Points"
              value={taskData.points}
              onChange={(e) =>
                handleInputChange("points", Number(e.target.value))
              }
            />

            <Input
              label="PR Link"
              value={taskData.pr_link}
              onChange={(e) => handleInputChange("pr_link", e.target.value)}
            />
          </div>

          <KanbanAddModalMembers
            initialSelectedMembers={taskData.sidekick_ids}
            onMembersChange={(memberIds) =>
              handleInputChange("sidekick_ids", memberIds)
            }
          />

          <div className="flex flex-col gap-2">
            <label>Description</label>
            <Textarea
              value={taskData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="h-32 resize-none"
              placeholder="Task description..."
            />
          </div>

          <DialogFooter>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditModal;
