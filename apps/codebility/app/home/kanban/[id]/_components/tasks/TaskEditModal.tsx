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
    skill_category_id: "", // NEW field
  });

  // State for skill categories
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);

  // Fetch available skill categories from Supabase
  useEffect(() => {
    async function loadSkillCategories() {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from("skill_category")
        .select("id, name");
      if (error) {
        console.error("Error fetching skill categories:", error.message);
      } else if (data) {
        setSkillCategories(data);
      }
    }
    loadSkillCategories();
  }, []);

  // When the modal opens, initialize the form fields from the passed data
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
        skill_category_id: data.skill_category_id || "", // initialize skill category
      });
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
      // Validate required fields
      const title = taskData.title;
      if (!title) throw new Error("Title is required");
      if (!taskData.skill_category_id) {
        throw new Error("Skill category is required");
      }

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
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      onClose();
    }
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

            {/* Skill Category Dropdown (Required) */}
            <div className="flex flex-col gap-2">
              <label>Skill Category</label>
              <Select
                value={taskData.skill_category_id}
                onValueChange={(value) =>
                  handleInputChange("skill_category_id", value)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Skill Category" />
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
          </div>

          {/* Primary Assignee: Allow only a single selection */}
          <div className="mt-4">
            <Label>Primary Assignee</Label>
            <KanbanAddModalMembers
              singleSelection={true}
              onMembersChange={(memberIds: string[]) => {
                // With singleSelection enabled, we expect one value only.
                handleInputChange("codev_id", memberIds[0] || "");
              }}
              projectId={data?.projectId}
            />
          </div>

          {/* Sidekick Helpers: Multiple selection allowed. Disable primary assignee */}
          <div className="mt-4">
            <Label>Sidekick Helpers (each gets half the total points)</Label>
            <KanbanAddModalMembers
              initialSelectedMembers={taskData.sidekick_ids}
              onMembersChange={(memberIds) =>
                handleInputChange("sidekick_ids", memberIds)
              }
              projectId={data?.projectId}
              disabledMembers={taskData.codev_id ? [taskData.codev_id] : []}
            />
          </div>

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
