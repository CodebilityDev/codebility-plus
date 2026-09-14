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
  const userId = useUserStore((state) => state.user?.id);

  // Subscribe to single fields so this component only re-renders when the
  // value it actually renders changes, not on every store write.
  const notifications = useNotificationStore((state) => state.notifications);
  const isOpen = useNotificationStore((state) => state.isOpen);
  const togglePanel = useNotificationStore((state) => state.togglePanel);
  const setOpen = useNotificationStore((state) => state.setOpen);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const archiveNotification = useNotificationStore(
    (state) => state.archiveNotification,
  );
  const clearAll = useNotificationStore((state) => state.clearAll);

  // Store actions are stable references, so the polling effect below does not
  // restart every time notifications change.
  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications,
  );

  const unreadCount = notifications.reduce((n, item) => (item.read ? n : n + 1), 0);

  useNotificationPolling({ userId, isOpen, fetchNotifications });
  useNotificationRealtime({ userId, supabase });
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

/**
 * Fetches on mount and while the panel is open. Lives outside the component so
 * the polling timer is not recreated by unrelated re-renders.
 */
function useNotificationPolling({
  userId,
  isOpen,
  fetchNotifications,
}: {
  userId: string | undefined;
  isOpen: boolean;
  fetchNotifications: () => Promise<void>;
}) {
  useEffect(() => {
    if (!userId) return;
    fetchNotifications();
  }, [userId, fetchNotifications]);

  useEffect(() => {
    if (!isOpen || !userId) return;

    fetchNotifications();
    const pollInterval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(pollInterval);
  }, [isOpen, userId, fetchNotifications]);
}

function useNotificationRealtime({
  userId,
  supabase,
}: {
  userId: string | undefined;
  supabase: ReturnType<typeof createClientClientComponent>;
}) {
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    if (!userId || !supabase) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = {
            ...payload.new,
            createdAt: new Date(payload.new.created_at),
          };

          addNotification(newNotification as any);

          if (payload.new.sender_id && payload.new.sender_id !== userId) {
            toast.info(payload.new.title, {
              description: payload.new.message,
              duration: 5000,
            });
          }
        },
      )
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId, addNotification, supabase]);
}