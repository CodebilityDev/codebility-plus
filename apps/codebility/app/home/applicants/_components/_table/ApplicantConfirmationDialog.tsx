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
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{config.confirmTitle}</DialogTitle>
          <DialogDescription>{config.confirmDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
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