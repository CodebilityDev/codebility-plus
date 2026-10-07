"use client";

import { useState } from "react";

import { Button } from "@/components/global/ui/button";
import { useKanbanActions } from "@/hooks/home/kanban/use-kanban-actions";
import { useKanbanStoreApi } from "@/providers/home/kanban/KanbanStoreProvider";

import { Input } from "@codevs/ui/input";

export default function KanbanTaskComposer({ columnId }: { columnId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const store = useKanbanStoreApi();
  const { createTask } = useKanbanActions(store);

  async function submit() {
    const value = title.trim();
    if (!value || saving) {
      return;
    }
    setSaving(true);
    try {
      await createTask({ columnId, title: value });
      setTitle("");
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <Button
        type="button"
        size="sm"
        variant="ghost"
        aria-label="Add a task to this column"
        onClick={() => setOpen(true)}
      >
        Add task
      </Button>
    );
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <Input
        autoFocus
        value={title}
        aria-label="Task title"
        placeholder="Task title"
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setTitle("");
            setOpen(false);
          }
        }}
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={saving}>
          Add
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setTitle("");
            setOpen(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
