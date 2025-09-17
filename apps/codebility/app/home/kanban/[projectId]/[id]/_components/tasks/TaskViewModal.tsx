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
import { IconPlus } from "@/public/assets/svgs";

import { completeTask, updateTaskPRLink } from "../../actions";
import DifficultyPointsTooltip, {
  DIFFICULTY_LEVELS,
} from "../DifficultyPointsTooltip";

// ============================================================================
// WORKING fetchAvailableMembers implementation with debug logging
// ============================================================================
const fetchAvailableMembers = async (boardId: string): Promise<CodevMember[]> => {
  try {
    const supabase = createClientClientComponent();
    
    if (!supabase) {
      console.error("=== Supabase client not initialized ===");
      return [];
    }

    console.log("=== STARTING fetchAvailableMembers for boardId:", boardId, "===");

    // 1. Get the project_id from the kanban_boards table
    const { data: board, error: boardError } = await supabase
      .from("kanban_boards")
      .select("project_id")
      .eq("id", boardId)
      .single();

    if (boardError) {
      console.error("=== Board fetch error:", boardError, "===");
      return [];
    }

    if (!board?.project_id) {
      console.error("=== No project associated with board:", boardId, "===");
      return [];
    }

    console.log("=== Found project_id:", board.project_id, "===");

    // 2. Get all project members from project_members table
    const { data: projectMembers, error: projectMembersError } = await supabase
      .from("project_members")
      .select("codev_id, role")
      .eq("project_id", board.project_id);

    if (projectMembersError) {
      console.error("=== Project members fetch error:", projectMembersError, "===");
      return [];
    }

    if (!projectMembers?.length) {
      console.error("=== No project members found for project:", board.project_id, "===");
      return [];
    }

    console.log("=== Found project members:", projectMembers, "===");

    // 3. Collect ALL member IDs (including team leader)
    const allMemberIds = projectMembers.map(member => member.codev_id);
    console.log("=== All member IDs:", allMemberIds, "===");

    // 4. Fetch ALL members' details from the codev table 
    const { data: codevMembers, error: codevError } = await supabase
      .from("codev")
      .select("id, first_name, last_name, image_url, availability_status")
      .in("id", allMemberIds);

    if (codevError) {
      console.error("=== Codev members fetch error:", codevError, "===");
      return [];
    }

    if (!codevMembers?.length) {
      console.error("=== No codev details found for member IDs:", allMemberIds, "===");
      return [];
    }

    console.log("=== Found codev members:", codevMembers, "===");

    // 5. Filter available members and format for return
    const availableMembers = codevMembers
      .filter(member => member.availability_status === true)
      .map(member => ({
        id: member.id,
        first_name: member.first_name,
        last_name: member.last_name,
        image_url: member.image_url,
      }));

    console.log("=== Final available members:", availableMembers, "===");
    return availableMembers;

  } catch (error) {
    console.error("=== CRITICAL ERROR in fetchAvailableMembers:", error, "===");
    return [];
  }
};

// ============================================================================
// CONSTANTS - Following DRY principle
// ============================================================================
const PRIORITY_LEVELS = ["critical", "high", "medium", "low"];

const BUTTON_STYLES = {
  primary: "text-md bg-customBlue-100 hover:bg-customBlue-200 focus-visible:ring-customBlue-100 flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md px-6 py-1 text-white ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto lg:text-lg",
  secondary: "text-grey-100 bg-light-900 dark:bg-black-200 mt-4 w-full border-2 border-gray-300 py-4 text-black hover:bg-green-700 sm:w-auto"
};

// ============================================================================
// INTERFACES - Following SOLID principle
// ============================================================================
interface CodevMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// ============================================================================
// AGGRESSIVE ASSIGNEE SELECTOR - IMMEDIATE UI UPDATES
// ============================================================================
function AssigneeSelector({
  primaryAssignee,
  onAssigneeChange,
  boardId,
  user,
  forceRefreshKey // Add this to force complete re-render when needed
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
  const [localAssignee, setLocalAssignee] = useState<CodevMember | null>(primaryAssignee);

  // Sync with prop changes but prioritize local state for immediate feedback
  useEffect(() => {
    setLocalAssignee(primaryAssignee);
  }, [primaryAssignee, forceRefreshKey]);

  // Load members when boardId changes
  useEffect(() => {
    if (!boardId) {
      setAvailableMembers([]);
      setIsLoading(false);
      return;
    }
    
    const loadMembers = async () => {
      setIsLoading(true);
      try {
        console.log("=== LOADING MEMBERS FOR BOARD:", boardId, "===");
        const members = await fetchAvailableMembers(boardId);
        console.log("=== FETCHED MEMBERS:", members, "===");
        
        if (Array.isArray(members) && members.length > 0) {
          setAvailableMembers(members);
          console.log("=== SET AVAILABLE MEMBERS:", members.length, "===");
        } else {
          console.warn("=== NO MEMBERS FOUND OR INVALID RESPONSE ===");
          setAvailableMembers([]);
        }
      } catch (error) {
        console.error("=== ERROR LOADING MEMBERS:", error, "===");
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

  // IMMEDIATE REMOVAL - Updates UI instantly with FORCED state reset
  const handleRemove = () => {
    console.log("=== REMOVING ASSIGNEE IMMEDIATELY ===");
    // TRIPLE state reset to ensure avatar disappears
    setLocalAssignee(null); 
    onAssigneeChange([]); 
    // Force immediate re-render by updating key
    setTimeout(() => setLocalAssignee(null), 0);
  };

  // IMMEDIATE SELECTION - Updates UI instantly
  const handleSelect = (memberId: string) => {
    const selectedMember = availableMembers.find(m => m.id === memberId);
    console.log("=== SELECTING MEMBER IMMEDIATELY:", selectedMember, "===");
    
    if (selectedMember) {
      setLocalAssignee(selectedMember); // IMMEDIATE UI UPDATE
      onAssigneeChange([memberId]); // Trigger parent update
    }
  };

  const handleSelfAssign = () => {
    if (user?.id) {
      const userAsMember = {
        id: user.id,
        first_name: user.first_name || "You",
        last_name: user.last_name || "",
        image_url: user.image_url
      };
      console.log("=== SELF ASSIGNING IMMEDIATELY:", userAsMember, "===");
      setLocalAssignee(userAsMember); // IMMEDIATE UI UPDATE
      onAssigneeChange([user.id]); // Trigger parent update
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap gap-2">
        {/* Show current assignee with IMMEDIATE state */}
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

        {/* Add member dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="h-10 w-10 rounded-full p-0"
              disabled={isLoading}
            >
              <IconPlus className="h-4 w-4" />
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
                className="dark:bg-dark-200 focus:ring-customViolet-500 w-full rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2"
              />
            </div>

            <DropdownMenuSeparator />

            {isLoading ? (
              <div className="py-4 text-center text-sm text-gray-500">
                Loading members...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">
                {availableMembers.length === 0 ? "No members available" : "No members found"}
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

        {/* Self assign button */}
        {user && (!localAssignee || localAssignee.id !== user.id) && (
          <button
            onClick={handleSelfAssign}
            disabled={isLoading}
            type="button"
            className="text-black-200 hover:text-customBlue-300 dark:hover:text-customBlue-100 ml-2 w-fit cursor-pointer text-xs font-light dark:text-slate-300"
          >
            Assign to me
          </button>
        )}
      </div>

    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const TaskViewModal = ({
  onComplete,
}: {
  onComplete?: (taskId: string) => void;
}) => {
  // ============================================================================
  // HOOKS AND STATE
  // ============================================================================
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const user = useUserStore((state) => state.user);
  const { fetchBoardData } = useKanbanStore();
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Component state
  const [prLink, setPrLink] = useState("");
  const [supabase, setSupabase] = useState<any>(null);
  const [boardId, setBoardId] = useState<string>("");
  
  // Data states
  const [skillCategory, setSkillCategory] = useState<SkillCategory | null>(null);
  const [sidekickDetails, setSidekickDetails] = useState<CodevMember[]>([]);
  const [primaryAssignee, setPrimaryAssignee] = useState<CodevMember | null>(null);
  const [createdBy, setCreatedBy] = useState<CodevMember | null>(null);
  const [forceRefreshKey, setForceRefreshKey] = useState<string>("");
  
  // Derived state
  const isModalOpen = isOpen && type === "taskViewModal";
  const task = data as Task | null;
  
  // Permission checks
  const canModifyTask = user?.role_id === 1 || user?.role_id === 5 || user?.role_id === 4 || user?.role_id === 10;
  const canMarkAsDone = user?.role_id === 1 || user?.role_id === 5;

  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  // Initialize Supabase client
  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  // Fetch board ID from task's column
  useEffect(() => {
    if (!supabase || !task?.kanban_column_id) {
      setBoardId("");
      return;
    }
    
    const fetchBoardId = async () => {
      try {
        console.log("=== FETCHING BOARD ID FOR COLUMN:", task.kanban_column_id, "===");
        const { data, error } = await supabase
          .from("kanban_columns")
          .select("board_id")
          .eq("id", task.kanban_column_id)
          .single();
        
        if (error) {
          console.error("=== ERROR FETCHING BOARD ID:", error, "===");
          setBoardId("");
        } else if (data?.board_id) {
          console.log("=== FOUND BOARD ID:", data.board_id, "===");
          setBoardId(data.board_id);
        }
      } catch (err) {
        console.error("=== EXCEPTION FETCHING BOARD ID:", err, "===");
        setBoardId("");
      }
    };
    
    fetchBoardId();
  }, [task?.kanban_column_id, supabase]);

  // Reset states when task changes - AGGRESSIVE RESET
  useEffect(() => {
    if (task?.id) {
      console.log("=== TASK CHANGED, RESETTING STATES ===");
      setPrLink(task?.pr_link || "");
      setPrimaryAssignee(null);
      setForceRefreshKey(Date.now().toString()); // Force component refresh
    }
  }, [task?.id]);

  // Fetch skill category
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

  // Fetch sidekick details
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

  // Fetch primary assignee - AGGRESSIVE FETCHING
  useEffect(() => {
    if (!supabase || !task) return;

    const fetchPrimaryAssignee = async () => {
      const assigneeId = task?.codev_id || task?.codev?.id;
      
      console.log("=== FETCHING PRIMARY ASSIGNEE, ID:", assigneeId, "===");
      
      // Always reset first
      setPrimaryAssignee(null);

      if (assigneeId) {
        const { data, error } = await supabase
          .from("codev")
          .select("id, first_name, last_name, image_url")
          .eq("id", assigneeId)
          .single();

        if (!error && data) {
          console.log("=== FOUND ASSIGNEE DATA:", data, "===");
          setPrimaryAssignee(data as CodevMember);
        } else {
          console.log("=== NO ASSIGNEE FOUND, ERROR:", error, "===");
        }
      } else if (task?.codev) {
        console.log("=== USING TASK.CODEV DIRECTLY:", task.codev, "===");
        setPrimaryAssignee({
          id: task.codev.id,
          first_name: task.codev.first_name,
          last_name: task.codev.last_name,
          image_url: task.codev.image_url,
        });
      } else {
        console.log("=== NO ASSIGNEE DATA AVAILABLE ===");
      }
    };

    fetchPrimaryAssignee();
  }, [task, supabase]);

  // Fetch created by
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

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
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
      setPrLink(prLink);
      if (task) task.pr_link = prLink;
    } else {
      toast.error(response.error || "Failed to update PR Link");
    }

    setUpdateLoading(false);
  };

  const handleMarkAsDone = async () => {
    if (!task) return;

    setIsLoading(true);

    try {
      const result = await completeTask(task);

      if (result.success) {
        toast.success("Task completed and points awarded!");

        if (onComplete) {
          onComplete(task.id);
        }

        onClose();
        await fetchBoardData();
      } else {
        toast.error(result.error || "Failed to complete task");
      }
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to complete task");
    }

    setIsLoading(false);
  };

  // ============================================================================
  // ULTRA-AGGRESSIVE ASSIGNEE CHANGE HANDLER with immediate UI updates
  // ============================================================================
  const handleAssigneeChange = async (memberIds: string[]) => {
    if (!task || !supabase) return;

    const newAssigneeId = memberIds[0] || undefined;
    console.log("=== ASSIGNMENT CHANGE:", { newAssigneeId, memberIds }, "===");

    // IMMEDIATE UI UPDATES FIRST - for instant feedback
    if (newAssigneeId) {
      // Find member in available members and set immediately
      const selectedMember = primaryAssignee; // Use current state temporarily
      console.log("=== SETTING ASSIGNEE IMMEDIATELY ===");
    } else {
      console.log("=== CLEARING ASSIGNEE IMMEDIATELY ===");
      setPrimaryAssignee(null);
    }

    try {
      // Update database
      const { error } = await supabase
        .from("tasks")
        .update({ codev_id: newAssigneeId || null })
        .eq("id", task.id);

      if (!error) {
        if (newAssigneeId) {
          // Fetch new assignee data and update state
          const { data: assigneeData } = await supabase
            .from("codev")
            .select("id, first_name, last_name, image_url")
            .eq("id", newAssigneeId)
            .single();
          
          if (assigneeData) {
            console.log("=== UPDATING TASK OBJECT WITH NEW ASSIGNEE:", assigneeData, "===");
            setPrimaryAssignee(assigneeData);
            if (task) {
              task.codev_id = newAssigneeId;
              task.codev = assigneeData as any;
            }
            toast.success(`Task assigned to ${assigneeData.first_name} ${assigneeData.last_name}`);
          }
        } else {
          console.log("=== REMOVING ASSIGNEE FROM TASK - FINAL ===");
          setPrimaryAssignee(null);
          if (task) {
            task.codev_id = undefined;
            task.codev = undefined;
          }
          toast.success("Task unassigned successfully");
        }

        // Force refresh key to trigger component re-render
        setForceRefreshKey(`${Date.now()}-${Math.random()}`);
        
        // Refresh board data
        await fetchBoardData();
      } else {
        console.error("=== DATABASE ERROR:", error, "===");
        toast.error("Failed to update assignee");
        
        // Revert UI changes on database error
        if (task?.codev_id) {
          const { data: revertData } = await supabase
            .from("codev")
            .select("id, first_name, last_name, image_url")
            .eq("id", task.codev_id)
            .single();
          if (revertData) setPrimaryAssignee(revertData);
        } else {
          setPrimaryAssignee(null);
        }
      }
    } catch (error) {
      console.error("=== ERROR UPDATING ASSIGNEE:", error, "===");
      toast.error("Failed to update assignee");
    }
  };

  // Early return
  if (!isModalOpen) return null;

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="h-[95vh] max-h-[900px] w-[95vw] max-w-3xl overflow-y-auto bg-white p-4 dark:bg-gray-900">
        <div className="flex flex-col gap-6">
          {/* Header */}
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

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Task Title */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Task Title</Label>
              <Input
                value={task?.title || ""}
                disabled
                className="text-grey-100 bg-light-900 border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* Points */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Points</Label>
              <Input
                type="number"
                value={task?.points || 0}
                disabled
                className="text-grey-100 bg-light-900 border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <Select disabled value={task?.priority || ""}>
                <SelectTrigger className="text-grey-100 bg-light-900 border border-gray-300 dark:border-gray-700 dark:bg-gray-800">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level} className="capitalize">
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
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
                    <SelectItem key={level} value={level} className="capitalize">
                      {capitalize(level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Task Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Task Type</Label>
              <Input
                value={task?.type || "None"}
                disabled
                className="text-grey-100 bg-light-900 border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* PR Link */}
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
                  className="text-grey-100 bg-light-900 dark:bg-dark-200 dark:text-light-900 focus:border-customBlue-500 border border-gray-300"
                  placeholder="Enter PR Link..."
                />
                <Button
                  variant="outline"
                  onClick={handleUpdate}
                  className={
                    prLink.trim() !== (task?.pr_link || "")
                      ? BUTTON_STYLES.primary
                      : BUTTON_STYLES.secondary
                  }
                  disabled={
                    updateLoading || prLink.trim() === (task?.pr_link || "")
                  }
                >
                  {updateLoading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update
                </Button>
              </div>
            </div>

            {/* Skill Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Skill Category</Label>
              {skillCategory ? (
                <div className="bg-customBlue-50 text-customBlue-700 dark:bg-customBlue-900/20 dark:text-customBlue-300 rounded-md p-2 text-sm font-medium">
                  {skillCategory.name}
                </div>
              ) : (
                <div className="text-sm text-gray-500">None assigned</div>
              )}
            </div>

            {/* ================================================================ */}
            {/* WORKING PRIMARY ASSIGNEE SELECTOR */}
            {/* ================================================================ */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Primary Assignee</Label>
              {canModifyTask ? (
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
                    <div className="text-sm text-gray-500">Loading board...</div>
                  )}
                </div>
              ) : primaryAssignee ? (
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
                <div className="flex items-center gap-2 text-gray-500">
                  <DefaultAvatar size={32} />
                  <span>Unassigned</span>
                </div>
              )}
            </div>
          </div>

          {/* Team Members (Sidekicks) */}
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

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            <div
              className="text-black-100 overflow-wrap tiptap-description resize-none whitespace-pre-wrap break-words dark:text-white"
              dangerouslySetInnerHTML={{
                __html: task?.description || "No description provided",
              }}
            />
          </div>

          {/* Created By */}
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

          {/* Footer Actions */}
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className={BUTTON_STYLES.primary}
            >
              Close
            </Button>
            {canMarkAsDone && task?.pr_link && (
              <Button
                variant="default"
                onClick={handleMarkAsDone}
                disabled={isLoading}
                className={BUTTON_STYLES.primary}
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