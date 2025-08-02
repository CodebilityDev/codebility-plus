"use client";

import DefaultAvatar from "@/components/DefaultAvatar";
import { IconDelete } from "@/public/assets/svgs";
import { Task } from "@/types/home/codev";
import { DeleteIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@codevs/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@codevs/ui/alert-dialog";

interface ArchiveTaskProps {
  task: Task;
  onDelete: (taskId: string) => void;
}

export default function ArchiveTask({ task, onDelete }: ArchiveTaskProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteConfirm = () => {
    onDelete(task.id);
    setIsDeleteDialogOpen(false);
  };
  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-white dark:bg-red-200 dark:text-black-100";
      case "high":
        return "bg-codeRed text-white dark:bg-codeRed dark:text-white";
      case "medium":
        return "bg-codeBlue text-black-100 dark:bg-codeBlue dark:text-black-100";
      case "low":
        return "bg-green-500 text-white dark:bg-green-500 dark:text-white";
      default:
        return "bg-lightgray text-black-100 dark:bg-darkgray dark:text-white";
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-blue-100 text-white dark:bg-blue-200 dark:text-white";
      case "medium":
        return "bg-customViolet-100 text-white dark:bg-customViolet-200 dark:text-black-100";
      case "hard":
        return "bg-codePurple text-white dark:bg-codePurple dark:text-white";
      default:
        return "bg-lightgray text-black-100 dark:bg-darkgray dark:text-white";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="border-lightgray dark:border-darkgray dark:bg-black-100 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Task Title */}
          <h3 className="text-black-100 text-base font-semibold dark:text-white">
            {task.title}
          </h3>

          {/* Task Meta Info */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {/* Priority */}
            {task.priority && (
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}
              >
                {task.priority}
              </span>
            )}

            {/* Difficulty */}
            {task.difficulty && (
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getDifficultyColor(task.difficulty)}`}
              >
                {task.difficulty}
              </span>
            )}

            {/* Points */}
            {task.points && (
              <span className="bg-green-500 dark:bg-green-500 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white dark:text-white">
                {task.points} pts
              </span>
            )}

            {/* Type */}
            {task.type && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-white dark:bg-blue-200 dark:text-white">
                {task.type}
              </span>
            )}
          </div>

          {/* Assignee and Skill Category */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Primary Assignee */}
              {task.codev && (
                <div className="flex items-center gap-2">
                  {task.codev.image_url ? (
                    <img
                      src={task.codev.image_url}
                      alt={`${task.codev.first_name} ${task.codev.last_name}`}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <DefaultAvatar size={24} />
                  )}
                  <span className="text-xs text-secondary dark:text-secondary">
                    {task.codev.first_name} {task.codev.last_name}
                  </span>
                </div>
              )}

              {/* Skill Category */}
              {task.skill_category && (
                <span className="bg-lightgray text-black-100 dark:bg-darkgray inline-flex items-center rounded-full px-2 py-1 text-xs font-medium dark:text-white">
                  {task.skill_category.name}
                </span>
              )}
            </div>

            {/* Completion Date */}
            <div className="text-xs text-secondary dark:text-secondary">
              Completed: {formatDate(task.updated_at)}
            </div>
          </div>
        </div>

        {/* Delete Button */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-4 flex items-center gap-1 border-red-100 text-red-100 hover:bg-red-100 hover:text-white dark:border-red-100 dark:text-red-100 dark:hover:bg-red-100 dark:hover:text-white"
            >
              <DeleteIcon className="h-3 w-3" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white dark:bg-black-100 border-lightgray dark:border-darkgray">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-black-100 dark:text-white">
                Delete Task
              </AlertDialogTitle>
              <AlertDialogDescription className="text-secondary dark:text-secondary">
                Are you sure you want to permanently delete the task "{task.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-lightgray text-black-100 hover:bg-lightgray dark:border-darkgray dark:text-white dark:hover:bg-darkgray">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-100 text-white hover:bg-red-200 dark:bg-red-100 dark:text-white dark:hover:bg-red-200 border-none"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
