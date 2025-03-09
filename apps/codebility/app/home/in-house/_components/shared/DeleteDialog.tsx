import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@codevs/ui/alert-dialog";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
  isLoading?: boolean;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  name,
  isLoading,
}: DeleteDialogProps) {
  // Track user’s typed input for confirmation
  const [typedValue, setTypedValue] = useState("");

  // Reset input whenever we close
  const handleClose = () => {
    setTypedValue("");
    onClose();
  };

  // User must type exactly "delete" (case-insensitive)
  const canConfirm = typedValue.trim().toLowerCase() === "delete";

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="bg-light-300 dark:bg-dark-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="dark:text-light-900 text-black">
            Delete Member
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray dark:text-light-500">
            Are you sure you want to delete{" "}
            <span className="font-medium">{name}</span>? This action cannot be
            undone.
            <br />
            Please type <span className="font-semibold">delete</span> in the
            field below to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4">
          <input
            type="text"
            placeholder='Type "delete" to confirm'
            value={typedValue}
            onChange={(e) => setTypedValue(e.target.value)}
            className="border-light-700 dark:border-dark-200 dark:bg-dark-200 dark:text-light-900 w-full rounded-md 
                       border px-3 py-2
                       text-black placeholder-gray-400 focus:outline-none"
            disabled={isLoading}
          />
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel
            disabled={isLoading}
            className="border-light-700 dark:border-dark-200 
                       bg-light-800 dark:bg-dark-200 dark:text-light-900 text-black"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            disabled={!canConfirm || isLoading}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
