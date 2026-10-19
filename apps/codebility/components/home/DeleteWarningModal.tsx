"use client";

import React from "react";
import { useModal } from "@/hooks/global/use-modal";

import { Button } from "@codevs/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@codevs/ui/dialog";

function readOptionalString(data: unknown, key: string): string | null {
  if (typeof data !== "object" || data === null) return null;

  const value = (data as Record<string, unknown>)[key];

  return typeof value === "string" && value.length > 0 ? value : null;
}

export default function DeleteWarningModal() {
  const modal = useModal();
  const { isOpen, onClose, type, callback } = modal;
  const isModalOpen = isOpen && type === "deleteWarningModal";
  const handleDelete = callback;
  const title = readOptionalString(modal.data, "title") ?? "Confirm Deletion";
  const description =
    readOptionalString(modal.data, "description") ??
    "Are you sure you want to delete this? This action cannot be undone.";
  const confirmLabel =
    readOptionalString(modal.data, "confirmLabel") ?? "Delete";

  function handleConfirmDelete() {
    handleDelete?.();

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
          <DialogTitle id="delete-warning-title">{title}</DialogTitle>
        </DialogHeader>
        <div className="my-4 flex flex-col">
          <p id="delete-warning-description">{description}</p>
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
            {confirmLabel}
            <span className="sr-only"> - Permanently delete this item</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}