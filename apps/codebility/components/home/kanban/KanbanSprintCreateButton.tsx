"use client";

import type { FormEvent } from "react";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { createSprint } from "@/actions/home/kanban/sprints";
import { Button } from "@/components/global/ui/button";

import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@codevs/ui/sheet";

function readField(data: FormData, field: string) {
  const value = data.get(field);
  return typeof value === "string" ? value : "";
}

export default function KanbanSprintCreateButton({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = readField(data, "name").trim();
    const startAt = readField(data, "startAt");
    const endAt = readField(data, "endAt");

    setPending(true);
    setError(null);

    try {
      await createSprint({ projectId, name, startAt, endAt });
      setOpen(false);
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
    <div className="flex w-full justify-end sm:w-auto">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button type="button" className="w-auto">
            New sprint
          </Button>
        </SheetTrigger>
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
    </div>
  );
}
