"use server";

import * as notificationService from "@/lib/server/notification.service";

export async function fetchNotificationsAction(limit: number = 50) {
  return notificationService.getNotifications(limit);
}

export async function markNotificationAsReadAction(notificationId: string) {
  return notificationService.markNotificationAsRead(notificationId);
}

export async function markAllNotificationsAsReadAction() {
  return notificationService.markAllNotificationsAsRead();
}

export async function archiveNotificationAction(notificationId: string) {
  return notificationService.archiveNotification(notificationId);
}

export async function clearAllNotificationsAction() {
  return notificationService.clearAllNotifications();
}

export async function createNotificationAction(data: {
  recipientId: string;
  title: string;
  message: string;
  type: string;
  priority?: string;
  actionUrl?: string;
  metadata?: any;
  senderId?: string;
  projectId?: string;
  jobId?: string;
}) {
  return notificationService.createNotification(data);
}