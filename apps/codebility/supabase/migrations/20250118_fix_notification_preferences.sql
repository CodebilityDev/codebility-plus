-- Fix notification preferences duplicate key issue
-- This happens when multiple attendance records try to create preferences simultaneously

-- First, create notification preferences for all existing users who don't have them
INSERT INTO notification_preferences (user_id)
SELECT DISTINCT c.id
FROM codev c
LEFT JOIN notification_preferences np ON c.id = np.user_id
WHERE np.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Modify the create_notification function to handle conflicts better
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
  v_should_send_email BOOLEAN := false;
BEGIN
  -- Check user preferences
  SELECT * INTO v_preferences
  FROM notification_preferences
  WHERE user_id = p_recipient_id;
  
  -- If no preferences exist, create default ones with conflict handling
  IF NOT FOUND THEN
    INSERT INTO notification_preferences (user_id)
    VALUES (p_recipient_id)
    ON CONFLICT (user_id) DO NOTHING;
    
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
        notification_id,
        channel,
        status,
        recipient_id
      ) VALUES (
        v_notification_id,
        'email',
        'pending',
        p_recipient_id
      );
      
      v_should_send_email := true;
    END IF;
    
    -- Queue push notification if enabled
    IF v_preferences.push_enabled AND 
       (v_preferences.type_preferences->p_type->>'push')::boolean THEN
      
      INSERT INTO notification_queue (
        notification_id,
        channel,
        status,
        recipient_id
      ) VALUES (
        v_notification_id,
        'push',
        'pending',
        p_recipient_id
      );
    END IF;
    
  END IF;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also disable the attendance warning trigger temporarily if it's causing issues
ALTER TABLE attendance DISABLE TRIGGER trigger_attendance_warning;