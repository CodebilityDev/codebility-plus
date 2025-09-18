"use server";

import { createNotification } from "@/lib/server/notification.service";
import type { Notification } from "@/types/notifications";

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
      ...notification,
      actionUrl: notification.action_url,
    });
    return result;
  } catch (error) {
    console.error("Error in sendTestNotification:", error);
    return { data: null, error: "Failed to create notification" };
  }
}