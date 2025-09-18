export interface Notification {
  id: string;
  recipient_id: string;
  title: string;
  message: string;
  type: 
    | "info"
    | "success"
    | "warning"
    | "error"
    | "message"
    | "user"
    | "event"
    | "achievement"
    | "job"
    | "attendance"
    | "project"
    | "task"
    | "system";
  priority: "low" | "normal" | "high" | "urgent";
  read: boolean;
  archived: boolean;
  action_url?: string | null;
  metadata?: Record<string, any>;
  sender_id?: string | null;
  project_id?: string | null;
  job_id?: string | null;
  created_at: string;
  read_at?: string | null;
  archived_at?: string | null;
  expires_at?: string | null;
  // Frontend transformed dates
  createdAt?: Date;
  readAt?: Date;
  archivedAt?: Date;
  expiresAt?: Date;
}

export interface NotificationPreferences {
  user_id: string;
  in_app_enabled: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
  email_digest: boolean;
  email_digest_frequency: "daily" | "weekly" | "monthly";
  type_preferences: Record<string, {
    in_app: boolean;
    email: boolean;
  }>;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  created_at: string;
  updated_at: string;
}