"use client";

import { useState } from "react";
import { Button } from "@codevs/ui/button";
import { Card } from "@codevs/ui/card";
import { useUserStore } from "@/store/codev-store";
import { toast } from "sonner";
import { sendTestNotification as sendNotificationAction } from "./actions";
import { ManualFetchTest } from "./manual-fetch";

const testNotifications = [
  {
    title: "Welcome to Codebility!",
    message: "Your account has been set up successfully. Start exploring!",
    type: "info" as const,
    priority: "normal" as const,
  },
  {
    title: "New Project Assignment",
    message: "You have been assigned to the E-Commerce Platform project",
    type: "job" as const,
    priority: "high" as const,
    action_url: "/home/projects",
  },
  {
    title: "Task Completed!",
    message: "Great job! You completed the login page implementation",
    type: "success" as const,
    priority: "normal" as const,
  },
  {
    title: "Task Completed!",
    message: "Congratulations! You have completed the task 'Implement User Authentication' and gained 25+ points.",
    type: "achievement" as const,
    priority: "normal" as const,
    action_url: "/home/tasks",
    metadata: {
      taskId: "test-task-123",
      taskTitle: "Implement User Authentication",
      pointsAwarded: 25,
      skillCategoryId: "backend-development",
      completedAt: new Date().toISOString()
    },
  },
  {
    title: "Attendance Reminder",
    message: "Don't forget to mark your attendance for today",
    type: "attendance" as const,
    priority: "normal" as const,
    action_url: "/home/attendance",
  },
  {
    title: "Achievement Unlocked!",
    message: "You earned the 'Code Reviewer' badge for completing 10 reviews",
    type: "achievement" as const,
    priority: "normal" as const,
    metadata: {
      badge_name: "Code Reviewer",
      badge_id: "code-reviewer",
      milestone: 10,
    },
  },
  {
    title: "New Message",
    message: "Sarah sent you a message: 'Are you available for a quick call?'",
    type: "message" as const,
    priority: "normal" as const,
    metadata: {
      sender_name: "Sarah",
      sender_id: "sarah-123",
    },
  },
  {
    title: "Meeting in 15 minutes",
    message: "Daily standup meeting starts at 10:00 AM",
    type: "event" as const,
    priority: "high" as const,
    action_url: "/home/calendar",
  },
  {
    title: "Low Attendance Warning",
    message: "Your attendance is below 80% this month. Please ensure regular attendance.",
    type: "warning" as const,
    priority: "high" as const,
  },
  {
    title: "System Maintenance",
    message: "Scheduled maintenance on Dec 25, 2024 from 2:00 AM to 4:00 AM",
    type: "system" as const,
    priority: "urgent" as const,
  },
];

export default function TestNotificationsPage() {
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const sendTestNotification = async (notification: typeof testNotifications[0]) => {
    if (!user?.id) {
      toast.error("User not logged in");
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendNotificationAction({
        recipientId: user.id,
        ...notification,
      });

      if (result?.error) {
        toast.error("Failed to create notification: " + result.error);
      } else {
        // Don't show success toast here, the notification will appear in the panel
      }
    } catch (error) {
      toast.error("Failed to create notification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Test Notifications</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Click any notification below to send it to yourself. The notification will appear in real-time in your notification panel.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testNotifications.map((notification, index) => (
          <Card key={index} className="p-4">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{notification.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  notification.priority === "urgent" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" :
                  notification.priority === "high" ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" :
                  "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}>
                  {notification.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {notification.message}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded">
                  {notification.type}
                </span>
                {notification.action_url && (
                  <span className="text-gray-500">
                    → {notification.action_url}
                  </span>
                )}
              </div>
            </div>
            <Button
              onClick={() => sendTestNotification(notification)}
              disabled={isLoading}
              className="w-full"
              variant="outline"
              size="sm"
            >
              Send Notification
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          💡 How it works:
        </h3>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• Notifications are sent to your user ID in the database</li>
          <li>• Real-time updates via Supabase subscriptions</li>
          <li>• Toast notifications appear when new notifications arrive</li>
          <li>• Click the bell icon in the header to see all notifications</li>
        </ul>
      </div>

      <ManualFetchTest />
    </div>
  );
}