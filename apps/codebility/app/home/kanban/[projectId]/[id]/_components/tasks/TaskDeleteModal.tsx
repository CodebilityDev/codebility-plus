"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import { Task } from "@/types/home/codev";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";

import { deleteTask } from "../../actions";

const TaskDeleteModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "taskDeleteModal";
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const task = data as Task;

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
        router.refresh();
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
