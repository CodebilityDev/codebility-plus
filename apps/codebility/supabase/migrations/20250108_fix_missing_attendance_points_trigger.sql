-- Migration: Fix missing attendance points trigger
-- Created: 2025-01-08
-- Description: Add the missing trigger to activate automatic attendance points calculation

-- The function update_attendance_points_on_attendance_change() already exists
-- but no trigger was created to execute it. This migration fixes that critical issue.

BEGIN;

-- Create the missing trigger for automatic attendance points calculation
CREATE TRIGGER attendance_points_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON attendance
    FOR EACH ROW 
    EXECUTE FUNCTION update_attendance_points_on_attendance_change();

-- Add documentation comments
COMMENT ON FUNCTION update_attendance_points_on_attendance_change() IS 
'Automatically calculates attendance points (2 points per day) when attendance records are modified. 
Points are awarded for present, late, and excused status. Points are deducted when status changes 
from point-earning to non-point-earning status or when records are deleted.
Trigger: attendance_points_trigger';

COMMENT ON TRIGGER attendance_points_trigger ON attendance IS 
'Executes update_attendance_points_on_attendance_change() function to automatically calculate 
attendance points when attendance records are inserted, updated, or deleted.';

-- Add performance indexes for attendance points if they don't exist
CREATE INDEX IF NOT EXISTS idx_attendance_points_points_desc 
    ON attendance_points(points DESC);

CREATE INDEX IF NOT EXISTS idx_attendance_points_codev_last_updated 
    ON attendance_points(codev_id, last_updated);

-- Add index for common attendance queries
CREATE INDEX IF NOT EXISTS idx_attendance_codev_date_status 
    ON attendance(codev_id, date, status);

CREATE INDEX IF NOT EXISTS idx_attendance_project_date_status 
    ON attendance(project_id, date, status);

COMMIT;

-- Verification queries (commented out - for manual testing):
-- SELECT * FROM information_schema.triggers WHERE trigger_name = 'attendance_points_trigger';
-- SELECT * FROM pg_indexes WHERE tablename = 'attendance_points';