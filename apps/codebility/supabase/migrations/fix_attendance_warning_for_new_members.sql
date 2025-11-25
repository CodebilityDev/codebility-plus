-- =============================================
-- FIX ATTENDANCE WARNING FOR NEW MEMBERS
-- =============================================
-- This migration fixes the attendance warning trigger to only check
-- attendance from the date the member joined the project, preventing
-- new members from receiving notifications about missed days before
-- they were even added to the project.
--
-- Issue: When someone is added as a project member, they instantly
-- get notifications for attendance they "missed" on dates before
-- they joined.
--
-- Fix: Only count absences from the member's join date or 30 days ago,
-- whichever is more recent.
-- =============================================

-- Drop the existing trigger function
DROP FUNCTION IF EXISTS notify_attendance_warning() CASCADE;

-- Recreate the function with the fix
CREATE OR REPLACE FUNCTION notify_attendance_warning()
RETURNS TRIGGER AS $$
DECLARE
  v_absent_count INTEGER;
  v_member_join_date DATE;
  v_check_from_date DATE;
BEGIN
  -- Get the date when the member joined this project
  SELECT created_at::date INTO v_member_join_date
  FROM project_members
  WHERE project_id = NEW.project_id
    AND codev_id = NEW.codev_id
  ORDER BY created_at ASC
  LIMIT 1;

  -- If no join date found (shouldn't happen), default to 30 days ago
  IF v_member_join_date IS NULL THEN
    v_member_join_date := CURRENT_DATE - INTERVAL '30 days';
  END IF;

  -- Check absences only from the later of: join date OR 30 days ago
  -- This ensures we don't check attendance before they joined
  v_check_from_date := GREATEST(
    v_member_join_date,
    CURRENT_DATE - INTERVAL '30 days'
  );

  -- Count absences from the check_from_date
  SELECT COUNT(*) INTO v_absent_count
  FROM attendance
  WHERE codev_id = NEW.codev_id
    AND project_id = NEW.project_id
    AND status = 'absent'
    AND date >= v_check_from_date
    AND date <= CURRENT_DATE;

  -- Send warning if absent 3 or more times since they joined
  IF v_absent_count >= 3 AND NEW.status = 'absent' THEN
    PERFORM create_notification(
      p_recipient_id := NEW.codev_id,
      p_title := 'Attendance Warning',
      p_message := format('You have been absent %s times in the last 30 days. Please ensure regular attendance.', v_absent_count),
      p_type := 'warning',
      p_priority := 'high',
      p_metadata := jsonb_build_object(
        'absent_count', v_absent_count,
        'project_id', NEW.project_id,
        'check_from_date', v_check_from_date,
        'member_join_date', v_member_join_date
      ),
      p_project_id := NEW.project_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS trigger_attendance_warning ON attendance;

CREATE TRIGGER trigger_attendance_warning
AFTER INSERT ON attendance
FOR EACH ROW
WHEN (NEW.status = 'absent')
EXECUTE FUNCTION notify_attendance_warning();

-- Add comment for documentation
COMMENT ON FUNCTION notify_attendance_warning() IS 'Sends attendance warning notification after 3 absences in 30 days, but only counts absences from the date the member joined the project';

-- =============================================
-- END OF MIGRATION
-- =============================================
