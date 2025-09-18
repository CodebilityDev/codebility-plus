import { createClientServerComponent } from "@/utils/supabase/server";
import { Notification } from "@/types/notifications";

/**
 * Fetch notifications for the current user
 */
export async function getNotifications(limit: number = 50) {
  console.log("Service: getNotifications called");
  const supabase = await createClientServerComponent();

  const { data: session } = await supabase.auth.getSession();
  console.log("Service: Session user:", session?.session?.user?.id);
  if (!session?.session?.user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", session.session.user.id)
    .eq("archived", false) // Only get non-archived notifications
    .order("created_at", { ascending: false })
    .limit(limit);

  console.log("Service: Raw query result:", { data, error });

  if (error) {
    console.error("Error fetching notifications:", error);
    return { data: null, error: error.message };
  }

  // Transform data to match frontend expectations
  const notifications = data?.map((n) => ({
    ...n,
    createdAt: new Date(n.created_at),
    readAt: n.read_at ? new Date(n.read_at) : undefined,
    archivedAt: n.archived_at ? new Date(n.archived_at) : undefined,
    expiresAt: n.expires_at ? new Date(n.expires_at) : undefined,
  }));

  console.log("Service: Transformed notifications:", notifications);
  return { data: notifications, error: null };
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClientServerComponent();

  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase.rpc("mark_notification_read", {
    p_notification_id: notificationId,
    p_user_id: session.session.user.id,
  });

  if (error) {
    console.error("Error marking notification as read:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Mark all notifications as read for the current user
 */
export async function markAllNotificationsAsRead() {
  const supabase = await createClientServerComponent();

  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase.rpc("mark_all_notifications_read", {
    p_user_id: session.session.user.id,
  });

  if (error) {
    console.error("Error marking all notifications as read:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Archive (soft delete) a notification
 */
export async function archiveNotification(notificationId: string) {
  const supabase = await createClientServerComponent();

  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("notifications")
    .update({ archived: true, archived_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("recipient_id", session.session.user.id);

  if (error) {
    console.error("Error archiving notification:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Delete all notifications for the current user
 */
export async function clearAllNotifications() {
  const supabase = await createClientServerComponent();

  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("notifications")
    .delete()
    .eq("recipient_id", session.session.user.id);

  if (error) {
    console.error("Error clearing notifications:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Get notification preferences for the current user
 */
export async function getNotificationPreferences() {
  const supabase = await createClientServerComponent();

  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", session.session.user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 means no rows found, which is ok
    console.error("Error fetching preferences:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Update notification preferences for the current user
 */
export async function updateNotificationPreferences(preferences: any) {
  const supabase = await createClientServerComponent();

  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("notification_preferences")
    .upsert({
      user_id: session.session.user.id,
      ...preferences,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error updating preferences:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

/**
 * Create a notification (admin only or system use)
 */
export async function createNotification({
  recipientId,
  title,
  message,
  type,
  priority = "normal",
  actionUrl,
  metadata,
  senderId,
  projectId,
  jobId,
}: {
  recipientId: string;
  title: string;
  message: string;
  type: Notification["type"];
  priority?: "low" | "normal" | "high" | "urgent";
  actionUrl?: string;
  metadata?: any;
  senderId?: string;
  projectId?: string;
  jobId?: string;
}) {
  let supabase;
  try {
    supabase = await createClientServerComponent();
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    return { data: null, error: "Failed to initialize database connection" };
  }

  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase.rpc("create_notification", {
    p_recipient_id: recipientId,
    p_title: title,
    p_message: message,
    p_type: type,
    p_priority: priority,
    p_action_url: actionUrl,
    p_metadata: metadata || {},
    p_sender_id: senderId || session.session.user.id,
    p_project_id: projectId || null,
    p_job_id: jobId || null,
  });

  if (error) {
    console.error("Error creating notification:", error);
    return { data: null, error: error.message };
  }

  // The function returns NULL if duplicate or notifications disabled
  if (data === null) {
    console.log("Notification not created (duplicate or disabled)");
    return { data: "skipped", error: null };
  }

  return { data, error: null };
}