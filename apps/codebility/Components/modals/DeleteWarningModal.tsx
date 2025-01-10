import React from "react";
import { useModal } from "@/hooks/use-modal";

import { Button } from "@codevs/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@codevs/ui/dialog";

export default function DeleteWarningModal() {
  const { isOpen, onClose, type, callback } = useModal();
  const isModalOpen = isOpen && type === "deleteWarningModal";
  const handleDelete = callback!;

  function handleConfirmDelete() {
    handleDelete();

    onClose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose} modal={false}>
      <DialogOverlay className="fixed inset-0 h-screen w-full bg-black bg-opacity-50 backdrop-blur-sm" />
      <DialogContent
        aria-describedby={undefined}
        className="bg-light-900 flex h-auto w-[95%] max-w-3xl flex-col justify-items-center gap-6 text-stone-900 dark:text-white"
      >
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete your photo?</DialogTitle>
        </DialogHeader>
        <div className=" mt-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p>
              This will delete the item from the list. You cannot restore a
              deleted item.
            </p>
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-2 lg:flex-row ">
          <Button
            type="button"
            variant="outline"
            className="order-2 w-full sm:order-1 sm:w-[130px]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="order-1 w-auto sm:order-2 "
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
