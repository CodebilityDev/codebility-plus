"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import KanbanAddModalMembers from "@/app/home/kanban/[id]/_components/kanban_modals/KanbanAddModalMembers";
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
import { SkillCategory, Task } from "@/types/home/codev";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";

const PRIORITY_LEVELS = ["critical", "high", "medium", "low"];
const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];
const TASK_TYPES = ["FEATURE", "BUG", "IMPROVEMENT", "DOCUMENTATION"];

interface Props {
  task?: Task;
}

const TaskEditModal = ({ task }: Props) => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "taskEditModal";
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [taskData, setTaskData] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "",
    difficulty: "",
    type: "",
    pr_link: "",
    points: 0,
    sidekick_ids: [],
    skill_category_id: "",
    codev_id: "", // Primary assignee
  });

  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);

  // Fetch skill categories (same as in TaskAddModal)
  useEffect(() => {
    const loadSkillCategories = async () => {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from("skill_category")
        .select("id, name")
        .order("name");

      if (error) {
        toast.error("Failed to load skill categories");
      } else if (data) {
        setSkillCategories(data);
      }
    };
    loadSkillCategories();
  }, []);

  useEffect(() => {
    if (data && isModalOpen) {
      const newTaskData = {
        title: data.title || "",
        description: data.description || "",
        priority: data.priority || "",
        difficulty: data.difficulty || "",
        type: data.type || "",
        pr_link: data.pr_link || "",
        points: data.points || 0,
        sidekick_ids: data.sidekick_ids || [],
        skill_category_id: data.skill_category?.id || "",
        codev_id: data.codev?.id || "",
      };
      console.log("Initializing taskData with:", newTaskData);
      setTaskData(newTaskData);
    }
  }, [isModalOpen, data]);

  const handleInputChange = (
    key: keyof Task,
    value: string | number | string[],
  ) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!taskData.title) throw new Error("Title is required");
      if (!taskData.skill_category_id)
        throw new Error("Skill category is required");
      if (!taskData.codev_id) throw new Error("Primary assignee is required");

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
        onClose();
      } else {
        toast.error(response.error || "Failed to update task.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update task.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="h-[90vh] w-[90%] max-w-3xl overflow-y-auto bg-white dark:bg-gray-900 lg:h-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Task: {taskData.title}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Task Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Task Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter task title"
                value={taskData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="border-gray-300 focus:border-blue-500 dark:border-gray-700"
                required
              />
            </div>

            {/* Points */}
            <div className="space-y-2">
              <Label htmlFor="points" className="text-sm font-medium">
                Points
              </Label>
              <Input
                id="points"
                name="points"
                type="number"
                min="0"
                placeholder="Task points"
                value={String(taskData.points)}
                onChange={(e) =>
                  handleInputChange("points", Number(e.target.value))
                }
                className="border-gray-300 focus:border-blue-500 dark:border-gray-700"
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <Select
                value={taskData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 dark:border-gray-700">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PRIORITY_LEVELS.map((level) => (
                      <SelectItem
                        key={level}
                        value={level}
                        className="capitalize"
                      >
                        {level}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Difficulty</Label>
              <Select
                value={taskData.difficulty}
                onValueChange={(value) =>
                  handleInputChange("difficulty", value)
                }
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 dark:border-gray-700">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <SelectItem
                        key={level}
                        value={level}
                        className="capitalize"
                      >
                        {level}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Task Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Task Type</Label>
              <Select
                value={taskData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 dark:border-gray-700">
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {TASK_TYPES.map((type) => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="capitalize"
                      >
                        {type.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Skill Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Skill Category</Label>
              <Select
                value={taskData.skill_category_id}
                onValueChange={(value) =>
                  handleInputChange("skill_category_id", value)
                }
                required
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 dark:border-gray-700">
                  <SelectValue placeholder="Select skill category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {skillCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* PR Link */}
            <div className="space-y-2">
              <Label htmlFor="pr_link" className="text-sm font-medium">
                PR Link
              </Label>
              <Input
                id="pr_link"
                name="pr_link"
                placeholder="Enter PR link"
                value={taskData.pr_link}
                onChange={(e) => handleInputChange("pr_link", e.target.value)}
                className="border-gray-300 focus:border-blue-500 dark:border-gray-700"
              />
            </div>
          </div>

          {/* Primary Assignee */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Primary Assignee</Label>
            <KanbanAddModalMembers
              singleSelection
              onMembersChange={(memberIds) =>
                handleInputChange("codev_id", memberIds[0] || "")
              }
              projectId={data?.projectId}
              initialSelectedMembers={
                taskData.codev_id ? [taskData.codev_id] : []
              }
            />
          </div>

          {/* Sidekick Helpers */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Sidekick Helpers
              <span className="ml-2 text-xs text-gray-500">(Optional)</span>
            </Label>
            <KanbanAddModalMembers
              initialSelectedMembers={taskData.sidekick_ids}
              onMembersChange={(memberIds) =>
                handleInputChange("sidekick_ids", memberIds)
              }
              projectId={data?.projectId}
              disabledMembers={taskData.codev_id ? [taskData.codev_id] : []}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add task description..."
              value={taskData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-[120px] border-gray-300 focus:border-blue-500 dark:border-gray-700"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditModal;
