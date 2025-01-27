"use client";

import { FormEvent, useState } from "react";
import { createNewColumn } from "@/app/home/kanban/[id]/actions";
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

const ColumnAddModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "columnAddModal";

  const [columnName, setColumnName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!columnName) {
      toast.error("Please enter a column name.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await createNewColumn(columnName, data);
      if (response.success) {
        toast.success("New column created successfully!");
      } else {
        console.error(response.error);
        toast.error("Failed to create column.");
      }
    } catch (error) {
      console.error("Error creating column:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
      onClose();
      setColumnName("");
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent aria-describedby={undefined} className="w-[90%] max-w-3xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader className="relative">
            <DialogTitle className="mb-2 text-left text-lg">
              Add Column
            </DialogTitle>
          </DialogHeader>
          <Input
            id="name"
            type="text"
            label="Column Name"
            name="name"
            placeholder="Enter Column Name"
            className="dark:bg-dark-200"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
          />
          <DialogFooter className="flex flex-col gap-2 lg:flex-row">
            <Button
              type="button"
              variant="hollow"
              className="order-2 w-full sm:order-1 sm:w-[130px]"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="order-1 w-full sm:order-2 sm:w-[130px]"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnAddModal;
