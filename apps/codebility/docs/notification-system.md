# Notification System Documentation

## Overview

The Codebility notification system is a comprehensive solution for delivering real-time, in-app notifications with support for email and future push notifications. It's designed to be extensible, performant, and user-friendly.

## Architecture

### Database Tables

1. **`notifications`** - Core notification storage
2. **`notification_preferences`** - User notification settings
3. **`notification_templates`** - Reusable notification templates
4. **`notification_queue`** - Email/push delivery queue

### Notification Types

| Type | Use Case | Icon | Color | Priority |
|------|----------|------|-------|----------|
| `info` | General information, updates | Info | Blue | Normal |
| `success` | Completed actions, achievements | CheckCircle | Green | Normal |
| `warning` | Warnings, approaching deadlines | AlertCircle | Yellow | High |
| `error` | Failed actions, system errors | AlertCircle | Red | High |
| `message` | Direct messages, chat | MessageSquare | Purple | Normal |
| `user` | New team members, profile updates | UserPlus | Indigo | Normal |
| `event` | Meetings, schedules, deadlines | Calendar | Pink | Normal |
| `achievement` | Badges, points, level ups | Award | Orange | Normal |
| `job` | Job assignments, applications | Briefcase | Teal | High |
| `attendance` | Check-in reminders, warnings | Calendar | Blue | Normal |
| `project` | Project updates, milestones | Folder | Green | Normal |
| `task` | Task assignments, completions | CheckSquare | Blue | Normal |
| `system` | Maintenance, announcements | Settings | Gray | Urgent |

## Usage Examples

### 1. Creating a Simple Notification

```sql
-- Direct notification creation
SELECT create_notification(
  p_recipient_id := '123e4567-e89b-12d3-a456-426614174000',
  p_title := 'Welcome to Codebility!',
  p_message := 'Your account has been created successfully.',
  p_type := 'info'
);
```

### 2. Project Assignment Notification

```sql
-- This happens automatically via trigger when adding to project_members
INSERT INTO project_members (project_id, codev_id, role)
VALUES ('project-uuid', 'codev-uuid', 'Frontend Developer');
-- Notification is created automatically!
```

### 3. Task Assignment with Metadata

```sql
SELECT create_notification(
  p_recipient_id := 'recipient-uuid',
  p_title := 'New Task Assigned',
  p_message := 'John assigned you a task: Implement login page',
  p_type := 'task',
  p_priority := 'high',
  p_action_url := '/home/tasks/task-123',
  p_metadata := jsonb_build_object(
    'task_id', 'task-123',
    'task_title', 'Implement login page',
    'assigned_by', 'John Doe',
    'due_date', '2024-12-01'
  ),
  p_sender_id := 'sender-uuid',
  p_project_id := 'project-uuid'
);
```

### 4. Batch Notifications for Team

```sql
-- Notify all team members about a meeting
WITH team_members AS (
  SELECT codev_id 
  FROM project_members 
  WHERE project_id = 'project-uuid'
)
SELECT create_notification(
  p_recipient_id := codev_id,
  p_title := 'Team Meeting Scheduled',
  p_message := 'Daily standup at 10:00 AM tomorrow',
  p_type := 'event',
  p_priority := 'normal',
  p_action_url := '/home/calendar',
  p_project_id := 'project-uuid'
) FROM team_members;
```

### 5. Achievement Notification

```sql
-- When a user earns a badge
SELECT create_notification(
  p_recipient_id := 'codev-uuid',
  p_title := 'New Badge Earned! 🎉',
  p_message := 'You earned the "Code Reviewer" badge for completing 50 code reviews',
  p_type := 'achievement',
  p_metadata := jsonb_build_object(
    'badge_id', 'code-reviewer',
    'badge_name', 'Code Reviewer',
    'milestone', 50
  )
);
```

## API Integration

### Server Actions (Next.js)

```typescript
// actions/notifications.ts

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
    
  return { data, error };
}

export async function markNotificationRead(notificationId: string) {
  const { data, error } = await supabase
    .rpc('mark_notification_read', {
      p_notification_id: notificationId,
      p_user_id: getCurrentUserId()
    });
    
  return { data, error };
}

export async function updateNotificationPreferences(preferences: any) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .upsert({
      user_id: getCurrentUserId(),
      ...preferences
    });
    
  return { data, error };
}
```

### Real-time Subscriptions

```typescript
// Subscribe to new notifications
const channel = supabase
  .channel('notifications')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `recipient_id=eq.${userId}`
    },
    (payload) => {
      // Add to notification store
      addNotification(payload.new);
      
      // Show toast notification
      toast.success(payload.new.title);
    }
  )
  .subscribe();
```

## Notification Triggers

### Automatic Notifications

These notifications are triggered automatically by database events:

1. **Project Assignment** - When added to `project_members`
2. **Attendance Warning** - After 3 absences in 30 days
3. **Achievement Unlocked** - When skill level increases
4. **Job Application Status** - When application status changes

### Manual Notifications

These require explicit function calls:

1. **Direct Messages** - When users send messages
2. **System Announcements** - Admin broadcasts
3. **Meeting Invites** - Calendar events
4. **Task Updates** - Task status changes

## User Preferences

Users can control notifications through preferences:

```json
{
  "in_app_enabled": true,
  "email_enabled": true,
  "push_enabled": false,
  "type_preferences": {
    "message": {
      "in_app": true,
      "email": true
    },
    "achievement": {
      "in_app": true,
      "email": false
    }
  },
  "quiet_hours_enabled": true,
  "quiet_hours_start": "22:00",
  "quiet_hours_end": "08:00"
}
```

## Maintenance

### Cleanup Old Notifications

```sql
-- Run periodically to clean up old notifications
SELECT cleanup_old_notifications();
```

### Monitor Queue Status

```sql
-- Check failed notifications
SELECT * FROM notification_queue 
WHERE status = 'failed' 
ORDER BY created_at DESC;
```

## Best Practices

1. **Use Templates** - For consistent messaging
2. **Set Appropriate Priority** - Don't overuse 'urgent'
3. **Include Action URLs** - Help users navigate
4. **Add Metadata** - For rich context
5. **Batch Similar Notifications** - Avoid spam
6. **Respect User Preferences** - Check settings
7. **Test Notifications** - Use the demo component

## Security

- Row Level Security (RLS) enabled
- Users can only see their own notifications
- Admins can create notifications for anyone
- Secure metadata storage with JSONB

## Performance Considerations

- Indexed on recipient_id, created_at, type
- Automatic cleanup of old notifications
- Efficient real-time subscriptions
- Pagination support for large volumes

## Future Enhancements

1. **Push Notifications** - PWA/Mobile support
2. **SMS Notifications** - Critical alerts
3. **Notification Groups** - Aggregate similar items
4. **Read Receipts** - Track engagement
5. **A/B Testing** - Optimize messaging
6. **Analytics** - Notification metrics