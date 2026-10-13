"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  createTask,
  getTaskDetail,
  updateTask,
} from "@/actions/home/kanban/tasks";
import { getTaskSkillCategories } from "@/actions/home/kanban/skill-categories";
import { Button } from "@/components/global/ui/button";
import KanbanRichTextEditor from "@/components/home/kanban/KanbanRichTextEditor";
import TaskAssigneePicker from "@/components/home/kanban/TaskAssigneePicker";
import {
  DIFFICULTY_LEVELS,
  DIFFICULTY_POINTS,
  PRIORITY_LEVELS,
  TASK_TYPES,
} from "@/constants/home/kanban/kanban";
import { useModal } from "@/hooks/global/use-modal";
import { useKanbanStore } from "@/providers/home/kanban/KanbanStoreProvider";
import type { KanbanTask, SkillCategoryOption } from "@/types/home/kanban/kanban";

import { Button as IconButton } from "@codevs/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@codevs/ui/drawer";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";
import { X } from "lucide-react";

function readId(data: unknown, key: string): string | null {
  if (typeof data !== "object" || data === null) return null;

  const value = (data as Record<string, unknown>)[key];

  return typeof value === "string" && value.length > 0 ? value : null;
}

function toDateInput(value: string | null): string {
  return value ? value.slice(0, 10) : "";
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

let skillCategoryCache: { rows: SkillCategoryOption[]; at: number } | null =
  null;
const SKILL_CATEGORY_TTL_MS = 5 * 60 * 1000;

export default function TaskCreateDrawer() {
  const router = useRouter();
  const isOpen = useModal((state) => state.isOpen);
  const onClose = useModal((state) => state.onClose);
  const columnId = useModal((state) => readId(state.data, "columnId"));
  const taskId = useModal((state) => readId(state.data, "taskId"));
  const task = useKanbanStore((state) =>
    taskId ? state.tasksById[taskId] : undefined,
  );
  const projectId = useKanbanStore((state) => state.projectId);
  const resolvedColumnId = task ? task.columnId : columnId;
  const columnName = useKanbanStore((state) =>
    resolvedColumnId ? state.columnsById[resolvedColumnId]?.name : undefined,
  );

  const [title, setTitle] = useState(() => task?.title ?? "");
  const [priority, setPriority] = useState(() => task?.priority ?? "");
  const [difficulty, setDifficulty] = useState(() => task?.difficulty ?? "");
  const [type, setType] = useState(() => task?.type ?? "");
  const [skillCategoryId, setSkillCategoryId] = useState(
    () => task?.skillCategoryId ?? "",
  );
  const [deadline, setDeadline] = useState(() =>
    toDateInput(task?.deadline ?? null),
  );
  const [codevId, setCodevId] = useState(() => task?.codevId ?? "");
  const [sidekickIds, setSidekickIds] = useState<string[]>(
    () => task?.sidekickIds ?? [],
  );
  const [description, setDescription] = useState(() => task?.description ?? "");
  const [skillCategories, setSkillCategories] = useState<SkillCategoryOption[]>(
    [],
  );
  const [detail, setDetail] = useState<KanbanTask | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      skillCategoryCache &&
      Date.now() - skillCategoryCache.at < SKILL_CATEGORY_TTL_MS
    ) {
      setSkillCategories(skillCategoryCache.rows);
      return;
    }

    let active = true;

    getTaskSkillCategories()
      .then((rows) => {
        if (!active) return;
        skillCategoryCache = { rows, at: Date.now() };
        setSkillCategories(rows);
      })
      .catch(() => {
        if (active) setSkillCategories([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!taskId) {
      setDetail(null);
      return;
    }

    let active = true;

    getTaskDetail(taskId)
      .then((row) => {
        if (active) setDetail(row);
      })
      .catch(() => {
        if (active) setDetail(null);
      });

    return () => {
      active = false;
    };
  }, [taskId]);

  useEffect(() => {
    if (!detail) return;

    setTitle(detail.title);
    setPriority(detail.priority ?? "");
    setDifficulty(detail.difficulty ?? "");
    setType(detail.type ?? "");
    setSkillCategoryId(detail.skillCategoryId ?? "");
    setDeadline(toDateInput(detail.deadline));
    setCodevId(detail.codevId ?? "");
    setSidekickIds(detail.sidekickIds);
    setDescription(detail.description ?? "");
  }, [detail]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = title.trim();

    if (!trimmed) {
      setError("Task title is required.");
      return;
    }
    if (!priority) {
      setError("Priority is required.");
      return;
    }
    if (!difficulty) {
      setError("Difficulty is required.");
      return;
    }
    if (!type) {
      setError("Task type is required.");
      return;
    }
    if (!skillCategoryId) {
      setError("Skill category is required.");
      return;
    }

    if (!task && !columnId) return;

    setPending(true);
    setError(null);

    const fields = {
      title: trimmed,
      description: description || undefined,
      priority,
      difficulty,
      points: DIFFICULTY_POINTS[difficulty] ?? 0,
      type,
      skillCategoryId,
      deadline: deadline || undefined,
      codevId: codevId || undefined,
      sidekickIds: sidekickIds.length > 0 ? sidekickIds : undefined,
    };

    try {
      if (task) {
        await updateTask({ taskId: task.id, ...fields });
      } else if (columnId) {
        await createTask({ columnId, ...fields });
      }
      onClose();
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : task
            ? "Could not save the task."
            : "Could not create the task.",
      );
    } finally {
      setPending(false);
    }
  }

  if (!resolvedColumnId || !projectId) return null;

  return (
    <Drawer
      direction="right"
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DrawerContent side="right" className="h-full p-0">
        <DrawerHeader className="!flex shrink-0 flex-row items-start justify-between gap-4 border-b px-6 py-5 text-left">
          <div className="flex flex-col gap-1">
            <DrawerTitle className="text-xl font-bold">
              {task ? "Edit Task" : "Add New Task"}
            </DrawerTitle>
            <DrawerDescription className="mt-2 rounded-md bg-customBlue-50 px-3 py-2 text-sm text-customBlue-700 dark:bg-customBlue-500/10 dark:text-customBlue-100">
              {task
                ? `Editing: ${task.title}`
                : `Adding to: ${columnName ?? "this column"}`}
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <IconButton
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close"
              className="h-8 w-8 shrink-0 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </IconButton>
          </DrawerClose>
        </DrawerHeader>
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-5"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task-title">
                Task Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="task-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Enter task title"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-points">Points (Based on Difficulty)</Label>
              <Input
                id="task-points"
                value={difficulty ? String(DIFFICULTY_POINTS[difficulty] ?? 0) : "0"}
                readOnly
                disabled
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-priority">
                Priority <span className="text-destructive">*</span>
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="task-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {capitalize(level)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-difficulty">
                Difficulty <span className="text-destructive">*</span>
              </Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="task-difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {capitalize(level)} - {DIFFICULTY_POINTS[level]} pts
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-type">
                Task Type <span className="text-destructive">*</span>
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="task-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_TYPES.map((taskType) => (
                    <SelectItem key={taskType} value={taskType}>
                      {capitalize(taskType.toLowerCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-skill-category">
                Skill Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={skillCategoryId}
                onValueChange={setSkillCategoryId}
              >
                <SelectTrigger id="task-skill-category">
                  <SelectValue placeholder="Select skill category" />
                </SelectTrigger>
                <SelectContent>
                  {skillCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-deadline">Deadline</Label>
              <Input
                id="task-deadline"
                type="date"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Primary Assignee{" "}
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              </Label>
              <TaskAssigneePicker
                label="primary assignee"
                multiple={false}
                projectId={projectId}
                disabledIds={sidekickIds}
                value={codevId ? [codevId] : []}
                onChange={(ids) => setCodevId(ids[0] ?? "")}
              />
            </div>
            <div className="space-y-2">
              <Label>
                Sidekick Helpers{" "}
                <span className="text-xs text-muted-foreground">
                  (Optional)
                </span>
              </Label>
              <TaskAssigneePicker
                label="sidekick helper"
                multiple
                projectId={projectId}
                disabledIds={codevId ? [codevId] : []}
                value={sidekickIds}
                onChange={setSidekickIds}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <KanbanRichTextEditor value={description} onChange={setDescription} />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="hollow"
              className="w-auto"
              onClick={onClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-auto"
              loading={pending}
              loadingText={task ? "Saving..." : "Creating task..."}
            >
              {task ? "Save" : "Create Task"}
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
