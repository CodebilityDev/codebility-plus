"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DefaultAvatar from "@/Components/DefaultAvatar";
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
import { SkillCategory, Task } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";
import { set } from "date-fns";
import { Ellipsis, Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";

import { completeTask, updateTaskPRLink } from "../../actions";

interface CodevMember {
  id: string;
  first_name: string;
  last_name: string;
  image_url?: string | null;
}

const PRIORITY_LEVELS = ["critical", "high", "medium", "low"];
const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];

// Utility function to capitalize the first letter
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const TaskViewModal = ({
  onComplete,
}: {
  onComplete?: (taskId: string) => void;
}) => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const isModalOpen = isOpen && type === "taskViewModal";
  const task = data as Task;
  const router = useRouter();

  const user = useUserStore((state) => state.user);
  const canModifyTask = user?.role_id === 1 || user?.role_id === 5;
  const [prLink, setPrLink] = useState(task?.pr_link || "");

  //  handle PR link update

  const handleUpdate = async () => {
    if (!prLink.trim()) {
      toast.error("PR Link cannot be empty");
      return;
    }

    setUpdateLoading(true);

    const response = await updateTaskPRLink(task.id, prLink);

    if (response.success) {
      toast.success("PR Link updated successfully");

      // ✅ Manually update state so UI updates immediately
      setPrLink(prLink);
      task.pr_link = prLink;

      // ✅ Delay refresh to ensure the update syncs
      /* setTimeout(() => {
        router.refresh();
      }, 500); */
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

        // ✅ Manually update local state (UI update)
        if (onComplete) {
          onComplete(task.id);
        }

        // ✅ Close modal before refreshing
        onClose();

        //remove refreshing the page, should be handled in action and on should revalidate
        /*  window.location.href = window.location.pathname + "?t=" + Date.now(); */
      } else {
        toast.error(result.error || "Failed to complete task");
      }
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to complete task");
    }

    setIsLoading(false);
  };

  // State for Skill Category, Sidekick Details, and Primary Assignee

  const [skillCategory, setSkillCategory] = useState<SkillCategory | null>(
    null,
  );
  const [sidekickDetails, setSidekickDetails] = useState<CodevMember[]>([]);
  const [primaryAssignee, setPrimaryAssignee] = useState<CodevMember | null>(
    null,
  );
  const [supabase, setSupabase] = useState<any>(null);
  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);
  // Set the skill category from the task
  useEffect(() => {
    if (!supabase) return;

    if (task?.skill_category_id) {
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
    }
  }, [task?.skill_category_id, supabase]);

  // Fetch sidekick details to display their images
  useEffect(() => {
    if (!supabase) return;

    const fetchSidekickDetails = async () => {
      if (task?.sidekick_ids && task.sidekick_ids.length > 0) {
       

        const { data, error } = await supabase
          .from("codev")
          .select("id, first_name, last_name, image_url")
          .in("id", task.sidekick_ids);
        if (!error && data) {
          setSidekickDetails(data as CodevMember[]);
        }
      }
    };
    fetchSidekickDetails();
  }, [task?.sidekick_ids, supabase]);

  useEffect(() => {
    if (!supabase) return;
    const fetchPrimaryAssignee = async () => {
      const assigneeId = task?.codev_id || task?.codev?.id;

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
        // If we have the codev object directly, use that
        setPrimaryAssignee({
          id: task.codev.id,
          first_name: task.codev.first_name,
          last_name: task.codev.last_name,
          image_url: task.codev.image_url,
        });
      }
    };

    if (task) {
      fetchPrimaryAssignee();
    }
  }, [task, supabase]);

  // Return previous PR link when leaving the input field empty
  useEffect(() => {
    setPrLink(task?.pr_link || ""); // Reset PR link when task changes
  }, [task?.id]); // Runs when a new task is selected

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="phone:h-full phone:w-full tablet:h-full tablet:w-full laptop:h-[90vh] laptop:max-h-[800px] h-[95vh] max-h-[900px] w-[95vw] max-w-3xl overflow-y-auto bg-white p-4 dark:bg-gray-900">
        <div className="flex flex-col gap-6">
          {/* Header with Title and Dropdown Menu */}
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
                  <DropdownMenuItem
                    onClick={() => onOpen("taskDeleteModal", task)}
                    className="text-red-500 focus:text-red-500"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Task Title */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Task Title</Label>
              <Input
                value={task?.title}
                disabled
                className="text-grey-100 bg-light-900 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 "
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
              <Select disabled>
                <SelectTrigger className="text-grey-100 bg-light-900 border border-gray-300 border-gray-300  dark:border-gray-700 dark:bg-gray-800">
                  <SelectValue placeholder={task?.priority || "None"} />
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

            {/* Difficulty (capitalized) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Difficulty</Label>
              <Select disabled>
                <SelectTrigger className="text-grey-100 bg-light-900 border border-gray-300 border-gray-300 dark:border-gray-700 dark:bg-gray-800">
                  <SelectValue
                    placeholder={
                      task?.difficulty ? capitalize(task.difficulty) : "None"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <SelectItem
                        key={level}
                        value={level}
                        className="capitalize"
                      >
                        {capitalize(level)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Task Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Task Type</Label>
              <Input
                value={task?.type || "None"}
                disabled
                className="text-grey-100 bg-light-900 border border-gray-300 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* PR Link */}
            <div className="space-y-2 ">
              <Label className="text-sm font-medium">PR Link</Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={prLink}
                  onChange={(e) => setPrLink(e.target.value)}
                  onBlur={() => {
                    if (!prLink.trim()) {
                      setPrLink(task.pr_link || "");
                    }
                  }}
                  className="text-grey-100 bg-light-900 dark:bg-dark-200 dark:text-light-900 border border-gray-300 focus:border-blue-500"
                  required
                  placeholder="Enter PR Link..."
                />
                <Button
                  variant="outline"
                  onClick={handleUpdate}
                  className={
                    prLink.trim() !== (task?.pr_link || "")
                      ? "text-md mt-4 flex h-10 w-max items-center justify-center gap-2 whitespace-nowrap rounded-md bg-blue-100 px-6 py-2 text-white ring-offset-background transition-colors duration-300 hover:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 lg:text-lg"
                      : "text-grey-100 bg-light-900 mt-4 w-full border-2 border-gray-300 bg-green-600 py-4 text-black hover:bg-green-700 sm:w-auto"
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
                <div className="rounded-md bg-blue-50 p-2 text-sm font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  {skillCategory.name}
                </div>
              ) : (
                <div className="text-sm text-gray-500">None assigned</div>
              )}
            </div>

            {/* Primary Assignee */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Primary Assignee</Label>
              <div className="flex items-center gap-2">
                {primaryAssignee && primaryAssignee.image_url ? (
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
                  {primaryAssignee
                    ? `${primaryAssignee.first_name} ${primaryAssignee.last_name}`
                    : "Unassigned"}
                </span>
              </div>
            </div>
          </div>

          {/* Sidekick Team Members */}
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
              className="text-black-100 overflow-wrap tiptap-description min-h-[120px] resize-none whitespace-pre-wrap break-words dark:text-white"
              dangerouslySetInnerHTML={{
                __html: task?.description || "No description provided",
              }}
            />
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-md flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-blue-100 px-6 py-1 text-white ring-offset-background transition-colors duration-300 hover:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto lg:text-lg"
            >
              Close
            </Button>
            {canModifyTask && task?.pr_link && (
              <Button
                variant="default"
                onClick={handleMarkAsDone}
                disabled={isLoading}
                className="text-md flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-blue-100 px-6 py-1 text-white ring-offset-background transition-colors duration-300 hover:bg-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto lg:text-lg"
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
