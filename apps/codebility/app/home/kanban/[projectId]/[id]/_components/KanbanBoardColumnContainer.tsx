"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  closestCorners,
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

import { broadcastColumnsReorder } from "@/lib/kanban/board-broadcast";
import {
  commitTaskMove,
  filterColumnsByMember,
} from "@/lib/kanban/board-mutations";
import { registerColumnReorderBlock } from "@/lib/kanban/own-writes";
import {
  useKanbanBoardActions,
  useKanbanBoardMeta,
  useKanbanColumns,
} from "@/store/kanban-board/KanbanBoardProvider";

import { updateColumnPosition } from "../actions";
import KanbanColumn from "./KanbanColumn";

const styles = {
  container: "overflow-x-auto overflow-y-hidden",
  columnList:
    "flex flex-wrap min-h-[calc(100vh-12rem)] w-full gap-4 p-2 md:p-4",
} as const;

interface Props {
  projectId: string;
  activeFilter: string | null;
}

interface DnDData {
  type: "Column" | "Task";
  columnId?: string;
}

function useDragAndDrop(handlers: {
  onDragEnd: (event: DragEndEvent) => void | Promise<void>;
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 3 },
    }),
  );

  return { sensors, ...handlers };
}

export default function KanbanBoardColumnContainer({
  projectId,
  activeFilter,
}: Props) {
  const router = useRouter();
  const columns = useKanbanColumns();
  const { boardId } = useKanbanBoardMeta();
  const { setColumns, removeTaskLocal } = useKanbanBoardActions();

  const boardData = useMemo(
    () => filterColumnsByMember(columns, activeFilter),
    [columns, activeFilter],
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeData = active.data.current as DnDData | undefined;
      const overData = over.data.current as DnDData | undefined;
      if (!activeData || !overData) return;

      if (activeData.type === "Column" && overData.type === "Column") {
        const orderedColumns = [...columns].sort(
          (a, b) => (a.position ?? 0) - (b.position ?? 0),
        );
        const oldIndex = orderedColumns.findIndex((col) => col.id === active.id);
        const newIndex = orderedColumns.findIndex((col) => col.id === over.id);

        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

        const previousColumns = columns;
        const newCols = arrayMove(orderedColumns, oldIndex, newIndex).map(
          (column, index) => ({ ...column, position: index }),
        );
        registerColumnReorderBlock();
        setColumns(newCols);
        broadcastColumnsReorder(boardId, {
          columns: newCols.map((column) => ({
            id: column.id,
            position: column.position ?? 0,
          })),
        });

        try {
          await Promise.all(
            newCols.map((column, index) =>
              updateColumnPosition(column.id, index),
            ),
          );
        } catch (error) {
          console.error("Column reorder error:", error);
          setColumns(previousColumns);
          toast.error("Failed to reorder columns");
          router.refresh();
        }
        return;
      }

      if (
        activeData.type === "Task" &&
        (overData.type === "Column" || overData.type === "Task")
      ) {
        const activeColId = activeData.columnId;
        const overColId = String(
          overData.type === "Column" ? over.id : overData.columnId,
        );

        if (!activeColId || !overColId) return;

        const sourceColumn = columns.find((col) => col.id === activeColId);
        const targetColumn = columns.find((col) => col.id === overColId);
        if (!sourceColumn || !targetColumn) return;

        const sourceTasks = sourceColumn.tasks ?? [];
        const targetTasks =
          activeColId === overColId
            ? sourceTasks
            : (targetColumn.tasks ?? []);

        const activeTaskIndex = sourceTasks.findIndex((t) => t.id === active.id);
        if (activeTaskIndex === -1) return;

        let targetPosition = targetTasks.length;
        if (overData.type === "Task") {
          const overTaskIndex = targetTasks.findIndex((t) => t.id === over.id);
          if (overTaskIndex !== -1) {
            targetPosition = overTaskIndex;
          }
        }

        const result = await commitTaskMove(
          String(active.id),
          overColId,
          targetPosition,
        );

        if (!result.success) {
          toast.error(result.error || "Failed to move task");
        }
      }
    },
    [boardData, boardId, columns, router, setColumns],
  );

  const { sensors } = useDragAndDrop({
    onDragEnd: handleDragEnd,
    onDragStart: () => {},
    onDragOver: () => {},
  });

  const handleTaskComplete = useCallback(
    (completedTaskId: string) => {
      removeTaskLocal(completedTaskId);
    },
    [removeTaskLocal],
  );

  const columnIds = boardData.map((col) => col.id);

  return (
    <div className={styles.container}>
      <DndContext
        id={`kanban-board-${projectId}`}
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={() => {}}
        onDragOver={() => {}}
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
                availableColumns={boardData.map((col) => ({
                  id: col.id,
                  name: col.name,
                }))}
              />
            ))}
          </ol>
        </SortableContext>
      </DndContext>
    </div>
  );
}
