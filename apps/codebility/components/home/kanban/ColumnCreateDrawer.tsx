"use client";

import type { FormEvent } from "react";

import { toast } from "sonner";

import { createColumn } from "@/actions/home/kanban/columns";
import { Button } from "@/components/global/ui/button";
import { useModal } from "@/hooks/global/use-modal";
import { useKanbanStoreApi } from "@/providers/home/kanban/KanbanStoreProvider";
import { POSITION_GAP } from "@/utils/home/kanban/position";

import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@codevs/ui/sheet";

function readBoardId(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const { boardId } = data as Record<string, unknown>;
  if (typeof boardId !== "string" || boardId.length === 0) return null;
  return boardId;
}

function readField(data: FormData, field: string) {
  const value = data.get(field);
  return typeof value === "string" ? value : "";
}

export default function ColumnCreateDrawer() {
  const modal = useModal();
  const store = useKanbanStoreApi();

  const boardId = readBoardId(modal.data);

  if (boardId === null) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const name = readField(new FormData(form), "name").trim();

    if (name.length === 0 || !boardId) return;

    form.reset();
    modal.onClose();

    const tempId = `optimistic-${crypto.randomUUID()}`;
    const { columnsById, upsertColumn } = store.getState();
    const position =
      Object.values(columnsById).reduce(
        (highest, column) => Math.max(highest, column.position),
        0,
      ) + POSITION_GAP;

    upsertColumn({ id: tempId, name, position });

    try {
      const column = await createColumn(boardId, name);
      const next = store.getState();

      next.removeColumn(tempId);
      next.upsertColumn(column);
    } catch (caught) {
      store.getState().removeColumn(tempId);
      toast.error(
        caught instanceof Error
          ? caught.message
          : "Could not create the column.",
      );
    }
  }

  return (
    <Sheet
      open={modal.isOpen}
      onOpenChange={(next) => {
        if (!next) modal.onClose();
      }}
    >
      <SheetContent side="right" className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>New column</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="column-name">Name</Label>
            <Input id="column-name" name="name" required />
          </div>
          <Button type="submit">Create column</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
