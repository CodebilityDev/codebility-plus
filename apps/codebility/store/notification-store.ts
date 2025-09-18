import { create } from "zustand";
import type { Notification } from "@/types/notifications";
import * as notificationService from "@/lib/server/notification.service";

interface NotificationStore {
  notifications: Notification[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  archiveNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  togglePanel: () => void;
  setOpen: (open: boolean) => void;
  getUnreadCount: () => number;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  isOpen: false,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await notificationService.getNotifications();
      if (error) {
        set({ error, isLoading: false });
      } else {
        set({ notifications: data || [], isLoading: false });
      }
    } catch (error) {
      set({ error: "Failed to fetch notifications", isLoading: false });
    }
  },

  addNotification: (notification) =>
    set((state) => {
      // Check if notification already exists to prevent duplicates
      const exists = state.notifications.some(n => n.id === notification.id);
      if (exists) {
        return state;
      }
      return {
        notifications: [notification, ...state.notifications],
      };
    }),

  markAsRead: async (id) => {
    const { error } = await notificationService.markNotificationAsRead(id);
    if (!error) {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n
        ),
      }));
    }
  },

  markAllAsRead: async () => {
    const { error } = await notificationService.markAllNotificationsAsRead();
    if (!error) {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ 
          ...n, 
          read: true,
          read_at: new Date().toISOString()
        })),
      }));
    }
  },

  archiveNotification: async (id) => {
    const { error } = await notificationService.archiveNotification(id);
    if (!error) {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }
  },

  clearAll: async () => {
    const { error } = await notificationService.clearAllNotifications();
    if (!error) {
      set({ notifications: [] });
    }
  },

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
}));