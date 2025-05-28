"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { KanbanColumnType, Task } from "@/types/home/codev";
import { debounce } from "@/utils/debounce";
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
import toast from "react-hot-toast";

import { batchUpdateTasks, updateColumnPosition } from "../actions";
import KanbanColumn from "./KanbanColumn";

// Styles
const styles = {
  container: "overflow-x-auto overflow-y-hidden",
  columnList:
    "flex flex-wrap min-h-[calc(100vh-12rem)] w-full gap-4 p-2 md:p-4",
} as const;

// Types
interface Props {
  columns: KanbanColumnType[];
  projectId: string;
  activeFilter: string | null;
}

interface DnDData {
  type: "Column" | "Task";
  columnId?: string;
}

interface DragAndDropHandlers {
  onDragEnd: (event: DragEndEvent) => void | Promise<void>;
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
}

// Custom Hook with proper types
function useDragAndDrop(handlers: DragAndDropHandlers) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 10 },
    }),
  );

  return {
    sensors,
    handleDragEnd: handlers.onDragEnd,
    handleDragStart: handlers.onDragStart,
    handleDragOver: handlers.onDragOver,
  };
}

export default function KanbanBoardColumnContainer({
  columns,
  projectId,
  activeFilter,
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

  // Filter and sort tasks
  const filterAndSortTasks = useCallback(
    (tasks: Task[] = []) => {
      return tasks
        .filter(
          (task) =>
            !activeFilter ||
            task.codev?.id === activeFilter ||
            task.sidekick_ids?.includes(activeFilter),
        )
        .sort(sortByUpdatedAtDesc);
    },
    [activeFilter],
  );

  // Update orderedColumns when columns change
  useEffect(() => {
    const sortedColumns = [...columns].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0),
    );
    setOrderedColumns(sortedColumns);
  }, [columns]);

  // Initialize board data from orderedColumns
  useEffect(() => {
    setBoardData(
      orderedColumns.map((col) => ({
        ...col,
        tasks: filterAndSortTasks(col.tasks),
      })),
    );
  }, [orderedColumns, activeFilter, filterAndSortTasks]);

  // Debounced batch update call for tasks
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

  const handleDragStart = useCallback((event: DragStartEvent) => {
    // Optional: set active item state for custom drag overlays.
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Optional: implement live feedback if needed.
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeData = active.data.current as DnDData | undefined;
      const overData = over.data.current as DnDData | undefined;
      if (!activeData || !overData) return;

      // Column Reordering
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
          console.error("Column reorder error:", error);
          toast.error("Failed to reorder columns");
        }
        return;
      }

      // Task Drag
      if (
        activeData.type === "Task" &&
        (overData.type === "Column" || overData.type === "Task")
      ) {
        const activeColId = activeData.columnId;
        const overColId = String(
          overData.type === "Column" ? over.id : overData.columnId,
        );

        if (!activeColId || !overColId) return;

        const updatedBoard = structuredClone(boardData);
        const oldColumnIndex = updatedBoard.findIndex(
          (col) => col.id === activeColId,
        );
        const newColumnIndex = updatedBoard.findIndex(
          (col) => col.id === overColId,
        );

        if (oldColumnIndex === -1 || newColumnIndex === -1) return;

        const oldColumn = updatedBoard[oldColumnIndex];
        const newColumn = updatedBoard[newColumnIndex];

        if (!oldColumn || !newColumn) return;

        oldColumn.tasks = oldColumn.tasks ?? [];
        newColumn.tasks = newColumn.tasks ?? [];

        const activeTaskIndex = oldColumn.tasks.findIndex(
          (t) => t.id === active.id,
        );
        if (activeTaskIndex === -1) return;

        const movedTask = oldColumn.tasks.splice(activeTaskIndex, 1)[0];
        if (!movedTask) return;

        movedTask.kanban_column_id = overColId;

        // If dragging over another task, insert at that task's index
        if (overData.type === "Task") {
          const overTaskIndex = newColumn.tasks.findIndex(
            (t) => t.id === over.id,
          );
          newColumn.tasks.splice(overTaskIndex, 0, movedTask);
        } else {
          // If dragging to column, add to the end
          newColumn.tasks.push(movedTask);
        }

        setBoardData(updatedBoard);

        setPendingUpdates((prev) => [
          ...prev,
          { taskId: movedTask.id, newColumnId: overColId },
        ]);
      }
    },
    [boardData, router],
  );

  const { sensors } = useDragAndDrop({
    onDragEnd: handleDragEnd,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
  });

  // Handle task completion
  const handleTaskComplete = useCallback((completedTaskId: string) => {
    setBoardData((prevData) =>
      prevData.map((column) => ({
        ...column,
        tasks:
          column.tasks?.filter((task) => task.id !== completedTaskId) || [],
      })),
    );
  }, []);

  // IDs for the SortableContext for columns
  const columnIds = boardData.map((col) => col.id);

  return (
    <div className={styles.container}>
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
          <ol className={styles.columnList}>
            {boardData.map((column) => (
              <KanbanColumn
                key={column.id}
                column={{ id: column.id, name: column.name }}
                projectId={projectId}
                tasks={column.tasks ?? []}
                onTaskComplete={handleTaskComplete}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
    </div>
  );
}
