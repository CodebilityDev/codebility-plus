-- =============================================
-- FIX NOTIFICATION SYSTEM RLS POLICIES
-- =============================================
-- This migration fixes the row-level security policies
-- to allow users to create their own notifications
-- =============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view their own preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Admins can create notifications for anyone" ON notifications;

-- Disable RLS temporarily to fix issues
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON notifications TO authenticated;
GRANT ALL ON notification_preferences TO authenticated;
GRANT ALL ON notification_queue TO authenticated;
GRANT ALL ON notification_templates TO authenticated;

-- Grant usage on sequences if any
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION create_notification TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notification_read TO authenticated;
GRANT EXECUTE ON FUNCTION mark_all_notifications_read TO authenticated;

-- Re-enable RLS with proper policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

-- Create new policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (recipient_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true); -- Allow all inserts through the function

-- Create policies for notification preferences
CREATE POLICY "Users can view their own preferences"
  ON notification_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own preferences"
  ON notification_preferences FOR ALL
  USING (user_id = auth.uid());

-- Create policies for notification queue
CREATE POLICY "System can manage notification queue"
  ON notification_queue FOR ALL
  USING (true); -- Allow system to manage queue

-- Update the create_notification function to handle auth better
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
     COALESCE((v_preferences.type_preferences->p_type->>'in_app')::boolean, true) THEN
    
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
       COALESCE((v_preferences.type_preferences->p_type->>'email')::boolean, true) THEN
      
      BEGIN
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
      EXCEPTION WHEN OTHERS THEN
        -- Log error but don't fail the notification
        RAISE WARNING 'Failed to queue email: %', SQLERRM;
      END;
    END IF;
    
    RETURN v_notification_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_notification TO authenticated;

-- =============================================
-- END OF FIX MIGRATION
-- =============================================