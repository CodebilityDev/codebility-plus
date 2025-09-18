"use server";

import { createNotification, getNotifications } from "@/lib/server/notification.service";
import type { Notification } from "@/types/notifications";

export async function fetchNotifications() {
  return getNotifications();
}

export async function sendTestNotification(notification: {
  recipientId: string;
  title: string;
  message: string;
  type: Notification["type"];
  priority?: "low" | "normal" | "high" | "urgent";
  action_url?: string;
  metadata?: any;
}): Promise<{ data: string | null; error: string | null }> {
  try {
    
    const result = await createNotification({
      recipientId: notification.recipientId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      actionUrl: notification.action_url,
      metadata: notification.metadata,
    });
    
    return result;
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed to create notification" };
  }
}