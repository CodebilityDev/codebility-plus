"use client";

import React from "react";
import { AnnouncementCategory } from "./types";

interface AnnouncementTabProps {
  id: AnnouncementCategory;
  label: string;
  isActive: boolean;
  onClick: (id: AnnouncementCategory) => void;
}

export const AnnouncementTab: React.FC<AnnouncementTabProps> = ({
  id,
  label,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`
        relative px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-200
        ${
          isActive
            ? "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50"
        }
        rounded-lg w-full text-left flex items-center justify-between
      `}
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
    >
      <span className="truncate">{label}</span>
    </button>
  );
};