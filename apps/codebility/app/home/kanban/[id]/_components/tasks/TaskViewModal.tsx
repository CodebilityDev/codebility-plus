"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
import { SkillCategory, Task } from "@/types/home/codev";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Ellipsis } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";

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

const TaskViewModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "taskViewModal";
  const task = data as Task;

  // State for Skill Category, Sidekick Details, and Primary Assignee
  const [skillCategory, setSkillCategory] = useState<SkillCategory | null>(
    null,
  );
  const [sidekickDetails, setSidekickDetails] = useState<CodevMember[]>([]);
  const [primaryAssignee, setPrimaryAssignee] = useState<CodevMember | null>(
    null,
  );

  // Set the skill category from the task
  useEffect(() => {
    if (task?.skill_category_id) {
      const fetchSkillCategory = async () => {
        const supabase = createClientComponentClient();
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
  }, [task?.skill_category_id]);

  // Fetch sidekick details to display their images
  useEffect(() => {
    const fetchSidekickDetails = async () => {
      if (task?.sidekick_ids && task.sidekick_ids.length > 0) {
        const supabase = createClientComponentClient();
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
  }, [task?.sidekick_ids]);

  // Fetch primary assignee details using the codev_id field
  useEffect(() => {
    const fetchPrimaryAssignee = async () => {
      if (task?.codev_id) {
        const supabase = createClientComponentClient();
        const { data, error } = await supabase
          .from("codev")
          .select("id, first_name, last_name, image_url")
          .eq("id", task.codev_id)
          .single();
        if (!error && data) {
          setPrimaryAssignee(data as CodevMember);
        }
      }
    };
    fetchPrimaryAssignee();
  }, [task?.codev_id]);

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="h-[90vh] w-[90%] max-w-3xl overflow-y-auto bg-white dark:bg-gray-900 lg:h-auto">
        <div className="flex flex-col gap-6">
          {/* Header with Title and Dropdown Menu */}
          <div className="flex items-center justify-between">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                {task?.title}
              </DialogTitle>
            </DialogHeader>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Ellipsis className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => onOpen("taskEditModal", task)}>
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
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Task Title */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Task Title</Label>
              <Input
                value={task?.title}
                disabled
                className="border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* Points */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Points</Label>
              <Input
                type="number"
                value={task?.points || 0}
                disabled
                className="border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <Select disabled>
                <SelectTrigger className="border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
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
                <SelectTrigger className="border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
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
                className="border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>

            {/* PR Link */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">PR Link</Label>
              <Input
                value={task?.pr_link || ""}
                disabled
                className="border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
              />
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
            <Textarea
              value={task?.description || "No description provided"}
              disabled
              className="min-h-[120px] resize-none border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskViewModal;
