"use client";

import { useState } from "react";
import { Task } from "@/types/home/codev";
import { useKanbanStore } from "@/store/kanban-store";
import { MoreHorizontal, ArrowRight, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@codevs/ui/dropdown-menu";
import { Button } from "@codevs/ui/button";

import { updateTaskColumnId } from "../../actions";

interface Props {
  task: Task;
  currentColumnId: string;
  availableColumns: Array<{
    id: string;
    name: string;
  }>;
}

export default function MobileTaskMoveModal({
  task,
  currentColumnId,
  availableColumns,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { fetchBoardData } = useKanbanStore();

  const handleMoveTask = async (targetColumnId: string, targetColumnName: string) => {
    if (targetColumnId === currentColumnId) {
      toast.error("Task is already in this column");
      return;
    }

    setIsLoading(true);
    try {
      await updateTaskColumnId(task.id, targetColumnId);
      await fetchBoardData();
      toast.success(`Task moved to ${targetColumnName}`);
    } catch (error) {
      console.error("Error moving task:", error);
      toast.error("Failed to move task");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out current column from available options
  const moveOptions = availableColumns.filter(col => col.id !== currentColumnId);

  return (
    <div 
      className="block sm:hidden" 
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    > {/* Only show on mobile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm border border-white/20 dark:border-white/10"
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <MoreHorizontal className="h-3 w-3 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 bg-white/10 backdrop-blur-sm dark:bg-white/5 border border-white/20 dark:border-white/10"
        >
          {moveOptions.length > 0 ? (
            <>
              <div className="px-3 py-2 text-xs font-medium text-gray-300 dark:text-gray-400">
                Move to Column
              </div>
              <DropdownMenuSeparator className="bg-white/20 dark:bg-white/10" />
              {moveOptions.map((column) => (
                <DropdownMenuItem
                  key={column.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleMoveTask(column.id, column.name);
                  }}
                  disabled={isLoading}
                  className="flex items-center gap-2 cursor-pointer hover:bg-white/20 dark:hover:bg-white/10 transition-colors text-white dark:text-gray-200"
                >
                  <ArrowRight className="h-3 w-3" />
                  <span className="flex-1 truncate">{column.name}</span>
                </DropdownMenuItem>
              ))}
            </>
          ) : (
            <div className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500">
              No other columns available
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}