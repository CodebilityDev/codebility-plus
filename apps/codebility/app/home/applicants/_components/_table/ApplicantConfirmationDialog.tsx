"use client";

import React from "react";
import { Button } from "@codevs/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@codevs/ui/dialog";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { ActionType } from "./applicantActionTypes";
import { ACTION_CONFIG } from "./applicantActionConfig";

interface ApplicantConfirmationDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  actionType: ActionType | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ApplicantConfirmationDialog({
  isOpen,
  isLoading,
  actionType,
  onConfirm,
  onCancel,
}: ApplicantConfirmationDialogProps) {
  if (!actionType) return null;

  const config = ACTION_CONFIG[actionType];

  return (
    <Dialog open={isOpen} onOpenChange={onCancel} modal={true}>
      <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">{config.confirmTitle}</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">{config.confirmDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading} className="text-gray-700 dark:text-gray-300">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant={config.variant || "default"}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2Icon className="mr-2 h-4 w-4" />
                Confirm
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}