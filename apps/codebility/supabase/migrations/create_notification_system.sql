-- =============================================
-- CODEBILITY NOTIFICATION SYSTEM
-- =============================================
-- This migration creates a comprehensive notification system
-- that integrates with existing tables and supports real-time updates
-- 
-- Author: Codebility Team
-- Created: 2024
-- =============================================

-- =============================================
-- 1. NOTIFICATIONS TABLE
-- =============================================
-- Core table for storing all notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Recipient information
  recipient_id UUID NOT NULL REFERENCES codev(id) ON DELETE CASCADE,
  
  -- Notification content
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Notification categorization
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'info',        -- General information
    'success',     -- Success messages (task completed, achievement unlocked)
    'warning',     -- Warnings (deadline approaching, low attendance)
    'error',       -- Errors (failed actions, system issues)
    'message',     -- Direct messages or chat notifications
    'user',        -- User-related (new team member, profile updates)
    'event',       -- Events (meetings, deadlines, schedules)
    'achievement', -- Gamification (badges, points, level up)
    'job',         -- Job-related (new assignment, application status)
    'attendance',  -- Attendance-related notifications
    'project',     -- Project updates
    'task',        -- Task assignments and updates
    'system'       -- System announcements
  )),
  
  -- Notification metadata
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  read BOOLEAN DEFAULT false,
  archived BOOLEAN DEFAULT false,
  
  -- Optional action URL (where to navigate when clicked)
  action_url TEXT,
  
  -- Additional data (JSON format for flexibility)
  -- Can store: sender_id, project_id, task_id, job_id, etc.
  metadata JSONB DEFAULT '{}',
  
  -- Related entity references (optional, for easier querying)
  sender_id UUID REFERENCES codev(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  job_id UUID REFERENCES job_listings(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  archived_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE -- Optional expiration
);

-- Create indexes for performance
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_read ON notifications(recipient_id, read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_priority ON notifications(priority);
CREATE INDEX idx_notifications_sender ON notifications(sender_id);
CREATE INDEX idx_notifications_project ON notifications(project_id);
CREATE INDEX idx_notifications_job ON notifications(job_id);

-- =============================================
-- 2. NOTIFICATION PREFERENCES TABLE
-- =============================================
-- User preferences for notification settings
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES codev(id) ON DELETE CASCADE,
  
  -- Global toggles
  in_app_enabled BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT false,
  
  -- Email digest preferences
  email_digest BOOLEAN DEFAULT false,
  email_digest_frequency VARCHAR(20) DEFAULT 'daily' CHECK (email_digest_frequency IN ('daily', 'weekly', 'monthly')),
  
  -- Notification type preferences (JSON for flexibility)
  -- Example: {"job": {"in_app": true, "email": true}, "message": {"in_app": true, "email": false}}
  type_preferences JSONB DEFAULT '{
    "info": {"in_app": true, "email": false},
    "success": {"in_app": true, "email": false},
    "warning": {"in_app": true, "email": true},
    "error": {"in_app": true, "email": true},
    "message": {"in_app": true, "email": true},
    "user": {"in_app": true, "email": false},
    "event": {"in_app": true, "email": true},
    "achievement": {"in_app": true, "email": false},
    "job": {"in_app": true, "email": true},
    "attendance": {"in_app": true, "email": true},
    "project": {"in_app": true, "email": true},
    "task": {"in_app": true, "email": true},
    "system": {"in_app": true, "email": true}
  }',
  
  -- Quiet hours (no notifications during these times)
  quiet_hours_enabled BOOLEAN DEFAULT false,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 3. NOTIFICATION TEMPLATES TABLE
-- =============================================
-- Reusable templates for common notifications
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Template identification
  code VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'job_assigned', 'task_completed'
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Template content with placeholders
  -- Example: "You have been assigned to {{project_name}}"
  title_template TEXT NOT NULL,
  message_template TEXT NOT NULL,
  
  -- Default values
  type VARCHAR(50) NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal',
  
  -- Configuration
  active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. NOTIFICATION QUEUE TABLE
-- =============================================
-- Queue for email notifications to be sent
CREATE TABLE IF NOT EXISTS notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  
  -- Delivery information
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('email', 'push', 'sms')),
  recipient_email VARCHAR(255),
  
  -- Status tracking
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
  attempts INTEGER DEFAULT 0,
  
  -- Content (denormalized for queue processing)
  subject TEXT,
  body TEXT,
  
  -- Timestamps
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notification_queue_status ON notification_queue(status, scheduled_for);
CREATE INDEX idx_notification_queue_notification ON notification_queue(notification_id);

-- =============================================
-- 5. HELPER FUNCTIONS
-- =============================================

-- Function to create a notification
CREATE OR REPLACE FUNCTION create_notification(
  p_recipient_id UUID,
  p_title VARCHAR,
  p_message TEXT,
  p_type VARCHAR,
  p_priority VARCHAR DEFAULT 'normal',
  p_action_url TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}',
  p_sender_id UUID DEFAULT NULL,
  p_project_id UUID DEFAULT NULL,
  p_job_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
  v_preferences RECORD;
  v_recent_count INTEGER;
BEGIN
  -- Check for duplicate notification in the last hour
  SELECT COUNT(*) INTO v_recent_count
  FROM notifications
  WHERE recipient_id = p_recipient_id
    AND title = p_title
    AND message = p_message
    AND created_at > NOW() - INTERVAL '1 hour';
  
  -- If duplicate found, return NULL
  IF v_recent_count > 0 THEN
    RETURN NULL;
  END IF;

  -- Check user preferences
  SELECT * INTO v_preferences
  FROM notification_preferences
  WHERE user_id = p_recipient_id;
  
  -- If no preferences exist, create default ones
  IF NOT FOUND THEN
    INSERT INTO notification_preferences (user_id)
    VALUES (p_recipient_id);
    
    SELECT * INTO v_preferences
    FROM notification_preferences
    WHERE user_id = p_recipient_id;
  END IF;
  
  -- Check if in-app notifications are enabled for this type
  IF v_preferences.in_app_enabled AND 
     (v_preferences.type_preferences->p_type->>'in_app')::boolean THEN
    
    -- Create the notification
    INSERT INTO notifications (
      recipient_id, title, message, type, priority,
      action_url, metadata, sender_id, project_id, job_id
    ) VALUES (
      p_recipient_id, p_title, p_message, p_type, p_priority,
      p_action_url, p_metadata, p_sender_id, p_project_id, p_job_id
    ) RETURNING id INTO v_notification_id;
    
    -- Queue email if enabled
    IF v_preferences.email_enabled AND 
       (v_preferences.type_preferences->p_type->>'email')::boolean THEN
      
      INSERT INTO notification_queue (
        notification_id, channel, recipient_email, subject, body
      )
      SELECT 
        v_notification_id,
        'email',
        c.email_address,
        p_title,
        p_message
      FROM codev c
      WHERE c.id = p_recipient_id;
    END IF;
    
    RETURN v_notification_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(
  p_notification_id UUID,
  p_user_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE notifications
  SET read = true, read_at = NOW()
  WHERE id = p_notification_id 
    AND recipient_id = p_user_id
    AND read = false;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_read(
  p_user_id UUID
) RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE notifications
  SET read = true, read_at = NOW()
  WHERE recipient_id = p_user_id
    AND read = false;
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 6. TRIGGER FUNCTIONS
-- =============================================

-- Trigger for job assignment notifications
CREATE OR REPLACE FUNCTION notify_job_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- When a codev is assigned to a project
  IF TG_OP = 'INSERT' THEN
    PERFORM create_notification(
      p_recipient_id := NEW.codev_id,
      p_title := 'New Project Assignment',
      p_message := format('You have been assigned to project: %s', 
        (SELECT name FROM projects WHERE id = NEW.project_id)),
      p_type := 'job',
      p_priority := 'high',
      p_action_url := format('/home/projects/%s', NEW.project_id),
      p_metadata := jsonb_build_object(
        'project_id', NEW.project_id,
        'role', NEW.role
      ),
      p_project_id := NEW.project_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for attendance warnings
CREATE OR REPLACE FUNCTION notify_attendance_warning()
RETURNS TRIGGER AS $$
DECLARE
  v_absent_count INTEGER;
BEGIN
  -- Count absences in the last 30 days
  SELECT COUNT(*) INTO v_absent_count
  FROM attendance
  WHERE codev_id = NEW.codev_id
    AND status = 'absent'
    AND date >= CURRENT_DATE - INTERVAL '30 days';
  
  -- Send warning if absent 3 or more times
  IF v_absent_count >= 3 AND NEW.status = 'absent' THEN
    PERFORM create_notification(
      p_recipient_id := NEW.codev_id,
      p_title := 'Attendance Warning',
      p_message := format('You have been absent %s times in the last 30 days. Please ensure regular attendance.', v_absent_count),
      p_type := 'warning',
      p_priority := 'high',
      p_metadata := jsonb_build_object(
        'absent_count', v_absent_count,
        'project_id', NEW.project_id
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for achievement notifications
CREATE OR REPLACE FUNCTION notify_achievement()
RETURNS TRIGGER AS $$
DECLARE
  v_skill_name VARCHAR;
BEGIN
  -- When a codev reaches a new level
  IF NEW.level > COALESCE(OLD.level, 0) THEN
    SELECT name INTO v_skill_name
    FROM skill_category
    WHERE id = NEW.skill_category_id;
    
    PERFORM create_notification(
      p_recipient_id := NEW.codev_id,
      p_title := 'Achievement Unlocked!',
      p_message := format('Congratulations! You reached level %s in %s', NEW.level, v_skill_name),
      p_type := 'achievement',
      p_priority := 'normal',
      p_metadata := jsonb_build_object(
        'skill_category_id', NEW.skill_category_id,
        'new_level', NEW.level,
        'skill_name', v_skill_name
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 7. CREATE TRIGGERS
-- =============================================

-- Project assignment trigger
CREATE TRIGGER trigger_job_assignment_notification
AFTER INSERT ON project_members
FOR EACH ROW
EXECUTE FUNCTION notify_job_assignment();

-- Attendance warning trigger
CREATE TRIGGER trigger_attendance_warning
AFTER INSERT ON attendance
FOR EACH ROW
WHEN (NEW.status = 'absent')
EXECUTE FUNCTION notify_attendance_warning();

-- Achievement trigger (assuming a codev_skills table exists)
-- CREATE TRIGGER trigger_achievement_notification
-- AFTER UPDATE ON codev_skills
-- FOR EACH ROW
-- EXECUTE FUNCTION notify_achievement();

-- =============================================
-- 8. SAMPLE NOTIFICATION TEMPLATES
-- =============================================

INSERT INTO notification_templates (code, name, title_template, message_template, type, priority)
VALUES 
  -- Job/Project notifications
  ('project_assigned', 'Project Assignment', 'New Project Assignment', 'You have been assigned to {{project_name}} as {{role}}', 'job', 'high'),
  ('project_deadline', 'Project Deadline', 'Project Deadline Approaching', '{{project_name}} deadline is in {{days}} days', 'warning', 'high'),
  
  -- Task notifications
  ('task_assigned', 'Task Assignment', 'New Task Assigned', '{{assigner}} assigned you a task: {{task_title}}', 'task', 'normal'),
  ('task_completed', 'Task Completion', 'Task Completed', '{{completer}} completed task: {{task_title}}', 'success', 'normal'),
  
  -- Attendance notifications
  ('attendance_reminder', 'Attendance Reminder', 'Mark Your Attendance', 'Don''t forget to mark your attendance for today', 'attendance', 'normal'),
  ('attendance_warning', 'Attendance Warning', 'Low Attendance Alert', 'Your attendance is below {{percentage}}% this month', 'warning', 'high'),
  
  -- Achievement notifications
  ('badge_earned', 'Badge Earned', 'New Badge Earned!', 'Congratulations! You earned the {{badge_name}} badge', 'achievement', 'normal'),
  ('level_up', 'Level Up', 'Level Up!', 'You reached level {{level}} in {{skill}}', 'achievement', 'normal'),
  
  -- System notifications
  ('welcome', 'Welcome Message', 'Welcome to Codebility!', 'Your account has been created successfully. Start exploring!', 'info', 'normal'),
  ('system_maintenance', 'System Maintenance', 'Scheduled Maintenance', 'System will be under maintenance on {{date}} from {{start_time}} to {{end_time}}', 'system', 'high')
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- 9. ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (recipient_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (recipient_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (recipient_id::text = auth.uid()::text);

-- Policies for notification preferences
CREATE POLICY "Users can view their own preferences"
  ON notification_preferences FOR SELECT
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own preferences"
  ON notification_preferences FOR UPDATE
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can insert their own preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

-- Admin policies (assuming role_id 1 is admin)
CREATE POLICY "Admins can create notifications for anyone"
  ON notifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM codev 
      WHERE id::text = auth.uid()::text 
      AND role_id = 1
    )
  );

-- =============================================
-- 10. CLEANUP FUNCTION
-- =============================================

-- Function to clean up old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Delete read notifications older than 90 days
  DELETE FROM notifications
  WHERE read = true 
    AND created_at < NOW() - INTERVAL '90 days';
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  -- Delete expired notifications
  DELETE FROM notifications
  WHERE expires_at IS NOT NULL 
    AND expires_at < NOW();
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 11. COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE notifications IS 'Core table for storing all user notifications';
COMMENT ON TABLE notification_preferences IS 'User preferences for notification delivery';
COMMENT ON TABLE notification_templates IS 'Reusable templates for common notifications';
COMMENT ON TABLE notification_queue IS 'Queue for processing email/push notifications';

COMMENT ON COLUMN notifications.type IS 'Categorization of notification for filtering and styling';
COMMENT ON COLUMN notifications.priority IS 'Urgency level: low, normal, high, urgent';
COMMENT ON COLUMN notifications.metadata IS 'Flexible JSON storage for additional context';
COMMENT ON COLUMN notification_preferences.type_preferences IS 'Per-type delivery preferences';

-- =============================================
-- END OF NOTIFICATION SYSTEM MIGRATION
-- =============================================