"use client";

import React, { useState } from "react";
import { Megaphone } from "lucide-react";
import { AnnouncementModal } from "./AnnouncementModal";
import { useNotificationStore } from "@/store/notification-store"; 
import { cn } from "@/lib/utils"; 

export const AnnouncementButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notifications,markAsRead   } = useNotificationStore();
  const unreadAnnouncements = notifications.filter(
    (n) => n.type === "announcement" && !n.read
  );

  const unreadCount = unreadAnnouncements.length;

  const handleOpen = () => {
    setIsModalOpen(true);
    unreadAnnouncements.forEach((n) => markAsRead(n.id));
  };
  
  return (
    <>
      <button
        onClick={handleOpen}
        className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
         aria-label={`Announcements${unreadCount > 0 ? ` - ${unreadCount} new` : ""}`}

        title="Announcements"
      >
       <Megaphone
        className={cn(
          "h-5 w-5 text-gray-600 dark:text-gray-300 transition-transform",
          unreadCount > 0 && "animate-bell-ring" 
        )} />
         {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};