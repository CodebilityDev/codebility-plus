"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { KanbanColumnType, Task } from "@/types/home/codev";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

import { updateColumnPosition } from "../actions";
import KanbanColumn from "./KanbanColumn";

// ----- Debounce Utility -----
function debounce<F extends (...args: any[]) => any>(func: F, delay: number) {
  let timeoutId: NodeJS.Timeout | null = null;
  return (...args: Parameters<F>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

// ----- Batch Update for Tasks -----
async function batchUpdateTasks(
  updates: Array<{ taskId: string; newColumnId: string }>,
) {
  const supabase = createClientComponentClient();
  try {
    const updatePromises = updates.map(async (update) => {
      const { error } = await supabase
        .from("tasks")
        .update({
          kanban_column_id: update.newColumnId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", update.taskId);
      return error;
    });
    const errors = await Promise.all(updatePromises);
    return {
      success: !errors.some((error) => error !== null),
      error: errors.some((error) => error !== null)
        ? "Some updates failed"
        : undefined,
    };
  } catch (error) {
    console.error("Batch update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Batch update failed",
    };
  }
}

// ----- Component Props & DnD Data Interface -----
interface Props {
  columns: KanbanColumnType[];
  projectId: string;
}

/**
 * Our custom drag-and-drop data interface.
 * When dragging a task, we attach its originating column via `columnId`.
 */
interface DnDData {
  type: "Column" | "Task";
  columnId?: string;
}

export default function KanbanBoardColumnContainer({
  columns,
  projectId,
}: Props) {
  const router = useRouter();

  // Sort columns by their "position" (lowest to highest)
  const [orderedColumns, setOrderedColumns] = useState<KanbanColumnType[]>(() =>
    [...columns].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
  );

  // Our board data: ensure every column has a tasks array.
  const [boardData, setBoardData] = useState<KanbanColumnType[]>([]);
  // For batching task updates (when a task moves between columns).
  const [pendingUpdates, setPendingUpdates] = useState<
    Array<{ taskId: string; newColumnId: string }>
  >([]);

  // Sort function for tasks (descending by updated_at)
  const sortByUpdatedAtDesc = (a: Task, b: Task) => {
    const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
    const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
    return dateB - dateA;
  };

  // Initialize board data from orderedColumns, ensuring tasks is never undefined.
  useEffect(() => {
    setBoardData(
      orderedColumns.map((col) => ({
        ...col,
        tasks: (col.tasks ?? []).sort(sortByUpdatedAtDesc),
      })),
    );
  }, [orderedColumns]);

  // Debounced batch update call for tasks.
  const debouncedBatchUpdate = useMemo(
    () =>
      debounce(
        async (updates: Array<{ taskId: string; newColumnId: string }>) => {
          if (updates.length === 0) return;
          try {
            const result = await batchUpdateTasks(updates);
            if (!result.success) {
              toast.error(result.error || "Failed to update tasks");
            }
            setPendingUpdates([]);
            router.refresh();
          } catch (error) {
            console.error("Batch update error:", error);
            toast.error("Failed to update tasks");
          }
        },
        1000,
      ),
    [router],
  );

  useEffect(() => {
    if (pendingUpdates.length > 0) {
      debouncedBatchUpdate(pendingUpdates);
    }
  }, [pendingUpdates, debouncedBatchUpdate]);

  // Set up DnD sensors.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    // Optional: set active item state for custom drag overlays.
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: implement live feedback if needed.
  };

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      // Cast drag data to our DnDData interface.
      const activeData = active.data.current as DnDData | undefined;
      const overData = over.data.current as DnDData | undefined;
      if (!activeData || !overData) return;

      // -------- Handle Column Drag --------
      if (activeData.type === "Column" && overData.type === "Column") {
        const oldIndex = boardData.findIndex((col) => col.id === active.id);
        const newIndex = boardData.findIndex((col) => col.id === over.id);
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        const newCols = arrayMove(boardData, oldIndex, newIndex);
        setBoardData(newCols);
        setOrderedColumns(newCols);
        try {
          await Promise.all(
            newCols.map((column, index) =>
              updateColumnPosition(column.id, index),
            ),
          );
          router.refresh();
        } catch (error) {
          console.error("Failed to update column positions", error);
          toast.error("Failed to reorder columns");
        }
        return;
      }

      // -------- Handle Task Drag --------
      if (activeData.type === "Task" && overData.type === "Column") {
        // Ensure we have a valid column ID
        const activeColId = activeData.columnId;
        const overColId = overData.columnId;
        if (!activeColId || !overColId) return;

        // Find column indices with type guard
        const oldColumnIndex = boardData.findIndex(
          (col) => col.id === activeColId,
        );
        const newColumnIndex = boardData.findIndex(
          (col) => col.id === overColId,
        );
        if (oldColumnIndex === -1 || newColumnIndex === -1) return;

        // Create a mutable copy of boardData
        const updatedBoard = [...boardData];

        // Safely get old and new columns with non-null assertion
        const oldColumn = updatedBoard[oldColumnIndex]!;
        const newColumn = updatedBoard[newColumnIndex]!;

        // Ensure tasks arrays exist
        oldColumn.tasks = oldColumn.tasks ?? [];
        newColumn.tasks = newColumn.tasks ?? [];

        // Find the task to move
        const activeTaskIndex = oldColumn.tasks.findIndex(
          (t) => t.id === active.id,
        );
        if (activeTaskIndex === -1) return;

        // Safely remove task from old column
        const [movedTask] = oldColumn.tasks.splice(activeTaskIndex, 1);
        if (!movedTask) return;

        // Update task's column ID
        movedTask.kanban_column_id = overColId;

        // Add task to new column at the beginning
        newColumn.tasks.unshift(movedTask);

        // Update board state
        setBoardData(updatedBoard);

        // Queue DB update
        setPendingUpdates((prev) => [
          ...prev,
          { taskId: movedTask.id, newColumnId: overColId },
        ]);
      }
    },
    [boardData, router],
  );

  // IDs for the SortableContext for columns.
  const columnIds = boardData.map((col) => col.id);

  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={columnIds}
          strategy={horizontalListSortingStrategy}
        >
          <ol className="flex w-full gap-2 p-4">
            {boardData.map((column) => (
              <KanbanColumn
                key={column.id}
                column={{ id: column.id, name: column.name }}
                projectId={projectId}
                tasks={column.tasks ?? []}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
    </div>
  );
}
