"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/Components/ui/button";
import { useUserStore } from "@/store/codev-store";
import { ExtendedTask } from "@/types/home/codev";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Check,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import { Input } from "@codevs/ui/input";

import { deleteColumn, updateColumnName } from "../actions";
import KanbanTaskAddModal from "./kanban_modals/KanbanTaskAddModal";
/** IMPORTANT: This is where you import the sortable task component. */
import KanbanTask from "./KanbanTask"; // (see #2 below)

interface Props {
  column: {
    id: string;
    name: string;
  };
  projectId: string;
  tasks?: ExtendedTask[]; // Make tasks optional so it can default to an empty array if undefined.
}

export default function KanbanColumn({ column, projectId, tasks }: Props) {
  const router = useRouter();
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(column.name);

  const safeTasks = tasks ?? [];

  // Example roles that can modify columns:
  const canModifyColumn = user?.role_id === 1 || user?.role_id === 5;

  // 1) Make the whole column "sortable" so we can reorder columns horizontally
  const {
    setNodeRef: setColumnRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging: isColumnDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  // 2) Make the column droppable for tasks
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      columnId: column.id,
    },
  });

  // Apply transform for the column itself
  const columnStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isColumnDragging ? 999 : undefined,
  };

  // Sorted tasks by updated_at (DESC) using safeTasks array
  const sortedTasks = useMemo(() => {
    return [...safeTasks].sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [safeTasks]);

  // The array of task IDs for our SortableContext
  const taskIds = useMemo(
    () => sortedTasks.map((task) => task.id),
    [sortedTasks],
  );

  // Handle column deletion
  const handleDelete = async () => {
    if (!canModifyColumn) {
      toast.error("You don't have permission to delete columns");
      return;
    }

    if (safeTasks.length > 0) {
      toast.error("Cannot delete column with tasks");
      return;
    }

    if (confirm("Are you sure you want to delete this column?")) {
      const response = await deleteColumn(column.id);
      if (response.success) {
        toast.success("Column deleted successfully");
        router.refresh();
      } else {
        toast.error(response.error || "Failed to delete column");
      }
    }
  };

  // Handle column rename
  const handleUpdateName = async () => {
    if (!canModifyColumn) {
      toast.error("You don't have permission to edit columns");
      return;
    }

    if (!newName.trim()) {
      toast.error("Column name cannot be empty");
      return;
    }

    const response = await updateColumnName(column.id, newName);
    if (response.success) {
      toast.success("Column name updated");
      setIsEditing(false);
      router.refresh();
    } else {
      toast.error(response.error || "Failed to update column name");
    }
  };

  return (
    <li
      ref={setColumnRef}
      style={columnStyle}
      className={`
        relative flex h-full w-[400px] min-w-[400px] flex-col overflow-hidden
        rounded-md border-2
        ${
          isColumnDragging
            ? "border-blue-500 opacity-50 shadow-lg"
            : isOver
              ? "border-blue-300 dark:border-blue-500"
              : "border-zinc-200 dark:border-zinc-700"
        }
        bg-[#FCFCFC] transition-all duration-200 dark:bg-[#2C303A]
      `}
      {...attributes}
    >
      {/* Column Header (grab handle) */}
      <div
        className="flex items-center justify-between p-3 font-bold dark:bg-[#1E1F26]"
        {...listeners}
      >
        <div className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-6 w-32 text-sm"
                autoFocus
              />
              <Button
                size="icon"
                variant="hollow"
                onClick={handleUpdateName}
                className="h-6 w-6 !p-0"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="hollow"
                onClick={() => setIsEditing(false)}
                className="h-6 w-6 !p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <>
              {/* Drag handle icon */}
              <GripVertical className="h-4 w-4 text-gray-400" />
              {column.name}
              {/* Task count */}
              <div className="flex items-center justify-center rounded-full bg-zinc-300 px-3 py-1 text-sm dark:bg-[#1C1C1C]">
                {safeTasks.length}
              </div>
            </>
          )}
        </div>

        {/* Column actions */}
        {!isEditing && canModifyColumn && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="hollow"
                className="h-6 w-6 !p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-3 w-3" />
                Edit name
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={safeTasks.length > 0}
                className="text-red-500 focus:text-red-500"
              >
                <Trash2 className="mr-2 h-3 w-3" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Column Body (Droppable + SortableContext for tasks) */}
      <div className="flex flex-grow flex-col px-2 pb-2">
        <div
          ref={setDroppableRef}
          role="region"
          aria-label={`Tasks in ${column.name} column`}
          className={`
            flex min-h-[100px] flex-col gap-4 rounded-md p-2
            transition-colors duration-200
            ${isOver ? "border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/20" : ""}
          `}
        >
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {sortedTasks.length === 0 ? (
              <div className="py-4 text-center text-gray-400">
                No tasks in this column
              </div>
            ) : (
              sortedTasks.map((task) => (
                <KanbanTask key={task.id} task={task} columnId={column.id} />
              ))
            )}
          </SortableContext>
        </div>

        {/* Add new task button/modal */}
        <div className="pt-2">
          <KanbanTaskAddModal
            listId={column.id}
            listName={column.name}
            projectId={projectId}
            totalTask={safeTasks.length}
          />
        </div>
      </div>
    </li>
  );
}
