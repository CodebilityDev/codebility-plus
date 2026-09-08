"use client";

import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@codevs/ui/button";
import type { FaqItemRow } from "../actions";

type FaqDetailModalProps = {
  item: FaqItemRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
  onEdit?: (item: FaqItemRow) => void;
  onDelete?: (item: FaqItemRow) => void;
};

export function FaqDetailModal({
  item,
  open,
  onOpenChange,
  isAdmin = false,
  onEdit,
  onDelete,
}: FaqDetailModalProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <span className="mb-1 inline-block w-fit rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            {item.category}
          </span>
          <DialogTitle className="text-lg leading-snug">{item.question}</DialogTitle>
        </DialogHeader>

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {item.answer}
        </p>

        {isAdmin && (
          <DialogFooter className="flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end dark:border-slate-800">
            <Button
              variant="outline"
              className="w-full gap-1.5 sm:w-auto"
              onClick={() => onEdit?.(item)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="w-full gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-600 sm:w-auto dark:text-red-400 dark:hover:bg-red-950/30"
              onClick={() => onDelete?.(item)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}