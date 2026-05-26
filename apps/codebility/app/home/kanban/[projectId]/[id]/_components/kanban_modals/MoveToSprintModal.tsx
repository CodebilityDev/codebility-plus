"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@codevs/ui/label";
import { Loader2Icon, ArrowRightLeft } from "lucide-react";
import toast from "react-hot-toast";
import { createClientClientComponent } from "@/utils/supabase/client";
import { getSprintsData } from "@/app/home/kanban/[projectId]/_services/query";
import { transferTaskToSprint } from "@/app/home/kanban/[projectId]/[id]/actions";
import { useKanbanStore } from "@/store/kanban-store";
import { Task } from "@/types/home/codev";

interface Sprint {
  id: string;
  name: string;
  start_at: string;
  end_at: string;
  board_id: string;
  project_id?: string;
  kanban_board?: { id: string; name: string } | null;
}

interface Column {
  id: string;
  name: string;
  position: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  projectId: string;
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function MoveToSprintModal({
  isOpen,
  onClose,
  task,
  projectId,
}: Props) {
  const { fetchBoardData, removeTaskOptimistic } = useKanbanStore();

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [currentSprintId, setCurrentSprintId] = useState<string | null>(null);
  const [selectedSprintId, setSelectedSprintId] = useState<string>("");
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedColumnId, setSelectedColumnId] = useState<string>("");
  const [isLoadingSprints, setIsLoadingSprints] = useState(true);
  const [isLoadingColumns, setIsLoadingColumns] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  // -------------------------------------------------------------------------
  // Load all sprints for the project, then exclude the task's current sprint
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!isOpen || !projectId || !task?.kanban_column_id) return;

    const load = async () => {
      setIsLoadingSprints(true);
      setSelectedSprintId("");
      setSelectedColumnId("");
      setColumns([]);

      try {
        const supabase = createClientClientComponent();
        if (!supabase) throw new Error("Supabase client not initialized");
        // Find which sprint the task currently belongs to via its column → board
        const { data: columnData } = await supabase
          .from("kanban_columns")
          .select("board_id")
          .eq("id", task.kanban_column_id)
          .single();

        if (columnData?.board_id) {
          const { data: sprintData } = await supabase
            .from("kanban_sprints")
            .select("id")
            .eq("board_id", columnData.board_id)
            .single();

          setCurrentSprintId(sprintData?.id ?? null);
        }

        // Fetch all project sprints
        const projectData = await getSprintsData(projectId);
        const allSprints =
          (projectData?.kanban_sprints as unknown as Sprint[]) ?? [];

        setSprints(allSprints);
      } catch (err) {
        console.error("Error loading sprints:", err);
        toast.error("Failed to load sprints.");
      } finally {
        setIsLoadingSprints(false);
      }
    };

    load();
  }, [isOpen, projectId, task?.kanban_column_id]);

  // -------------------------------------------------------------------------
  // When a destination sprint is selected, load its columns
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!selectedSprintId) {
      setColumns([]);
      setSelectedColumnId("");
      return;
    }

    const selectedSprint = sprints.find((s) => s.id === selectedSprintId);
    if (!selectedSprint?.board_id) return;

    const loadColumns = async () => {
      setIsLoadingColumns(true);
      setSelectedColumnId("");

      try {
        const supabase = createClientClientComponent();
        if (!supabase) throw new Error("Supabase client not initialized");
        const { data, error } = await supabase
          .from("kanban_columns")
          .select("id, name, position")
          .eq("board_id", selectedSprint.board_id)
          .order("position", { ascending: true });

        if (error) {
          console.error("Error loading columns:", error);
          setColumns([]);
        } else {
          setColumns((data as Column[]) ?? []);
          // Pre-select the first column (default landing spot)
          if (data && data.length > 0) {
            setSelectedColumnId(data[0]?.id ?? "");
          }
        }
      } catch (err) {
        console.error("Error loading columns:", err);
        setColumns([]);
      } finally {
        setIsLoadingColumns(false);
      }
    };

    loadColumns();
  }, [selectedSprintId, sprints]);

  // -------------------------------------------------------------------------
  // Transfer handler
  // -------------------------------------------------------------------------
  const handleTransfer = async () => {
    if (!selectedSprintId) {
      toast.error("Please select a destination sprint.");
      return;
    }

    if (!selectedColumnId && columns.length > 0) {
      toast.error("Please select a destination column.");
      return;
    }

    if (columns.length === 0) {
      toast.error(
        "The selected sprint has no columns. Add a column to that sprint first.",
      );
      return;
    }

    setIsTransferring(true);

    // Optimistically remove task from the current board view
    removeTaskOptimistic(task.id);
    onClose();
    toast.success("Transferring task to sprint...");

    try {
      const result = await transferTaskToSprint(
        task.id,
        selectedSprintId,
        selectedColumnId || undefined,
      );

      if (result.success) {
        toast.success("Task successfully moved to the selected sprint!");
        await fetchBoardData();
      } else {
        toast.error(result.error ?? "Failed to transfer task.");
        // Re-fetch to restore the task if optimistic removal was premature
        await fetchBoardData();
      }
    } catch (err) {
      console.error("Transfer error:", err);
      toast.error("An unexpected error occurred.");
      await fetchBoardData();
    } finally {
      setIsTransferring(false);
    }
  };

  // Sprints available as destinations (exclude current sprint)
  const availableSprints = sprints.filter((s) => s.id !== currentSprintId);

  const selectedSprint = sprints.find((s) => s.id === selectedSprintId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            <ArrowRightLeft className="h-5 w-5 text-blue-600" />
            Move to Sprint
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Task name reminder */}
          <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <span className="font-medium">Task:</span> {task?.title}
          </div>

          {/* Sprint selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Destination Sprint</Label>
            {isLoadingSprints ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Loading sprints...
              </div>
            ) : availableSprints.length === 0 ? (
              <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
                No other sprints available in this project. Create another
                sprint first.
              </div>
            ) : (
              <Select
                value={selectedSprintId}
                onValueChange={setSelectedSprintId}
              >
                <SelectTrigger className="border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
                  <SelectValue placeholder="Select a sprint..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSprints.map((sprint) => (
                    <SelectItem key={sprint.id} value={sprint.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{sprint.name}</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(sprint.start_at)} →{" "}
                          {formatDate(sprint.end_at)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Column selector — only shown once a sprint is picked */}
          {selectedSprintId && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Destination Column{" "}
                <span className="font-normal text-gray-400">
                  (defaults to first column)
                </span>
              </Label>

              {isLoadingColumns ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  Loading columns...
                </div>
              ) : columns.length === 0 ? (
                <div className="rounded-md border border-dashed border-orange-300 bg-orange-50 px-3 py-2 text-sm text-orange-600 dark:border-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                  This sprint has no columns. Add columns to it before
                  transferring.
                </div>
              ) : (
                <Select
                  value={selectedColumnId}
                  onValueChange={setSelectedColumnId}
                >
                  <SelectTrigger className="border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <SelectValue placeholder="Select a column..." />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Summary preview */}
          {selectedSprint && selectedColumnId && columns.length > 0 && (
            <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
              This task will be moved to{" "}
              <span className="font-semibold">{selectedSprint.name}</span> →{" "}
              <span className="font-semibold">
                {columns.find((c) => c.id === selectedColumnId)?.name}
              </span>
              . All task details, comments, and points will be preserved.
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isTransferring}
            className="border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={
              isTransferring ||
              !selectedSprintId ||
              columns.length === 0 ||
              isLoadingColumns
            }
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isTransferring && (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Move to Sprint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}