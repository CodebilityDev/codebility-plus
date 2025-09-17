"use client";

import { useEffect, useRef } from "react";
import { useNotificationStore } from "@/store/notification-store";
import { NotificationIcon } from "./NotificationIcon";
import { NotificationPanel } from "./NotificationPanel";

export function NotificationContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    isOpen,
    togglePanel,
    setOpen,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    clearAll,
    getUnreadCount,
  } = useNotificationStore();

  const unreadCount = getUnreadCount();

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, setOpen]);

  // Close panel with Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, setOpen]);

  return (
    <div ref={containerRef} className="relative">
      <NotificationIcon
        count={unreadCount}
        onClick={togglePanel}
        isActive={isOpen}
      />
      
      {isOpen && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setOpen(false)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onArchive={archiveNotification}
          onClearAll={clearAll}
        />
      )}
    </div>
  );
}