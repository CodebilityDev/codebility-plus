"use client";

import type { SkillCategory } from "@/types/home/codev";
import { useEffect, useState, useTransition } from "react";
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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";

import { createNewTask } from "../../actions";
import KanbanAddModalMembers from "../kanban_modals/KanbanAddModalMembers";

const PRIORITY_LEVELS = ["critical", "high", "medium", "low"];
const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];
const TASK_TYPES = ["FEATURE", "BUG", "IMPROVEMENT", "DOCUMENTATION"];

const TaskAddModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "taskAddModal";
  const [mainAssignee, setMainAssignee] = useState<string>("");
  const [sidekicks, setSidekicks] = useState<string[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);

      if (!formData.get("title")) throw new Error("Title is required");
      if (!formData.get("skill_category_id"))
        throw new Error("Skill category is required");

      if (mainAssignee) {
        formData.append("codev_id", mainAssignee);
      }

      if (sidekicks.length)
        formData.append("sidekick_ids", sidekicks.join(","));

      const response = await createNewTask(formData);
      if (response.success) {
        toast.success("Task created successfully");
        onClose();

        // More aggressive approach - force a complete page reload
        window.location.href = window.location.pathname + "?t=" + Date.now();
      } else {
        toast.error(response.error || "Failed to create task");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create task",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="h-[90vh] w-[90%] max-w-3xl overflow-y-auto bg-white dark:bg-gray-900 lg:h-auto">
        <form action={handleSubmit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Add New Task
            </DialogTitle>
          </DialogHeader>

          {data?.listName && (
            <div className="rounded-md bg-blue-50 p-2 dark:bg-blue-900/20">
              <Label className="text-sm text-blue-700 dark:text-blue-300">
                Adding to: {data.listName}
              </Label>
            </div>
          )}

          <input type="hidden" name="kanban_column_id" value={data?.listId} />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Task Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter task title"
                className="bg-light-900 dark:bg-dark-200 dark:text-light-900 border border-gray-300 focus:border-blue-500 "
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points" className="text-sm font-medium">
                Points
              </Label>
              <Input
                id="points"
                name="points"
                type="number"
                min="0"
                className="bg-light-900 dark:bg-dark-200 dark:text-light-900 border border-gray-300 focus:border-blue-500 "
                placeholder="Task points"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <Select name="priority">
                <SelectTrigger className="bg-light-900 border border-gray-300 focus:border-blue-500 dark:border-gray-700">
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

            <div className="space-y-2">
              <Label className="text-sm font-medium">Difficulty</Label>
              <Select name="difficulty">
                <SelectTrigger className="bg-light-900 border border-gray-300 focus:border-blue-500 dark:border-gray-700">
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

            <div className="space-y-2">
              <Label className="text-sm font-medium">Task Type</Label>
              <Select name="type">
                <SelectTrigger className="bg-light-900 border border-gray-300 focus:border-blue-500 dark:border-gray-700">
                  <SelectValue placeholder="Select type" />
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

            <div className="space-y-2">
              <Label className="text-sm font-medium">Skill Category</Label>
              <Select name="skill_category_id" required>
                <SelectTrigger className="bg-light-900 border border-gray-300 focus:border-blue-500 dark:border-gray-700">
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
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Primary Assignee
                <span className="ml-2 text-xs text-gray-500">(Optional)</span>
              </Label>
              <KanbanAddModalMembers
                singleSelection
                onMembersChange={(ids) => setMainAssignee(ids[0] || "")}
                projectId={data?.projectId}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Sidekick Helpers
                <span className="ml-2 text-xs text-gray-500">(Optional)</span>
              </Label>
              <KanbanAddModalMembers
                onMembersChange={setSidekicks}
                projectId={data?.projectId}
                disabledMembers={[mainAssignee]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                className="dark:bg-dark-200 min-h-[120px] border-gray-300 focus:border-blue-500 dark:border-gray-700"
                placeholder="Add task description..."
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
              disabled={loading || isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto"
              disabled={loading || isPending}
            >
              {loading || isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAddModal;
