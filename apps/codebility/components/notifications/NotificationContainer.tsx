"use client";

import { useEffect, useRef } from "react";
import { useNotificationStore } from "@/store/notification-store";
import { NotificationIcon } from "./NotificationIcon";
import { NotificationPanel } from "./NotificationPanel";
import { createClientClientComponent } from "@/utils/supabase/client";
import { useUserStore } from "@/store/codev-store";
import { toast } from "sonner";

export function NotificationContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const supabase = createClientClientComponent();
  const { user } = useUserStore();
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
    fetchNotifications,
    addNotification,
  } = useNotificationStore();

  const unreadCount = getUnreadCount();

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    console.log("useEffect triggered - user?.id:", user?.id);
    if (user?.id) {
      console.log("Fetching notifications for user:", user.id);
      fetchNotifications();
    } else {
      console.log("No user ID, skipping fetch");
    }
  }, [user?.id]); // Remove fetchNotifications from deps to avoid circular dependency

  // Also fetch when panel opens
  useEffect(() => {
    if (isOpen && user?.id) {
      console.log("Panel opened, fetching latest notifications");
      fetchNotifications();
    }
  }, [isOpen, user?.id]); // Remove fetchNotifications from deps

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id || !supabase) return;

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("New notification received:", payload);
          const newNotification = {
            ...payload.new,
            createdAt: new Date(payload.new.created_at),
          };
          addNotification(newNotification as any);
          
          // Only show toast for notifications from other users
          // Check if sender_id exists and is different from current user
          if (payload.new.sender_id && payload.new.sender_id !== user.id) {
            toast.info(payload.new.title, {
              description: payload.new.message,
              duration: 5000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id, addNotification, supabase]);

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

  // Add debug info
  console.log("NotificationContainer render:", {
    user: user?.id,
    notificationCount: notifications.length,
    unreadCount,
    isOpen,
    isLoading: useNotificationStore.getState().isLoading,
    error: useNotificationStore.getState().error
  });

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