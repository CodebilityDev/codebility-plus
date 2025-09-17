"use client";

import { Button } from "@codevs/ui/button";
import { useNotificationStore } from "@/store/notification-store";

export function NotificationDemo() {
  const { addNotification } = useNotificationStore();

  const demoNotifications = [
    {
      title: "New message from Sarah",
      message: "Hey! Are you available for a quick call?",
      type: "message" as const,
    },
    {
      title: "Task completed",
      message: "Your deployment has been completed successfully",
      type: "success" as const,
    },
    {
      title: "New team member",
      message: "John Doe has joined your team",
      type: "user" as const,
    },
    {
      title: "Meeting reminder",
      message: "Daily standup starting in 15 minutes",
      type: "event" as const,
    },
    {
      title: "Achievement unlocked!",
      message: "You've completed 100 code reviews",
      type: "achievement" as const,
    },
    {
      title: "New job opportunity",
      message: "Frontend Developer position is now available",
      type: "job" as const,
    },
    {
      title: "System update",
      message: "New features have been added to the dashboard",
      type: "info" as const,
    },
    {
      title: "Warning",
      message: "Your session will expire in 5 minutes",
      type: "warning" as const,
    },
    {
      title: "Error occurred",
      message: "Failed to save your changes. Please try again.",
      type: "error" as const,
    },
  ];

  const addRandomNotification = () => {
    const randomNotification = 
      demoNotifications[Math.floor(Math.random() * demoNotifications.length)];
    addNotification(randomNotification);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        onClick={addRandomNotification}
        variant="outline"
        className="shadow-lg"
      >
        Add Test Notification
      </Button>
    </div>
  );
}