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
import { Textarea } from "@codevs/ui/textarea";

// Constants matching your schema (if needed for display)
const PRIORITY_LEVELS = ["critical", "high", "medium", "low"];
const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];

const TaskViewModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "taskViewModal";
  const task = data as Task;

  // State to hold the fetched skill category details
  const [skillCategory, setSkillCategory] = useState<SkillCategory | null>(
    null,
  );

  useEffect(() => {
    async function fetchSkillCategory() {
      if (task?.skill_category_id) {
        const supabase = createClientComponentClient();
        const { data, error } = await supabase
          .from("skill_category")
          .select("id, name")
          .eq("id", task.skill_category_id)
          .single();
        if (!error && data) {
          setSkillCategory(data as SkillCategory);
        }
      }
    }
    fetchSkillCategory();
  }, [task?.skill_category_id]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="h-[32rem] w-[90%] max-w-3xl overflow-y-auto lg:h-[44rem]">
        <div className="flex flex-col gap-4 p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <DialogHeader>
              <DialogTitle className="break-words text-left text-lg font-bold">
                {task?.title}
              </DialogTitle>
            </DialogHeader>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Ellipsis className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => onOpen("taskEditModal", task)}
                  className="cursor-pointer"
                >
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onOpen("taskDeleteModal", task)}
                  className="cursor-pointer"
                >
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Form-like Grid Display */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Task Title" value={task?.title} disabled />

            <Input
              label="Points"
              type="number"
              value={task?.points || 0}
              disabled
            />

            <div>
              <label>Priority</label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder={task?.priority || "None"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup />
                </SelectContent>
              </Select>
            </div>

            <div>
              <label>Difficulty</label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder={task?.difficulty || "None"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup />
                </SelectContent>
              </Select>
            </div>

            <Input
              label="Pull Request Link"
              value={task?.pr_link || ""}
              disabled
            />

            {/* Skill Category Badge */}
            <div>
              <label>Skill Category</label>
              {skillCategory ? (
                <div className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                  {skillCategory.name}
                </div>
              ) : (
                <div className="text-sm text-gray-500">None</div>
              )}
            </div>
          </div>

          {/* Sidekick Avatars */}
          {task?.sidekick_ids && task.sidekick_ids.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {task.sidekick_ids.map((memberId) => (
                <div key={memberId} className="relative h-12 w-12 rounded-full">
                  {/* Here we use DefaultAvatar as a placeholder.
                      You could replace this with actual member image if available. */}
                  <DefaultAvatar size={48} />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <label>Description</label>
            <Textarea
              value={task?.description || "No description provided"}
              className="h-32 resize-none"
              disabled
            />
          </div>

          <DialogFooter>
            <Button onClick={onClose} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskViewModal;
