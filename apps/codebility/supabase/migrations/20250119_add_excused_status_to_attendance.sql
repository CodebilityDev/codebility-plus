-- Add 'excused' as a valid status to the attendance table
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_status_check;
ALTER TABLE attendance ADD CONSTRAINT attendance_status_check 
  CHECK (status IN ('present', 'absent', 'late', 'holiday', 'weekend', 'excused'));

-- Update the trigger to handle excused status for attendance points
-- Excused attendance should count as present for attendance tracking purposes
CREATE OR REPLACE FUNCTION update_attendance_points_on_attendance_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT or UPDATE to present/late/excused
  IF (TG_OP = 'INSERT' AND NEW.status IN ('present', 'late', 'excused')) OR
     (TG_OP = 'UPDATE' AND OLD.status NOT IN ('present', 'late', 'excused') AND NEW.status IN ('present', 'late', 'excused')) THEN
    -- Add 2 points
    INSERT INTO attendance_points (codev_id, points, last_updated)
    VALUES (NEW.codev_id, 2, CURRENT_DATE)
    ON CONFLICT (codev_id) 
    DO UPDATE SET 
      points = attendance_points.points + 2,
      last_updated = CURRENT_DATE,
      updated_at = NOW();
      
  -- Handle UPDATE from present/late/excused to other status
  ELSIF TG_OP = 'UPDATE' AND OLD.status IN ('present', 'late', 'excused') AND NEW.status NOT IN ('present', 'late', 'excused') THEN
    -- Deduct 2 points
    UPDATE attendance_points 
    SET 
      points = GREATEST(0, points - 2),
      last_updated = CURRENT_DATE,
      updated_at = NOW()
    WHERE codev_id = NEW.codev_id;
    
  -- Handle DELETE of present/late/excused record
  ELSIF TG_OP = 'DELETE' AND OLD.status IN ('present', 'late', 'excused') THEN
    -- Deduct 2 points
    UPDATE attendance_points 
    SET 
      points = GREATEST(0, points - 2),
      last_updated = CURRENT_DATE,
      updated_at = NOW()
    WHERE codev_id = OLD.codev_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;