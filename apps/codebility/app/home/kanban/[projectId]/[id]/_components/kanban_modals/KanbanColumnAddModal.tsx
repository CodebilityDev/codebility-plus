"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createNewColumn } from "@/app/home/kanban/[projectId]/[id]/actions";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useModal } from "@/hooks/use-modal";
import toast from "react-hot-toast";

import { Input } from "@codevs/ui/input";

export default function KanbanColumnAddModal() {
  const { isOpen, onClose, type, data: boardId } = useModal();
  const [columnName, setColumnName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isModalOpen = isOpen && type === "ColumnAddModal";

  const validateColumnName = (name: string): boolean => {
    // Add validation rules based on your database constraints
    const trimmedName = name.trim();
    if (!trimmedName) return false;
    if (trimmedName.length < 1) return false;
    // Add more validation rules as needed
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!columnName.trim()) {
      toast.error("Please enter a column name.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await createNewColumn(columnName, boardId);
      if (response.success) {
        toast.success("Column created successfully!");
        window.location.reload();
        onClose();
        setColumnName("");
      } else {
        toast.error(response.error || "Failed to create column");
      }
    } catch (error) {
      console.error("Error creating column:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose} modal={true}>
      <DialogContent className="w-[90%] max-w-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="mb-8 text-left text-lg">
              Add Column
            </DialogTitle>
          </DialogHeader>

          <Input
            id="columnName"
            type="text"
            label="Column Name"
            placeholder="Enter Column Name"
            className="dark:bg-dark-200 mt-2"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            disabled={isLoading}
          />

          <DialogFooter className="flex flex-col gap-2 lg:flex-row">
            <Button
              type="button"
              variant="hollow"
              className="order-2 w-full sm:order-1 sm:w-[130px]"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="order-1 w-full sm:order-2 sm:w-[130px]"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
