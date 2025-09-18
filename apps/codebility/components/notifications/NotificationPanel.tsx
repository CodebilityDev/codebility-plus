"use client";

import { formatDistanceToNow } from "date-fns";
import { 
  Bell, 
  CheckCircle, 
  Info, 
  AlertCircle, 
  X,
  Archive,
  Check,
  MessageSquare,
  UserPlus,
  Calendar,
  Award,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@codevs/ui/button";
import { ScrollArea } from "@codevs/ui/scroll-area";

import type { Notification } from "@/types/notifications";

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onArchive: (id: string) => void;
  onClearAll: () => void;
}

const notificationIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
  message: MessageSquare,
  user: UserPlus,
  event: Calendar,
  achievement: Award,
  job: Briefcase,
  attendance: Calendar,
  project: Briefcase,
  task: CheckCircle,
  system: Info,
};

const notificationColors = {
  info: "text-blue-500",
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
  message: "text-purple-500",
  user: "text-indigo-500",
  event: "text-pink-500",
  achievement: "text-orange-500",
  job: "text-teal-500",
  attendance: "text-blue-500",
  project: "text-green-500",
  task: "text-blue-500",
  system: "text-gray-500",
};

export function NotificationPanel({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onArchive,
  onClearAll,
}: NotificationPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 animate-slide-down rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs"
            >
              <Check className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-[400px]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <Bell className="mb-2 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => {
              const Icon = notificationIcons[notification.type];
              const colorClass = notificationColors[notification.type];
              
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "group relative px-4 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                    !notification.read && "bg-blue-50 dark:bg-blue-900/20"
                  )}
                >
                  <div className="flex gap-3">
                    <div className={cn("mt-0.5 flex-shrink-0", colorClass)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "text-sm font-medium",
                        !notification.read ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                      )}>
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        {formatDistanceToNow(
                          notification.createdAt || new Date(notification.created_at), 
                          { addSuffix: true }
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                        title="Mark as read"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onArchive(notification.id)}
                      className="h-6 w-6 p-0"
                      title="Archive"
                    >
                      <Archive className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-2 dark:border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="w-full text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            Clear all notifications
          </Button>
        </div>
      )}
    </div>
  );
}