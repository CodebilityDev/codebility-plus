"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationIconProps {
  count?: number;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

export function NotificationIcon({
  count = 0,
  onClick,
  isActive = false,
  className,
}: NotificationIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative rounded-lg p-2 transition-all duration-200",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        isActive && "bg-gray-100 dark:bg-gray-800",
        className
      )}
      aria-label={`Notifications${count > 0 ? ` - ${count} unread` : ""}`}
    >
      <Bell 
        className={cn(
          "h-5 w-5 text-gray-600 dark:text-gray-300 transition-transform",
          count > 0 && "animate-bell-ring"
        )} 
      />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {count > 99 ? "99+" : count}
          </span>
        </span>
      )}
    </button>
  );
}