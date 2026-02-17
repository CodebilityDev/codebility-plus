"use server";
import { createClientServerComponent } from "@/utils/supabase/server";

/**
 * Get unread notifications for a user
 */
export async function getUnreadNotifications(userId: string) {
  const supabase = await createClientServerComponent();
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(`
        id,
        title,
        message,
        type,
        priority,
        read,
        action_url,
        metadata,
        created_at,
        sender:sender_id (
          id,
          first_name,
          last_name,
          image_url,
          username
        ),
        post:post_id (
          id,
          title
        ),
        comment:comment_id (
          id,
          content
        )
      `)
      .eq("recipient_id", userId)
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Mark notifications as read
 */
export async function markNotificationsAsRead(notificationIds: string[]) {
  const supabase = await createClientServerComponent();
  try {
    const { error } = await supabase
      .from("notifications")
      .update({
        read: true,
        read_at: new Date().toISOString(),
      })
      .in("id", notificationIds);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
  const supabase = await createClientServerComponent();
  try {
    const { error } = await supabase
      .from("notifications")
      .update({
        read: true,
        read_at: new Date().toISOString(),
      })
      .eq("recipient_id", userId)
      .eq("read", false);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const supabase = await createClientServerComponent();
  try {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", userId)
      .eq("read", false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    throw error;
  }
}

/**
 * Archive a notification
 */
export async function archiveNotification(notificationId: string) {
  const supabase = await createClientServerComponent();
  try {
    const { error } = await supabase
      .from("notifications")
      .update({
        archived: true,
        archived_at: new Date().toISOString(),
      })
      .eq("id", notificationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string) {
  const supabase = await createClientServerComponent();
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}