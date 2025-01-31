"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import KanbanAddModalMembers from "@/app/home/kanban/[id]/_components/kanban_modals/kanban-add-modal-members";
import { createNewTask } from "@/app/home/kanban/[id]/actions";
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
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";

// Constants based on schema
const PRIORITY_LEVELS = ["critical", "high", "medium", "low"];
const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];
const TASK_TYPES = ["feature", "bug", "improvement", "documentation"];

interface TaskModalData {
  listId: string;
  listName: string;
}

const TaskAddModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "taskAddModal";
  const router = useRouter();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const validateInput = (formData: FormData) => {
    const title = formData.get("title");
    if (!title) {
      throw new Error("Title is required");
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      validateInput(formData);

      // Add selected members to form data
      if (selectedMembers.length > 0) {
        formData.append("sidekick_ids", selectedMembers.join(","));
      }

      const response = await createNewTask(formData);

      if (response.success) {
        toast.success("Task created successfully");
        router.refresh();
        onClose();
      } else {
        toast.error(response.error || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="h-[32rem] w-[90%] max-w-3xl overflow-y-auto lg:h-auto">
        <form action={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="text-left text-lg">
              Add New Task
            </DialogTitle>
          </DialogHeader>

          {data?.listName && (
            <Label>
              List:{" "}
              <span className="text-yellow-500 underline">{data.listName}</span>
            </Label>
          )}

          <input type="hidden" name="kanban_column_id" value={data?.listId} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              id="title"
              type="text"
              label="Task Title"
              name="title"
              placeholder="Enter task title"
              required
            />

            <Input
              id="points"
              type="number"
              label="Points"
              name="points"
              min="0"
              placeholder="Enter points"
            />

            <div>
              <label>Priority Level</label>
              <Select name="priority">
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
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

            <div>
              <label>Difficulty</label>
              <Select name="difficulty">
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
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

            <div>
              <label>Task Type</label>
              <Select name="type">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {TASK_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Input
              id="pr_link"
              label="PR Link"
              name="pr_link"
              placeholder="Enter PR link"
            />
          </div>

          <KanbanAddModalMembers
            onMembersChange={(memberIds: string[]) => {
              setSelectedMembers(memberIds);
            }}
          />

          <div>
            <label>Description</label>
            <Textarea
              name="description"
              className="h-32 resize-none"
              placeholder="Add task description..."
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="w-full sm:w-auto"
            >
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAddModal;
