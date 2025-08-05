"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
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
  tasks?: ExtendedTask[];
  onTaskComplete: (taskId: string) => void;
}

export default function KanbanColumn({
  column,
  projectId,
  tasks,
  onTaskComplete,
}: Props) {
  const router = useRouter();
  const { user } = useUserStore();
  const canModifyColumn = user?.role_id === 1 || user?.role_id === 5;
  const canAddTask = user?.role_id === 1 || user?.role_id === 5 || user?.role_id === 4 || user?.role_id === 10;
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(column.name);

  const safeTasks = tasks ?? [];

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
    zIndex: isColumnDragging ? 40 : undefined,
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
  const { onOpen } = useModal();

  const confirmDelete = async () => {
    const response = await deleteColumn(column.id);
    if (response.success) {
      toast.success("Column deleted successfully");
      window.location.reload();
    } else {
      toast.error(response.error || "Failed to delete column");
    }
  };

  const handleDelete = () => {
    if (!canModifyColumn) {
      toast.error("You don't have permission to delete columns");
      return;
    }
  
    if (safeTasks.length > 0) {
      toast.error("Cannot delete column with tasks");
      return;
    }
  
    onOpen("deleteWarningModal", {}, {}, () => confirmDelete());
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
        relative flex h-full 
        w-[calc(100vw-2rem)] min-w-[280px] 
        flex-col overflow-hidden 
        rounded-xl border 
        md:w-[350px] md:min-w-[350px]
        lg:w-[400px] lg:min-w-[400px]
        ${
          isColumnDragging
            ? "border-customBlue-500 opacity-95 shadow-lg shadow-customBlue-500/15 scale-[1.02]"
            : isOver
              ? "border-customBlue-400 bg-customBlue-50/50 dark:border-customBlue-500 dark:bg-customBlue-950/20"
              : "border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md"
        }
        bg-gray-50/90 backdrop-blur-sm transition-all duration-200 ease-out dark:bg-gray-800/90
      `}
      {...attributes}
    >
      {/* Column Header */}
      <div
        className="flex items-center justify-between bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-3 md:p-4 border-b border-gray-300 dark:border-gray-600"
        {...listeners}
      >
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 md:gap-3">
          {isEditing ? (
            <div className="flex items-center gap-1 md:gap-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-6 w-24 text-xs md:w-32 md:text-sm"
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
              <GripVertical className="hidden h-5 w-5 text-gray-400 cursor-grab hover:text-gray-600 dark:hover:text-gray-300 md:block transition-colors" />
              <span className="text-base font-semibold text-gray-900 dark:text-white md:text-lg">{column.name}</span>
              <div className="flex items-center justify-center rounded-full bg-customBlue-100 dark:bg-customBlue-900/30 px-3 py-1 text-sm font-medium text-blue-100 dark:text-customBlue-100">
                {safeTasks.length}
              </div>
            </>
          )}
        </div>

        {/* Column actions - Update button sizes */}
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
                <span className="text-sm">Edit name</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={safeTasks.length > 0}
                className="text-red-500 focus:text-red-500"
              >
                <Trash2 className="mr-2 h-3 w-3" />
                <span className="text-sm">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Column Body - Update padding and spacing */}
      <div className="flex flex-grow flex-col px-1 pb-2 md:px-2">
        <div
          ref={setDroppableRef}
          role="region"
          aria-label={`Tasks in ${column.name} column`}
          className={`
            flex min-h-[100px] flex-col gap-2 rounded-md p-1 transition-colors duration-200
            md:gap-4 md:p-2
            ${isOver ? "border-2 border-customBlue-200 bg-customBlue-50 dark:bg-customBlue-900/20" : ""}
          `}
        >
          <SortableContext
            items={taskIds}
            strategy={verticalListSortingStrategy}
          >
            {sortedTasks.length === 0 ? (
              <div className="py-4 text-center text-xs text-gray-400 md:text-sm">
                No tasks in this column
              </div>
            ) : (
              sortedTasks.map((task) => (
                <KanbanTask
                  key={task.id}
                  task={task}
                  columnId={column.id}
                  onComplete={onTaskComplete}
                />
              ))
            )}
          </SortableContext>
        </div>

        {/* Add new task button/modal */}
        {canAddTask && (
          <div className="pt-1 md:pt-2">
            <KanbanTaskAddModal
              listId={column.id}
              listName={column.name}
              projectId={projectId}
              totalTask={safeTasks.length}
            />
          </div>
        )}
      </div>
    </li>
  );
}
