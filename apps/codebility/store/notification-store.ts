import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "message" | "user" | "event" | "achievement" | "job";
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

interface NotificationStore {
  notifications: Notification[];
  isOpen: boolean;
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (id: string) => void;
  clearAll: () => void;
  togglePanel: () => void;
  setOpen: (open: boolean) => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      isOpen: false,

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: crypto.randomUUID(),
              read: false,
              createdAt: new Date(),
            },
            ...state.notifications,
          ],
        })),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      archiveNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearAll: () =>
        set(() => ({
          notifications: [],
        })),

      togglePanel: () =>
        set((state) => ({
          isOpen: !state.isOpen,
        })),

      setOpen: (open) =>
        set(() => ({
          isOpen: open,
        })),

      getUnreadCount: () => {
        const state = get();
        return state.notifications.filter((n) => !n.read).length;
      },
    }),
    {
      name: "notification-storage",
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);