"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useKanbanModal } from "@/hooks/use-modal-kanban";
import { useKanbanBoardSync } from "@/hooks/use-kanban-board-sync";
import { Task } from "@/types/home/codev";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";

import { deleteTask } from "../../actions";

const TaskDeleteModal = () => {
  const { isOpen, onClose, type, data } = useKanbanModal();
  const isModalOpen = isOpen && type === "taskDeleteModal";
  const [isLoading, setIsLoading] = React.useState(false);

  const { refreshBoard, removeTask } = useKanbanBoardSync();

  const task = data as Task | undefined;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!task?.id) {
      toast.error("Task ID is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await deleteTask(task.id);

      if (response.success) {
        toast.success("Task deleted successfully");
        removeTask(task.id);
        refreshBoard();
        onClose();
      } else {
        toast.error(response.error || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }

    setIsLoading(false);
  };

  if (!isModalOpen) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90%] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Delete Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-lg">
            Are you sure you want to delete task{" "}
            <span className="break-words font-medium text-red-500">
              {task?.title}
            </span>
            ?
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDeleteModal;
