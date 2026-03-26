"use client";
import React, { useRef } from "react";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { AnnouncementCategory } from "./types";

interface AnnouncementTabProps {
  id: AnnouncementCategory;
  label: string;
  isActive: boolean;
  isAdmin?: boolean;
  onClick: (id: AnnouncementCategory) => void;
  onEdit?: (id: AnnouncementCategory, label: string) => void;
  onDelete?: (id: AnnouncementCategory) => void;
  onDragStart?: (e: React.DragEvent, id: AnnouncementCategory) => void;
  onDragOver?: (e: React.DragEvent, id: AnnouncementCategory) => void;
  onDragEnd?: () => void;
  onDrop?: (e: React.DragEvent, id: AnnouncementCategory) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
}

export const AnnouncementTab: React.FC<AnnouncementTabProps> = ({
  id,
  label,
  isActive,
  isAdmin = false,
  onClick,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  isDragging = false,
  isDragOver = false,
}) => {
  // Ref-based gate: synchronous, no re-render delay
  const gripPressed = useRef(false);

  return (
    <div
      draggable={isAdmin}
      onDragStart={(e) => {
        if (!gripPressed.current) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/plain", id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.(e, id);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        onDragOver?.(e, id);
      }}
      onDragEnd={() => {
        gripPressed.current = false;
        onDragEnd?.();
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.(e, id);
      }}
      className={`
        group relative flex items-center justify-between rounded-lg w-full
        transition-all duration-150 select-none
        ${isActive
          ? "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50"
        }
        ${isDragging ? "opacity-40 scale-[0.98]" : "opacity-100"}
        ${isDragOver ? "border-t-2 border-blue-500" : "border-t-2 border-transparent"}
      `}
    >
      {/* Grip handle — only shown to admins on hover */}
      {isAdmin && (
        <span
          onMouseDown={() => { gripPressed.current = true; }}
          onMouseUp={() => { gripPressed.current = false; }}
          className="pl-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-grab active:cursor-grabbing text-gray-400 dark:text-gray-500"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4 pointer-events-none" />
        </span>
      )}

      <button
        draggable={false}
        onClick={() => onClick(id)}
        className="flex-1 px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base font-medium text-left truncate"
        role="tab"
        aria-selected={isActive}
        aria-controls={`panel-${id}`}
      >
        {label}
      </button>

      {isAdmin && (
        <div className="flex items-center gap-0.5 pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            draggable={false}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(id, label);
            }}
            className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-500"
            title="Rename category"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            draggable={false}
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(id);
            }}
            className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500"
            title="Delete category"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};