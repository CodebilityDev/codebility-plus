"use client";

import type { SkillCategory } from "@/types/home/codev";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { useUserStore } from "@/store/codev-store";
import { createClientClientComponent } from "@/utils/supabase/client";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";

import { createNewTask } from "../../actions";
import DifficultyPointsTooltip, { DIFFICULTY_LEVELS, DIFFICULTY_POINTS } from "../DifficultyPointsTooltip";
import KanbanAddModalMembers from "../kanban_modals/KanbanAddModalMembers";
import KanbanRichTextEditor from "../kanban_modals/KanbanRichTextEditor";

const PRIORITY_LEVELS = ["critical", "high", "medium", "low"];
const TASK_TYPES = ["FEATURE", "BUG", "IMPROVEMENT", "DOCUMENTATION"];

const TaskAddModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "taskAddModal";
  const [mainAssignee, setMainAssignee] = useState<string>("");
  const [sidekicks, setSidekicks] = useState<string[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [description, setDescription] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const user = useUserStore((state) => state.user);
  const [supabase, setSupabase] = useState<any>(null);

  const router = useRouter();

  const onChange = (value: string) => {
    setDescription(value);
  };

  // Calculate points based on difficulty
  const getPointsFromDifficulty = (difficulty: string): number => {
    return DIFFICULTY_POINTS[difficulty as keyof typeof DIFFICULTY_POINTS] || 0;
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
  };

  // Reset form when modal closes
  const handleClose = () => {
    setSelectedDifficulty("");
    setDescription("");
    setMainAssignee("");
    setSidekicks([]);
    onClose();
  };

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const loadSkillCategories = async () => {
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
  }, [supabase]);

  const handleSubmit = async (formData: FormData) => {
    try {
      setLoading(true);

      if (!formData.get("title")) throw new Error("Title is required");
      if (!formData.get("skill_category_id"))
        throw new Error("Skill category is required");
      if (!selectedDifficulty) throw new Error("Difficulty is required");

      formData.append(
        "description",
        description.trim() || "<p>No description provided</p>",
      );

      // Set points based on selected difficulty
      const calculatedPoints = getPointsFromDifficulty(selectedDifficulty);
      formData.set("points", calculatedPoints.toString());

      const image = formData.get("image");
      if (image && image instanceof File) {
        formData.append("image", image);
      }

      if (mainAssignee) {
        formData.append("codev_id", mainAssignee);
      }

      if (sidekicks.length)
        formData.append("sidekick_ids", sidekicks.join(","));

      formData.append("created_by", user?.id as string);

      const response = await createNewTask(formData);
      if (response.success) {
        toast.success("Task created successfully");
        handleClose();

        router.refresh();
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
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="phone:h-full phone:w-full tablet:h-full tablet:w-full laptop:h-[90vh] laptop:max-h-[800px] h-[95vh] max-h-[900px] w-[95vw] max-w-3xl overflow-y-auto bg-white p-4 dark:bg-gray-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            startTransition(() => handleSubmit(formData));
          }}
          className="flex flex-col gap-6"
        >
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
              <div className="flex items-center gap-2">
                <Label htmlFor="points" className="text-sm font-medium">
                  Points (Based on Difficulty)
                </Label>
              </div>
              <Input
                id="points"
                name="points"
                type="number"
                min="0"
                className="bg-light-900 dark:bg-dark-200 dark:text-light-900 cursor-not-allowed border border-gray-300"
                value={getPointsFromDifficulty(selectedDifficulty)}
                placeholder="Select difficulty to auto-calculate points"
                disabled={true}
                readOnly
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
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Difficulty</Label>
                <DifficultyPointsTooltip />
              </div>
              <Select
                name="difficulty"
                value={selectedDifficulty}
                onValueChange={handleDifficultyChange}
              >
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
                        {level.charAt(0).toUpperCase() + level.slice(1)} -{" "}
                        {
                          DIFFICULTY_POINTS[
                            level as keyof typeof DIFFICULTY_POINTS
                          ]
                        }{" "}
                        pts
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
                        {type.charAt(0).toUpperCase() +
                          type.slice(1).toLowerCase()}
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
            <div className="grid grid-cols-1 md:grid-cols-2">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <KanbanRichTextEditor value={description} onChange={onChange} />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="text-md flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-blue-100 px-6 py-3 text-white ring-offset-background transition-colors duration-300 hover:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto lg:text-lg"
              disabled={loading || isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-md flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-blue-100 px-6 py-1 text-white ring-offset-background transition-colors duration-300 hover:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto lg:text-lg"
              disabled={loading || isPending}
            >
              {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              {loading || isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskAddModal;
