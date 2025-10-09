"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import DefaultAvatar from "@/components/DefaultAvatar";
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
import { Ellipsis, Loader2Icon } from "lucide-react";
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

import { completeTask, updateTaskPRLink } from "../../actions";
import DifficultyPointsTooltip, {
  DIFFICULTY_LEVELS,
} from "../DifficultyPointsTooltip";

// Fetch available members function - unchanged from original
const fetchAvailableMembers = async (
  boardId: string,
): Promise<CodevMember[]> => {
  try {
    const supabase = createClientClientComponent();
    if (!supabase) return [];

    const { data: board, error: boardError } = await supabase
      .from("kanban_boards")
      .select("project_id")
      .eq("id", boardId)
      .single();

    if (boardError || !board?.project_id) return [];

    const { data: projectMembers, error: projectMembersError } = await supabase
      .from("project_members")
      .select("codev_id, role")
      .eq("project_id", board.project_id);

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

const PRIORITY_LEVELS = ["critical", "high", "medium", "low"];

interface CodevMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// Fixed AssigneeSelector component with proper removal functionality
function AssigneeSelector({
  primaryAssignee,
  onAssigneeChange,
  boardId,
  user,
  forceRefreshKey,
}: {
  primaryAssignee: CodevMember | null;
  onAssigneeChange: (memberIds: string[]) => void;
  boardId: string;
  user: any;
  forceRefreshKey?: string;
}) {
  const [availableMembers, setAvailableMembers] = useState<CodevMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [localAssignee, setLocalAssignee] = useState<CodevMember | null>(
    primaryAssignee,
  );

  useEffect(() => {
    setLocalAssignee(primaryAssignee);
  }, [primaryAssignee, forceRefreshKey]);

  useEffect(() => {
    if (!boardId) {
      setAvailableMembers([]);
      setIsLoading(false);
      return;
    }

    const loadMembers = async () => {
      setIsLoading(true);
      try {
        const members = await fetchAvailableMembers(boardId);
        if (Array.isArray(members) && members.length > 0) {
          setAvailableMembers(members);
        } else {
          setAvailableMembers([]);
        }
      } catch (error) {
        console.error("Error loading members:", error);
        setAvailableMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [boardId]);

  const filteredMembers = availableMembers.filter((member) =>
    `${member.first_name} ${member.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  // Restore proper removal functionality for AssigneeSelector
  const handleRemove = () => {
    setLocalAssignee(null);
    onAssigneeChange([]); // Pass empty array to indicate no assignee
    setTimeout(() => setLocalAssignee(null), 0); // Ensure UI updates
  };

  const handleSelect = (memberId: string) => {
    const selectedMember = availableMembers.find((m) => m.id === memberId);
    if (selectedMember) {
      setLocalAssignee(selectedMember);
      onAssigneeChange([memberId]);
    }
  };

  const handleSelfAssign = () => {
    if (user?.id) {
      const userAsMember = {
        id: user.id,
        first_name: user.first_name || "You",
        last_name: user.last_name || "",
        image_url: user.image_url,
      };
      setLocalAssignee(userAsMember);
      onAssigneeChange([user.id]);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-2">
        {localAssignee && (
          <div
            className="group relative h-10 w-10 cursor-pointer rounded-full hover:opacity-80"
            onClick={handleRemove}
            title={`${localAssignee.first_name} ${localAssignee.last_name} - Click to remove`}
          >
            {localAssignee.image_url ? (
              <Image
                src={localAssignee.image_url}
                alt={`${localAssignee.first_name}'s avatar`}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-sm">
                {localAssignee.first_name[0]}
              </div>
            )}
            <div className="absolute inset-0 hidden items-center justify-center rounded-full bg-black bg-opacity-40 group-hover:flex">
              <span className="text-xs text-white">✕</span>
            </div>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="h-10 w-10 rounded-full bg-blue-600 p-0 hover:bg-blue-700"
              disabled={isLoading}
            >
              <IconPlus className="h-4 w-4 text-white" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="max-h-[300px] w-64 overflow-y-auto p-2"
            align="start"
          >
            <DropdownMenuLabel>Assign Team Member</DropdownMenuLabel>

            <div className="px-2 py-2">
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dark:bg-dark-200 w-full rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  onClick={() => handleSelect(member.id)}
                  disabled={localAssignee?.id === member.id}
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
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm">
                      {member.first_name[0]}
                    </div>
                  )}
                  <span className="flex-1 truncate">
                    {member.first_name} {member.last_name}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {user && (!localAssignee || localAssignee.id !== user.id) && (
          <button
            onClick={handleSelfAssign}
            disabled={isLoading}
            type="button"
            className="ml-2 w-fit cursor-pointer text-xs font-light text-gray-600 hover:text-blue-500 dark:text-slate-300 dark:hover:text-blue-400"
          >
            Assign to me
          </button>
        )}
      </div>
    </div>
  );
}

const TaskViewModal = ({
  onComplete,
}: {
  onComplete?: (taskId: string) => void;
}) => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const user = useUserStore((state) => state.user);
  // Include removeTaskOptimistic in the destructured store methods
  const { fetchBoardData, removeTaskOptimistic } = useKanbanStore();

  const [isLoading, setIsLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [prLink, setPrLink] = useState("");
  const [originalPrLink, setOriginalPrLink] = useState("");
  const [supabase, setSupabase] = useState<any>(null);
  const [boardId, setBoardId] = useState<string>("");

  const [skillCategory, setSkillCategory] = useState<SkillCategory | null>(
    null,
  );
  const [sidekickDetails, setSidekickDetails] = useState<CodevMember[]>([]);
  const [primaryAssignee, setPrimaryAssignee] = useState<CodevMember | null>(
    null,
  );
  const [createdBy, setCreatedBy] = useState<CodevMember | null>(null);
  const [forceRefreshKey, setForceRefreshKey] = useState<string>("");

  // Enhanced state management for assignee changes
  const [manualSaveChanges, setManualSaveChanges] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);
  const [pendingAssigneeId, setPendingAssigneeId] = useState<
    string | undefined
  >(undefined);

  const isModalOpen = isOpen && type === "taskViewModal";
  const task = data as Task | null;

  const hasPrLinkChanges = prLink.trim() !== originalPrLink;
  const hasUnsavedChanges = manualSaveChanges || hasPrLinkChanges;

  const canModifyTask =
    user?.role_id === 1 ||
    user?.role_id === 5 ||
    user?.role_id === 4 ||
    user?.role_id === 10;
  const canMarkAsDone = user?.role_id === 1 || user?.role_id === 5;

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    if (!supabase || !task?.kanban_column_id) {
      setBoardId("");
      return;
    }

    const fetchBoardId = async () => {
      try {
        const { data, error } = await supabase
          .from("kanban_columns")
          .select("board_id")
          .eq("id", task.kanban_column_id)
          .single();

        if (error) {
          setBoardId("");
        } else if (data?.board_id) {
          setBoardId(data.board_id);
        }
      } catch (err) {
        console.error("Exception fetching board ID:", err);
        setBoardId("");
      }
    };

    fetchBoardId();
  }, [task?.kanban_column_id, supabase]);

  useEffect(() => {
    if (task?.id) {
      const taskPrLink = task?.pr_link || "";
      setPrLink(taskPrLink);
      setOriginalPrLink(taskPrLink);
      setPrimaryAssignee(null); // Reset to null first
      setManualSaveChanges(false);
      setPendingAssigneeId(undefined);
      setForceRefreshKey(Date.now().toString());

      // Force reset the AssigneeSelector local state by resetting primaryAssignee
      setTimeout(() => {
        // Fetch actual assignee from task after reset
        if (task.codev_id || task?.codev?.id) {
          const assigneeId = task.codev_id || task.codev?.id || "";
          if (supabase && assigneeId) {
            supabase
              .from("codev")
              .select("id, first_name, last_name, image_url")
              .eq("id", assigneeId)
              .single()
              .then(({ data, error }) => {
                if (!error && data) {
                  setPrimaryAssignee(data as CodevMember);
                }
              });
          }
        }
      }, 0);
    }
  }, [task?.id, supabase]);

  useEffect(() => {
    if (!supabase || !task?.skill_category_id) return;

    const fetchSkillCategory = async () => {
      const { data, error } = await supabase
        .from("skill_category")
        .select("id, name")
        .eq("id", task.skill_category_id)
        .single();
      if (!error && data) {
        setSkillCategory(data as SkillCategory);
      }
    };
    fetchSkillCategory();
  }, [task?.skill_category_id, supabase]);

  useEffect(() => {
    if (!supabase || !task?.sidekick_ids?.length) return;

    const fetchSidekickDetails = async () => {
      const { data, error } = await supabase
        .from("codev")
        .select("id, first_name, last_name, image_url")
        .in("id", task.sidekick_ids);
      if (!error && data) {
        setSidekickDetails(data as CodevMember[]);
      }
    };
    fetchSidekickDetails();
  }, [task?.sidekick_ids, supabase]);

  useEffect(() => {
    if (!supabase || !task) return;

    const fetchPrimaryAssignee = async () => {
      const assigneeId = task?.codev_id || task?.codev?.id;

      setPrimaryAssignee(null);

      if (assigneeId) {
        const { data, error } = await supabase
          .from("codev")
          .select("id, first_name, last_name, image_url")
          .eq("id", assigneeId)
          .single();

        if (!error && data) {
          setPrimaryAssignee(data as CodevMember);
        }
      } else if (task?.codev) {
        setPrimaryAssignee({
          id: task.codev.id,
          first_name: task.codev.first_name,
          last_name: task.codev.last_name,
          image_url: task.codev.image_url,
        });
      }
    };

    fetchPrimaryAssignee();
  }, [task, supabase]);

  useEffect(() => {
    if (!supabase || !task?.created_by) return;

    const fetchCreatedBy = async () => {
      const { data, error } = await supabase
        .from("codev")
        .select("id, first_name, last_name, image_url")
        .eq("id", task.created_by)
        .single();

      if (!error && data) {
        setCreatedBy(data as CodevMember);
      }
    };
    fetchCreatedBy();
  }, [task?.created_by, supabase]);

  const handleUpdate = async () => {
    if (!task) return;

    if (!prLink.trim()) {
      toast.error("PR Link cannot be empty");
      return;
    }

    setUpdateLoading(true);

    const response = await updateTaskPRLink(task.id, prLink);

    if (response.success) {
      toast.success("PR Link updated successfully");
      setOriginalPrLink(prLink);
      if (task) task.pr_link = prLink;
    } else {
      toast.error(response.error || "Failed to update PR Link");
    }

    setUpdateLoading(false);
  };

  // Optimistic UI approach for task completion
  const handleMarkAsDone = async () => {
    if (!task) return;

    setIsLoading(true);

    // Optimistically remove the task from UI immediately
    removeTaskOptimistic(task.id);

    // Close modal immediately for better UX
    onClose();

    // Show optimistic success message
    toast.success("Completing task...");

    try {
      const result = await completeTask(task);

      if (result.success) {
        // Update success message
        toast.success("Task completed and points awarded!");

        // Call onComplete callback if provided
        if (onComplete) {
          onComplete(task.id);
        }

        // Optional: Fetch fresh data in background after a delay
        // This ensures data consistency without blocking the UI
        setTimeout(() => {
          fetchBoardData();
        }, 1000);
      } else {
        // Revert optimistic update by refetching data
        toast.error(result.error || "Failed to complete task");
        await fetchBoardData();
      }
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to complete task");
      // Revert optimistic update by refetching data
      await fetchBoardData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssigneeChange = async (memberIds: string[]) => {
    if (!task || !supabase) return;

    const newAssigneeId = memberIds.length > 0 ? memberIds[0] : undefined;

    // Set manual save state to show Save Changes button
    setManualSaveChanges(true);
    setPendingAssigneeId(newAssigneeId);

    if (newAssigneeId) {
      // Fetch assignee data for UI display only
      const { data: assigneeData } = await supabase
        .from("codev")
        .select("id, first_name, last_name, image_url")
        .eq("id", newAssigneeId)
        .single();

      if (assigneeData) {
        setPrimaryAssignee(assigneeData);
      }
    } else {
      // Handle removal case
      setPrimaryAssignee(null);
    }

    setForceRefreshKey(`${Date.now()}-${Math.random()}`);
  };

  // Reset state when modal closes without saving
  const handleClose = () => {
    if (hasUnsavedChanges) {
      // Reset all unsaved changes
      setManualSaveChanges(false);
      setPendingAssigneeId(undefined);
      setPrLink(originalPrLink);

      // Force complete reset by setting primary assignee to null first
      setPrimaryAssignee(null);

      // Then set a unique force refresh key to reset AssigneeSelector
      setForceRefreshKey(`close-reset-${Date.now()}-${Math.random()}`);

      // Reset to original task assignee after a brief delay
      setTimeout(() => {
        if (task?.codev_id || task?.codev?.id) {
          const assigneeId = task.codev_id || task.codev?.id || "";
          if (supabase && assigneeId) {
            supabase
              .from("codev")
              .select("id, first_name, last_name, image_url")
              .eq("id", assigneeId)
              .single()
              .then(({ data, error }) => {
                if (!error && data) {
                  setPrimaryAssignee(data as CodevMember);
                }
              });
          }
        } else {
          // Ensure it stays null for unassigned tasks
          setPrimaryAssignee(null);
        }
      }, 50);
    }
    onClose();
  };

  // Enhanced handleSaveChanges with assignee removal support
  const handleSaveChanges = async () => {
    if (!task || !supabase) return;

    setIsSavingChanges(true);

    try {
      // Save PR Link changes
      if (hasPrLinkChanges) {
        await handleUpdate();
      }

      // Save assignee changes (including removal)
      if (manualSaveChanges) {
        const { error } = await supabase
          .from("tasks")
          .update({ codev_id: pendingAssigneeId || null }) // Convert undefined to null for database
          .eq("id", task.id);

        if (!error) {
          // Update task object after successful save
          if (task) {
            task.codev_id = pendingAssigneeId;
            if (pendingAssigneeId && primaryAssignee) {
              task.codev = primaryAssignee as any;
            } else {
              task.codev = undefined;
            }
          }

          if (pendingAssigneeId && primaryAssignee) {
            toast.success(
              `Task assigned to ${primaryAssignee.first_name} ${primaryAssignee.last_name}`,
            );
          } else {
            toast.success("Task assignee removed");
          }
        } else {
          toast.error("Failed to update assignee");
          throw new Error("Assignee update failed");
        }
      }

      await fetchBoardData();
      setManualSaveChanges(false);
      setPendingAssigneeId(undefined);
      setOriginalPrLink(prLink);
      toast.success("All changes saved successfully");
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSavingChanges(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="h-auto max-h-[90vh] sm:max-h-[900px] w-[95vw] sm:w-[90vw] max-w-3xl overflow-y-auto bg-white p-3 sm:p-4 dark:bg-gray-900">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {task?.title}
              </DialogTitle>
            </DialogHeader>
            {canModifyTask && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Ellipsis className="h-5 w-5 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem
                    onClick={() => onOpen("taskEditModal", task)}
                  >
                    Edit
                  </DropdownMenuItem>
                  {user?.role_id !== 4 && (
                    <DropdownMenuItem
                      onClick={() => onOpen("taskDeleteModal", task)}
                      className="text-red-500 focus:text-red-500"
                    >
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Task Title</Label>
              <Input
                value={task?.title || ""}
                disabled
                className="text-grey-100 bg-light-900 border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Points</Label>
              <Input
                type="number"
                value={task?.points || 0}
                disabled
                className="text-grey-100 bg-light-900 border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <Select disabled value={task?.priority || ""}>
                <SelectTrigger className="text-grey-100 bg-light-900 border border-gray-300 dark:border-gray-700 dark:bg-gray-800">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_LEVELS.map((level) => (
                    <SelectItem
                      key={level}
                      value={level}
                      className="capitalize"
                    >
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Difficulty</Label>
                <DifficultyPointsTooltip />
              </div>
              <Select disabled value={task?.difficulty || ""}>
                <SelectTrigger className="text-grey-100 bg-light-900 border border-gray-300 dark:border-gray-700 dark:bg-gray-800">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem
                      key={level}
                      value={level}
                      className="capitalize"
                    >
                      {capitalize(level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Task Type</Label>
              <Input
                value={task?.type || "None"}
                disabled
                className="text-grey-100 bg-light-900 border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">PR Link</Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={prLink}
                  onChange={(e) => setPrLink(e.target.value)}
                  onBlur={() => {
                    if (!prLink.trim() && task?.pr_link) {
                      setPrLink(task.pr_link);
                    }
                  }}
                  className="text-grey-100 bg-light-900 dark:bg-dark-200 dark:text-light-900 border border-gray-300 focus:border-blue-500"
                  placeholder="Enter PR Link..."
                />
                {hasPrLinkChanges && (
                  <Button
                    variant="outline"
                    onClick={handleUpdate}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    disabled={updateLoading}
                  >
                    {updateLoading && (
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Skill Category</Label>
              {skillCategory ? (
                <div className="rounded-md bg-blue-50 p-2 text-sm font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  {skillCategory.name}
                </div>
              ) : (
                <div className="text-sm text-gray-500">None assigned</div>
              )}
            </div>

            {/* deadline */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Deadline</Label>
              <div className="rounded-md bg-blue-50 p-2 text-sm font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                {task?.deadline ? new Date(task.deadline).toLocaleString() : "Not Set"}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Primary Assignee</Label>
              {canModifyTask && !primaryAssignee ? (
                // Only show AssigneeSelector for UNASSIGNED tasks
                <div className="space-y-2">
                  {boardId ? (
                    <AssigneeSelector
                      key={`assignee-selector-${forceRefreshKey}`}
                      primaryAssignee={primaryAssignee}
                      onAssigneeChange={handleAssigneeChange}
                      boardId={boardId}
                      user={user}
                      forceRefreshKey={forceRefreshKey}
                    />
                  ) : (
                    <div className="text-sm text-gray-500">
                      Loading board...
                    </div>
                  )}
                </div>
              ) : primaryAssignee ? (
                // Read-only display for ASSIGNED tasks
                <div className="flex items-center gap-2">
                  {primaryAssignee.image_url ? (
                    <Image
                      src={primaryAssignee.image_url}
                      alt={`${primaryAssignee.first_name} ${primaryAssignee.last_name}`}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <DefaultAvatar size={32} />
                  )}
                  <span>
                    {`${primaryAssignee.first_name} ${primaryAssignee.last_name}`}
                  </span>
                </div>
              ) : (
                // Read-only display for users without modify permissions
                <div className="flex items-center gap-2 text-gray-500">
                  <DefaultAvatar size={32} />
                  <span>Unassigned</span>
                </div>
              )}
            </div>
          </div>

          {task?.sidekick_ids && task.sidekick_ids.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Team Members</Label>
              <div className="flex -space-x-2">
                {sidekickDetails.length > 0
                  ? sidekickDetails.map((member) => (
                      <div
                        key={member.id}
                        className="relative h-8 w-8 rounded-full border-2 border-white dark:border-gray-800"
                      >
                        {member.image_url ? (
                          <Image
                            src={member.image_url}
                            alt={`${member.first_name} ${member.last_name}`}
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <DefaultAvatar size={32} />
                        )}
                      </div>
                    ))
                  : task.sidekick_ids.map((memberId) => (
                      <div
                        key={memberId}
                        className="relative h-8 w-8 rounded-full border-2 border-white dark:border-gray-800"
                      >
                        <DefaultAvatar size={32} />
                      </div>
                    ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            <div
              className="text-black-100 overflow-wrap tiptap-description resize-none whitespace-pre-wrap break-words dark:text-white"
              dangerouslySetInnerHTML={{
                __html: task?.description || "No description provided",
              }}
            />
          </div>

          {/* created by - created at */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Created By</Label>
              <div className="flex items-center gap-2">
                {createdBy?.image_url ? (
                  <Image
                    src={createdBy.image_url}
                    alt={`${createdBy.first_name} ${createdBy.last_name}`}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <DefaultAvatar size={32} />
                )}
                <span>
                  {createdBy
                    ? `${createdBy.first_name} ${createdBy.last_name}`
                    : "Unknown"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Created At</Label>
              <div className="rounded-md bg-light-900 px-3 py-2 text-sm text-gray-700  dark:bg-gray-800 dark:text-gray-200">
              {task?.created_at
                ? new Date(task.created_at).toLocaleString()
                : "Unknown"}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end">
            {/*Previous style: flex gap-6 sm:justify-end */}
            {/* VIEWING MODE: Show Close when just viewing (no changes) */}
            {!hasUnsavedChanges && (
              <Button
                onClick={onClose}
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
              >
                Close
              </Button>
            )}

            {/* EDITING MODE: Show Cancel + Save Changes when has changes */}
            {hasUnsavedChanges && (
              <>
                <Button
                  onClick={handleClose}
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
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleSaveChanges}
                  disabled={isSavingChanges}
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
                >
                  {isSavingChanges && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </>
            )}

            {/* Mark as Done button - separate logic */}
            {canMarkAsDone && task?.pr_link && (
              <Button
                onClick={handleMarkAsDone}
                disabled={isLoading}
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
              >
                {isLoading && (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                )}
                Mark as Done
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskViewModal;
