"use client";

import React from "react";
import { deleteRole } from "@/app/home/settings/roles/action";
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

const DeleteRoleModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteRoleModal";

  const handleClose = () => {
    onClose();
  };

  const handleDelete = async () => {
    if (!data?.id) {
      toast.error("No role selected");
      return;
    }

    try {
      const response = await deleteRole(Number(data.id));
      if (!response.success) {
        toast.error(response.error || "Failed to delete role");
        return;
      }

      toast.success("Role successfully deleted!");
      onClose();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error deleting role:", error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        aria-describedby={undefined}
        className="bg-light-900 flex h-auto w-[95%] max-w-3xl flex-col justify-items-center gap-6 text-stone-900 dark:text-white"
      >
        <div className="lef-0 border-black-200 absolute right-0 top-0 flex w-[100%] flex-row items-center justify-between gap-2 border-b-[1px] px-10 py-3">
          <DialogHeader className="w-full">
            <DialogTitle className="text-left text-lg">
              Are you sure you want to delete this role?
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="mt-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p>
              This will remove the role permanently. You cannot restore a
              deleted item.
            </p>
          </div>
        </div>

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
            type="button"
            variant="destructive"
            className="order-1 w-auto sm:order-2"
            onClick={handleDelete}
          >
            Delete permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRoleModal;
