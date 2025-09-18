"use server";

import { createNotification } from "@/lib/server/notification.service";

export async function sendTestNotification(notification: {
  recipientId: string;
  title: string;
  message: string;
  type: any;
  priority?: string;
  action_url?: string;
  metadata?: any;
}) {
  return createNotification(notification);
}