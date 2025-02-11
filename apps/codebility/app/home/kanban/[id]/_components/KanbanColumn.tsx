import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/Components/ui/button";
import { useUserStore } from "@/store/codev-store";
import { ExtendedTask } from "@/types/home/codev";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
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
import KanbanTask from "./KanbanTask";

interface Props {
  column: {
    id: string;
    name: string;
  };
  projectId: string;
  tasks: ExtendedTask[];
}

export default function KanbanColumn({ column, projectId, tasks }: Props) {
  const router = useRouter();
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(column.name);

  // Only roles 1 and 5 can modify columns.
  const canModifyColumn = user?.role_id === 1 || user?.role_id === 5;

  // Set up the sortable container for the column itself.
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Create an array of task IDs for use with SortableContext.
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const handleDelete = async () => {
    if (!canModifyColumn) {
      toast.error("You don't have permission to delete columns");
      return;
    }

    if (tasks.length > 0) {
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
      ref={setNodeRef}
      style={style}
      className={`flex h-full min-w-[18rem] flex-col overflow-hidden rounded-md border-2 ${
        isDragging
          ? "border-blue-500 opacity-50"
          : "border-zinc-200 dark:border-zinc-700"
      } bg-[#FCFCFC] dark:bg-[#2C303A]`}
      {...attributes}
    >
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
              {column.name}
              <div className="flex items-center justify-center rounded-full bg-zinc-300 px-3 py-1 text-sm dark:bg-[#1C1C1C]">
                {tasks.length}
              </div>
            </>
          )}
        </div>

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
                disabled={tasks.length > 0}
                className="text-red-500 focus:text-red-500"
              >
                <Trash2 className="mr-2 h-3 w-3" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex flex-grow flex-col px-2 pb-2">
        {/* Tasks Container: Assign a unique id for droppable detection and remove fixed height/scroll */}
        <div id={`column-${column.id}-tasks`} className="flex flex-col gap-4">
          <SortableContext items={taskIds}>
            {tasks.map((task) => (
              <KanbanTask key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>
        <div className="pt-2">
          <KanbanTaskAddModal
            listId={column.id}
            totalTask={tasks.length}
            listName={column.name}
            projectId={projectId}
          />
        </div>
      </div>
    </li>
  );
}
