"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { AnnouncementCategory } from "./types";

interface AnnouncementTabProps {
  id: AnnouncementCategory;
  label: string;
  isActive: boolean;
  isAdmin?: boolean;
  onClick: (id: AnnouncementCategory) => void;
  onEdit?: (id: AnnouncementCategory, label: string) => void;
  onDelete?: (id: AnnouncementCategory) => void;
}

export const AnnouncementTab: React.FC<AnnouncementTabProps> = ({
  id,
  label,
  isActive,
  isAdmin = false,
  onClick,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`
        group relative flex items-center justify-between rounded-lg w-full
        ${
          isActive
            ? "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50"
        }
      `}
    >
      <button
        onClick={() => onClick(id)}
        className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium text-left truncate transition-all duration-200"
        role="tab"
        aria-selected={isActive}
        aria-controls={`panel-${id}`}
      >
        {label}
      </button>

      {isAdmin && (
        <div className="flex items-center gap-0.5 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
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