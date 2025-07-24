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
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black-800 fixed inset-0 bg-opacity-50 backdrop-blur-sm" />
      <DialogContent
        aria-describedby="delete-warning-description"
        className="dark:bg-dark-200 text-stone-900 dark:text-white"
        role="alertdialog"
        aria-labelledby="delete-warning-title"
      >
        <DialogHeader>
          <DialogTitle id="delete-warning-title">
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>
        <div className="my-4 flex flex-col">
          <p id="delete-warning-description">
            Are you sure you want to delete this? This action cannot be undone.
          </p>
          <div className="sr-only" aria-live="polite" role="status">
            Deletion confirmation dialog is open. Use Tab to navigate between Cancel and Delete buttons.
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-2 lg:w-[50%] lg:flex-row lg:place-self-end">
          <Button
            type="button"
            variant="outline"
            className="order-2 w-auto dark:border-white dark:bg-transparent sm:order-1"
            onClick={onClose}
            aria-label="Cancel deletion and close dialog"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="order-1 w-auto sm:order-2"
            onClick={handleConfirmDelete}
            aria-label="Confirm deletion - this action cannot be undone"
            autoFocus
          >
            Delete
            <span className="sr-only"> - Permanently delete this item</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
