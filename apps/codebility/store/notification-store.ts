import { create } from "zustand";
import { toast } from "react-hot-toast";
import type { Notification } from "@/types/notifications";
import { 
  fetchNotificationsAction,
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
  archiveNotificationAction,
  clearAllNotificationsAction
} from "@/lib/actions/notification.actions";

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
      const { data, error } = await fetchNotificationsAction();
      if (error) {
        set({ error, isLoading: false });
      } else {
        set({ notifications: data || [], isLoading: false });
      }
    } catch {
      set({ error: "Failed to fetch notifications", isLoading: false });
    }
  },

  addNotification: (notification) => {
    set((state) => {
      const exists = state.notifications.some((n) => n.id === notification.id);
      if (exists) return state;
      return {
        notifications: [notification, ...state.notifications],
      };
    });
  },

  markAsRead: async (id) => {
    const { error } = await markNotificationAsReadAction(id);
    if (!error) {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n
        ),
      }));
    }
  },

  markAllAsRead: async () => {
    try {
      const { error } = await markAllNotificationsAsReadAction();
      if (error) {
        toast.error("Failed to mark notifications as read. Please try again.");
        return;
      }

      const unreadCount = get().notifications.filter((n) => !n.read).length;

      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          read: true,
          read_at: new Date().toISOString(),
        })),
      }));

      if (unreadCount > 0) {
        toast.success(`Marked ${unreadCount} notifications as read`);
      }
    } catch {
      toast.error("An error occurred while marking notifications as read");
    }
  },

  archiveNotification: async (id) => {
    const { error } = await archiveNotificationAction(id);
    if (!error) {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }
  },

  clearAll: async () => {
    const { error } = await clearAllNotificationsAction();
    if (!error) {
      set({ notifications: [] });
    }
  },

  togglePanel: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  setOpen: (open) => {
    set({ isOpen: open });
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },
}));