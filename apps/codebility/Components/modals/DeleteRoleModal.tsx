"use client";

import React from "react";
import { deleteRole } from "@/app/home/settings/roles/action";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@codevs/ui/dialog";

const DeleteRoleModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "deleteRoleModal";

  const handleClose = () => {
    onClose();
  };

  const handleDelete = async () => {
    if (!data) return toast.error("Name is Empty");
    await deleteRole(data.id);
    toast.success(`role successfully deleted!`);
    onClose();
  };

  return (
    <Dialog open={isModalOpen}>
      <DialogContent className="bg-light-900 flex h-auto w-[95%] max-w-3xl flex-col justify-items-center gap-6 text-stone-900 dark:bg-stone-900 dark:text-white">
        <div className=" mt-16 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p>
              This will delete the item from the list. You cannot restore a
              deleted item.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 lg:flex-row ">
          <Button
            variant="hollow"
            className="order-2 w-full sm:order-1 sm:w-[130px]"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="order-1 w-auto sm:order-2 "
            onClick={handleDelete}
          >
            Delete permanently
          </Button>
        </DialogFooter>
        <div className="lef-0 border-black-200 absolute right-0 top-0 flex w-[100%] flex-row items-center justify-between gap-2 border-b-[1px] px-10 py-3">
          <DialogHeader className=" w-full">
            <DialogTitle className=" text-left text-lg">
              Are you sure you want to delete this item?
            </DialogTitle>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRoleModal;
