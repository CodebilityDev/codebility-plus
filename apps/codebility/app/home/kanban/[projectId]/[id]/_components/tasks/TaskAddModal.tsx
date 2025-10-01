"use client";

import type { SkillCategory } from "@/types/home/codev";
import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
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
import { createClientClientComponent } from "@/utils/supabase/client";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";

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

import { createNewTask } from "../../actions";
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

// Fetch available members
const fetchAvailableMembers = async (
  projectId: string,
): Promise<CodevMember[]> => {
  try {
    const supabase = createClientClientComponent();
    if (!supabase) return [];

    const { data: projectMembers, error: projectMembersError } = await supabase
      .from("project_members")
      .select("codev_id, role")
      .eq("project_id", projectId);

    if (projectMembersError || !projectMembers?.length) return [];

    const allMemberIds = projectMembers.map((member) => member.codev_id);

    const { data: codevMembers, error: codevError } = await supabase
      .from("codev")
      .select("id, first_name, last_name, image_url, availability_status")
      .in("id", allMemberIds);

    if (codevError || !codevMembers?.length) return [];

    return codevMembers
      .filter((member) => member.availability_status === true)
      .map((member) => ({
        id: member.id,
        first_name: member.first_name,
        last_name: member.last_name,
        image_url: member.image_url,
      }));
  } catch (error) {
    console.error("Error in fetchAvailableMembers:", error);
    return [];
  }
};

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
  const [deadline, setDeadline] = useState<string>(""); // NEW: deadline state
  const user = useUserStore((state) => state.user);
  const [supabase, setSupabase] = useState<any>(null);

  const { fetchBoardData } = useKanbanStore();

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
    setDeadline(""); // NEW: reset deadline
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

      // NEW: Add deadline to formData
      if (deadline) {
        formData.append("deadline", deadline);
      }

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
        await fetchBoardData();
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
            <div className="bg-customBlue-50 dark:bg-customBlue-900/20 rounded-md p-2">
              <Label className="text-customBlue-700 dark:text-customBlue-100 text-sm">
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
                className="bg-light-900 dark:bg-dark-200 dark:text-light-900 focus:border-customBlue-500 border border-gray-300 "
                required
              />
            </div>

            {/* NEW: Deadline Input */}
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm font-medium">
                Deadline
              </Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-light-900 dark:bg-dark-200 dark:text-light-900 focus:border-customBlue-500 border border-gray-300"
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
                <SelectTrigger className="bg-light-900 focus:border-customBlue-500 border border-gray-300 dark:border-gray-700">
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
                <SelectTrigger className="bg-light-900 focus:border-customBlue-500 border border-gray-300 dark:border-gray-700">
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
                <SelectTrigger className="bg-light-900 focus:border-customBlue-500 border border-gray-300 dark:border-gray-700">
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
                <SelectTrigger className="bg-light-900 focus:border-customBlue-500 border border-gray-300 dark:border-gray-700">
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Primary Assignee{" "}
                <span className="ml-2 text-xs text-gray-500">(Optional)</span>
              </Label>
              {data?.projectId ? (
                <MemberSelector
                  selectedMemberIds={mainAssignee ? [mainAssignee] : []}
                  onMembersChange={(memberIds) => {
                    setMainAssignee(memberIds[0] || "");
                  }}
                  projectId={data.projectId}
                  singleSelection={true}
                  label="Primary Assignee"
                />
              ) : (
                <div className="text-sm text-gray-500">Loading project...</div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Sidekick Helpers{" "}
                <span className="ml-2 text-xs text-gray-500">(Optional)</span>
              </Label>
              {data?.projectId ? (
                <MemberSelector
                  selectedMemberIds={sidekicks}
                  onMembersChange={setSidekicks}
                  projectId={data.projectId}
                  disabledMembers={mainAssignee ? [mainAssignee] : []}
                  singleSelection={false}
                  label="Sidekick Helpers"
                />
              ) : (
                <div className="text-sm text-gray-500">Loading project...</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <KanbanRichTextEditor value={description} onChange={onChange} />
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              style={{
                backgroundColor: "#3B82F6",
                color: "white",
                padding: "6px 16px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "none",
                minWidth: "auto",
                width: "auto",
              }}
              disabled={loading || isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
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