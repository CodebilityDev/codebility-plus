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