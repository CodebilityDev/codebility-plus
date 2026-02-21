import { createClientServerComponent } from "@/utils/supabase/server";
import { Notification } from "@/types/notifications";

async function getCodevUserId(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const authUser = user;

  const { data: userById } = await supabase
    .from("codev")
    .select("id, email_address, username")
    .eq("id", authUser.id)
    .maybeSingle();

  if (userById) {
    return userById.id;
  }

  const { data: userByEmail } = await supabase
    .from("codev")
    .select("id, email_address, username")
    .ilike("email_address", authUser.email)
    .maybeSingle();

  if (userByEmail) {
    return userByEmail.id;
  }

  return null;
}

export async function getNotifications(limit: number = 50) {
  const supabase = await createClientServerComponent();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { data: null, error: "Not authenticated" };
  }

  const codevUserId = await getCodevUserId(supabase);
  if (!codevUserId) {
    return { data: null, error: "User not found in codev table" };
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", codevUserId)
    .eq("archived", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return { data: null, error: error.message };
  }

  const notifications = data?.map((n) => ({
    ...n,
    createdAt: new Date(n.created_at),
    readAt: n.read_at ? new Date(n.read_at) : undefined,
    archivedAt: n.archived_at ? new Date(n.archived_at) : undefined,
    expiresAt: n.expires_at ? new Date(n.expires_at) : undefined,
  }));

  return { data: notifications, error: null };
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClientServerComponent();

  const codevUserId = await getCodevUserId(supabase);
  if (!codevUserId) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase.rpc("mark_notification_read", {
    p_notification_id: notificationId,
    p_user_id: codevUserId,
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function markAllNotificationsAsRead() {
  const supabase = await createClientServerComponent();

  const codevUserId = await getCodevUserId(supabase);
  if (!codevUserId) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase.rpc("mark_all_notifications_read", {
    p_user_id: codevUserId,
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function archiveNotification(notificationId: string) {
  const supabase = await createClientServerComponent();

  const codevUserId = await getCodevUserId(supabase);
  if (!codevUserId) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("notifications")
    .update({ archived: true, archived_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("recipient_id", codevUserId);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function clearAllNotifications() {
  const supabase = await createClientServerComponent();

  const codevUserId = await getCodevUserId(supabase);
  if (!codevUserId) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("notifications")
    .delete()
    .eq("recipient_id", codevUserId);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function getNotificationPreferences() {
  const supabase = await createClientServerComponent();

  const codevUserId = await getCodevUserId(supabase);
  if (!codevUserId) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", codevUserId)
    .single();

  if (error && error.code !== "PGRST116") {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateNotificationPreferences(preferences: any) {
  const supabase = await createClientServerComponent();

  const codevUserId = await getCodevUserId(supabase);
  if (!codevUserId) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("notification_preferences")
    .upsert({
      user_id: codevUserId,
      ...preferences,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

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
    return { data: null, error: "Failed to initialize database connection" };
  }

  const codevUserId = await getCodevUserId(supabase);
  if (!codevUserId) {
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
    p_sender_id: senderId || codevUserId,
    p_project_id: projectId || null,
    p_job_id: jobId || null,
  });

  if (error) {
    return { data: null, error: error.message };
  }

  if (data === null) {
    return { data: "skipped", error: null };
  }

  return { data, error: null };
}