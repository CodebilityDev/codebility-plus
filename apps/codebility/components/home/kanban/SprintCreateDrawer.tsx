"use client";

import type { FormEvent } from "react";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createSprint } from "@/actions/home/kanban/sprints";
import { Button } from "@/components/global/ui/button";
import { useModal } from "@/hooks/global/use-modal";

import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@codevs/ui/sheet";

function readSprintCreateData(
  data: unknown,
): { projectId: string; canCreate: boolean } | null {
  if (typeof data !== "object" || data === null) return null;
  const { projectId, canCreate } = data as Record<string, unknown>;
  if (typeof projectId !== "string" || projectId.length === 0) return null;
  return { projectId, canCreate: canCreate === true };
}

function readField(data: FormData, field: string) {
  const value = data.get(field);
  return typeof value === "string" ? value : "";
}

export default function SprintCreateDrawer() {
  const router = useRouter();
  const modal = useModal();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sprintData = readSprintCreateData(modal.data);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!sprintData) return;

    const formData = new FormData(event.currentTarget);
    const name = readField(formData, "name").trim();
    const startAt = readField(formData, "startAt");
    const endAt = readField(formData, "endAt");

    setPending(true);
    setError(null);

    try {
      await createSprint({
        projectId: sprintData.projectId,
        name,
        startAt,
        endAt,
      });
      modal.onClose();
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not create the sprint.",
      );
    } finally {
      setPending(false);
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
          <SheetTitle>New sprint</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sprint-name">Name</Label>
            <Input id="sprint-name" name="name" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sprint-start">Start date</Label>
            <Input id="sprint-start" name="startAt" type="date" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sprint-end">End date</Label>
            <Input id="sprint-end" name="endAt" type="date" required />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button
            type="submit"
            loading={pending}
            loadingText="Creating sprint..."
          >
            Create sprint
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
