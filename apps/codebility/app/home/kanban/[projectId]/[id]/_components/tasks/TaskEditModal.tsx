"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import {
  fetchAvailableMembers,
  updateTask,
} from "@/app/home/kanban/[projectId]/[id]/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModal } from "@/hooks/use-modal";
import { IconPlus } from "@/public/assets/svgs";
import { useUserStore } from "@/store/codev-store";
import { useKanbanStore } from "@/store/kanban-store";
import { SkillCategory, Task } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import toast from "react-hot-toast";

import { cn } from "@codevs/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";

import DifficultyPointsTooltip, {
  DIFFICULTY_LEVELS,
  DIFFICULTY_POINTS,
} from "../DifficultyPointsTooltip";
import KanbanRichTextEditor from "../kanban_modals/KanbanRichTextEditor";

const PRIORITY_LEVELS = ["critical", "high", "medium", "low"];
const TASK_TYPES = ["FEATURE", "BUG", "IMPROVEMENT", "DOCUMENTATION"];

interface CodevMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

interface TaskFormData extends Partial<Task> {
  projectId?: string;
}

function MemberSelector({
  selectedMemberIds = [],
  onMembersChange,
  projectId,
  disabledMembers = [],
  singleSelection = false,
  label = "Team Members",
}: {
  selectedMemberIds?: string[];
  onMembersChange?: (memberIds: string[]) => void;
  projectId: string;
  disabledMembers?: string[];
  singleSelection?: boolean;
  label?: string;
}) {
  const [availableMembers, setAvailableMembers] = useState<CodevMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [supabase, setSupabase] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    if (!projectId || !supabase) {
      setAvailableMembers([]);
      setIsLoading(false);
      return;
    }

    const loadMembers = async () => {
      setIsLoading(true);
      try {
        const members = await fetchAvailableMembers(projectId);
        if (Array.isArray(members) && members.length > 0) {
          setAvailableMembers(members);
        } else {
          setAvailableMembers([]);
        }
        const { data: userData } = await supabase.auth.getUser();
        setUser(userData?.user);
      } catch (error) {
        console.error("Error loading members:", error);
        setAvailableMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [projectId, supabase]);

  const selectedMembers = availableMembers.filter((member) =>
    selectedMemberIds.includes(member.id),
  );

  const filteredMembers = availableMembers.filter(
    (member) =>
      `${member.first_name} ${member.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      !disabledMembers.includes(member.id),
  );

  const addMember = (memberId: string) => {
    let newIds: string[];
    if (singleSelection) {
      newIds = [memberId];
    } else if (!selectedMemberIds.includes(memberId)) {
      newIds = [...selectedMemberIds, memberId];
    } else {
      return;
    }
    onMembersChange?.(newIds);
  };

  const removeMember = (memberId: string) => {
    const newIds = selectedMemberIds.filter((id) => id !== memberId);
    onMembersChange?.(newIds);
  };

  const handleSelfAssign = () => {
    if (user?.id && !selectedMemberIds.includes(user.id)) {
      const newIds = singleSelection
        ? [user.id]
        : [...selectedMemberIds, user.id];
      onMembersChange?.(newIds);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {selectedMembers.map((member) => (
          <div
            key={member.id}
            className="group relative h-10 w-10 cursor-pointer rounded-full hover:opacity-80"
            onClick={() => removeMember(member.id)}
            title={`${member.first_name} ${member.last_name} - Click to remove`}
          >
            {member.image_url ? (
              <Image
                src={member.image_url}
                alt={`${member.first_name}'s avatar`}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-sm font-medium">
                {member.first_name[0]}
              </div>
            )}
            <div className="absolute inset-0 hidden items-center justify-center rounded-full bg-black bg-opacity-40 group-hover:flex">
              <span className="text-xs text-white">✕</span>
            </div>
          </div>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="h-10 w-10 rounded-full bg-blue-500 p-0 hover:bg-blue-600"
              disabled={isLoading}
              type="button"
            >
              <IconPlus className="h-4 w-4 text-white" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="max-h-[300px] w-64 overflow-y-auto p-2"
            align="start"
          >
            <DropdownMenuLabel>Assign {label}</DropdownMenuLabel>

            <div className="px-2 py-2">
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              />
            </div>

            <DropdownMenuSeparator />

            {isLoading ? (
              <div className="py-4 text-center text-sm text-gray-500">
                Loading members...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">
                {availableMembers.length === 0
                  ? "No members available"
                  : "No members found"}
              </div>
            ) : (
              filteredMembers.map((member) => (
                <DropdownMenuItem
                  key={member.id}
                  className="flex cursor-pointer items-center gap-2 px-2 py-1"
                  onClick={() => addMember(member.id)}
                  disabled={selectedMemberIds.includes(member.id)}
                >
                  {member.image_url ? (
                    <Image
                      src={member.image_url}
                      alt={`${member.first_name}'s avatar`}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs">
                      {member.first_name[0]}
                    </div>
                  )}
                  <span className="flex-1 truncate">
                    {member.first_name} {member.last_name}
                  </span>
                  {selectedMemberIds.includes(member.id) && (
                    <span className="text-xs text-blue-500">✓</span>
                  )}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {user && (!singleSelection || selectedMemberIds.length === 0) && (
          <button
            onClick={handleSelfAssign}
            disabled={isLoading || selectedMemberIds.includes(user.id)}
            type="button"
            className="ml-2 w-fit cursor-pointer text-xs font-light text-gray-600 hover:text-blue-500 disabled:opacity-50 dark:text-slate-300 dark:hover:text-blue-400"
          >
            {selectedMemberIds.includes(user.id)
              ? "Assigned to you"
              : "Assign to me"}
          </button>
        )}
      </div>
    </div>
  );
}

const TaskEditModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "taskEditModal";
  const user = useUserStore((state) => state.user);
  const [supabase, setSupabase] = useState<any>(null);

  const { fetchBoardData, boardData } = useKanbanStore();

  const [boardId, setBoardId] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [taskData, setTaskData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "",
    difficulty: "",
    type: "",
    pr_link: "",
    points: 0,
    sidekick_ids: [],
    skill_category_id: "",
    codev_id: "",
    projectId: "",
  });

  // Calculate points based on difficulty
  const getPointsFromDifficulty = (difficulty: string): number => {
    return DIFFICULTY_POINTS[difficulty as keyof typeof DIFFICULTY_POINTS] || 0;
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: taskData.description || "",
    immediatelyRender: false,
  });
  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  // Fetch skill categories
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

  useEffect(() => {
    if (!supabase) return;

    if (isModalOpen && data) {
      const fetchProjectData = async () => {
        try {
          // Get board_id from kanban_column
          const { data: column } = await supabase
            .from("kanban_columns")
            .select("board_id")
            .eq("id", data.kanban_column_id)
            .single();

          if (column?.board_id) {
            setBoardId(column.board_id); // Store the board ID

            // Get project_id from kanban_board
            const { data: board } = await supabase
              .from("kanban_boards")
              .select("project_id")
              .eq("id", column.board_id)
              .single();

            if (board?.project_id) {
              const difficulty = data.difficulty || "";
              const calculatedPoints = difficulty
                ? getPointsFromDifficulty(difficulty)
                : data.points || 0;

              setTaskData({
                title: data.title || "",
                description: data.description || "",
                priority: data.priority || "",
                difficulty: difficulty,
                type: data.type || "",
                pr_link: data.pr_link || "",
                points: calculatedPoints,
                sidekick_ids: data.sidekick_ids || [],
                skill_category_id: data.skill_category?.id || "",
                codev_id: data.codev?.id || "",
                projectId: board.project_id,
              });
            }
          }
        } catch (error) {
          console.error("Error fetching project data:", error);
          toast.error("Failed to load task data");
        }
      };

      fetchProjectData();
    }
  }, [isModalOpen, data, supabase]);

  const handleInputChange = (
    key: keyof Task,
    value: string | number | string[],
  ) => {
    setTaskData((prev) => {
      const updated = { ...prev, [key]: value };
      // Auto-calculate points when difficulty changes
      if (key === "difficulty" && typeof value === "string") {
        updated.points = getPointsFromDifficulty(value);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!taskData.title) throw new Error("Title is required");
      if (!taskData.skill_category_id)
        throw new Error("Skill category is required");

      const descriptionToSave =
        !taskData.description ||
        taskData.description.trim() === "" ||
        taskData.description === "<p></p>"
          ? "No description provided"
          : taskData.description;

      const formData = new FormData();

      formData.append("title", taskData.title);
      formData.append("description", descriptionToSave);
      formData.append("priority", taskData.priority || "");
      formData.append("difficulty", taskData.difficulty || "");
      formData.append("type", taskData.type || "");
      formData.append("pr_link", taskData.pr_link || "");
      formData.append("points", String(taskData.points || 0));
      formData.append("skill_category_id", taskData.skill_category_id);
      formData.append("codev_id", taskData.codev_id ?? "null");

      if (taskData.sidekick_ids && taskData.sidekick_ids.length > 0) {
        formData.append("sidekick_ids", taskData.sidekick_ids.join(","));
      } else {
        formData.append("sidekick_ids", "");
      }

      const response = await updateTask(formData, data.id);
      if (response.success) {
        toast.success("Task updated successfully.");
        await fetchBoardData();
        onClose();
      } else {
        toast.error(response.error || "Failed to update task.");
      }
    } catch (error) {
      console.error("Submit error:", error);
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
      <DialogContent className="phone:h-full phone:w-full tablet:h-full tablet:w-full h-auto max-h-[900px] w-[95vw] max-w-3xl overflow-y-auto bg-white p-4 dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Edit Task: {taskData.title}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                className="focus:border-customBlue-500 border-gray-300 dark:border-gray-700"
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
                placeholder="Select difficulty to auto-calculate points"
                value={String(taskData.points)}
                disabled={true}
                readOnly
                className="bg-light-900 dark:bg-dark-200 dark:text-light-900 cursor-not-allowed border border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <Select
                value={taskData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger className="focus:border-customBlue-500 border-gray-300 dark:border-gray-700">
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
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Difficulty</Label>
                <DifficultyPointsTooltip />
              </div>
              <Select
                value={taskData.difficulty}
                onValueChange={(value) =>
                  handleInputChange("difficulty", value)
                }
              >
                <SelectTrigger className="focus:border-customBlue-500 border-gray-300 dark:border-gray-700">
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
              <Select
                value={taskData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger className="focus:border-customBlue-500 border-gray-300 dark:border-gray-700">
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

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900 dark:text-white">
                Skill Category
              </Label>
              <Select
                value={taskData.skill_category_id}
                onValueChange={(value) =>
                  handleInputChange("skill_category_id", value)
                }
                required
              >
                <SelectTrigger className="focus:border-customBlue-500 border-gray-300 dark:border-gray-700">
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

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Primary Assignee</Label>
              <MemberSelector
                selectedMemberIds={taskData.codev_id ? [taskData.codev_id] : []}
                onMembersChange={(memberIds) => {
                  handleInputChange("codev_id", memberIds[0] || "");
                }}
                projectId={boardData.project_id}
                singleSelection={true}
                label="Primary Assignee"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Sidekick Helpers
                <span className="ml-2 text-xs text-gray-500">(Optional)</span>
              </Label>
              <MemberSelector
                selectedMemberIds={taskData.sidekick_ids || []}
                onMembersChange={(memberIds) => {
                  handleInputChange("sidekick_ids", memberIds);
                }}
                projectId={boardData.project_id}
                disabledMembers={taskData.codev_id ? [taskData.codev_id] : []}
                singleSelection={false}
                label="Sidekick Helpers"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <KanbanRichTextEditor
              value={taskData.description || ""}
              onChange={(content) => {
                handleInputChange("description", content);
              }}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              // className="text-md bg-customBlue-100 hover:bg-customBlue-200 focus-visible:ring-customBlue-100 flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md px-6 py-1 text-white ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto lg:text-lg"
              style={{
                  backgroundColor: "#2563EB",
                  color: "white",
                  padding: "6px 16px",
                  fontSize: "14px",
                  borderRadius: "4px",
                  border: "none",
                  minWidth: "auto",
                  width: "auto",
                }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              // className="text-md bg-customBlue-100 hover:bg-customBlue-200 focus-visible:ring-customBlue-100 flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md px-6 py-1 text-white ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto lg:text-lg"
              style={{
                  backgroundColor: "#2563EB",
                  color: "white",
                  padding: "6px 16px",
                  fontSize: "14px",
                  borderRadius: "4px",
                  border: "none",
                  minWidth: "auto",
                  width: "auto",
                }}
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