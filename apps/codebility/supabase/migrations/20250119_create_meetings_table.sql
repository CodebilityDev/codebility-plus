-- Create meetings table to track scheduled meetings
CREATE TABLE IF NOT EXISTS meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    meeting_type TEXT NOT NULL CHECK (meeting_type IN ('standup', 'weekly', 'sprint', 'review', 'other')),
    scheduled_by UUID NOT NULL REFERENCES codev(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern TEXT CHECK (recurrence_pattern IN ('daily', 'weekly', 'biweekly', 'monthly') OR recurrence_pattern IS NULL),
    recurrence_end_date DATE,
    meeting_link TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meeting_attendance table to track who attended
CREATE TABLE IF NOT EXISTS meeting_attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    codev_id UUID NOT NULL REFERENCES codev(id) ON DELETE CASCADE,
    attendance_status TEXT NOT NULL DEFAULT 'pending' CHECK (attendance_status IN ('pending', 'present', 'absent', 'excused')),
    join_time TIMESTAMP WITH TIME ZONE,
    leave_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(meeting_id, codev_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_meetings_project_date ON meetings(project_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled_by ON meetings(scheduled_by);
CREATE INDEX IF NOT EXISTS idx_meeting_attendance_meeting ON meeting_attendance(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_attendance_codev ON meeting_attendance(codev_id);

-- Enable RLS
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_attendance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meetings table
-- Team leads can create and manage meetings for their projects
CREATE POLICY "Team leads can manage project meetings" ON meetings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM project_members pm
            JOIN codev c ON c.id = pm.codev_id
            WHERE pm.project_id = meetings.project_id
            AND pm.role = 'team_leader'
            AND c.email_address = auth.email()
        )
    );

-- Project members can view meetings
CREATE POLICY "Project members can view meetings" ON meetings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM project_members pm
            JOIN codev c ON c.id = pm.codev_id
            WHERE pm.project_id = meetings.project_id
            AND c.email_address = auth.email()
        )
    );

-- RLS Policies for meeting_attendance table
-- Team leads can manage attendance
CREATE POLICY "Team leads can manage meeting attendance" ON meeting_attendance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM meetings m
            JOIN project_members pm ON pm.project_id = m.project_id
            JOIN codev c ON c.id = pm.codev_id
            WHERE m.id = meeting_attendance.meeting_id
            AND pm.role = 'team_leader'
            AND c.email_address = auth.email()
        )
    );

-- Members can view their own attendance
CREATE POLICY "Members can view own meeting attendance" ON meeting_attendance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM codev c
            WHERE c.id = meeting_attendance.codev_id
            AND c.email_address = auth.email()
        )
    );

-- Members can view project meeting attendance
CREATE POLICY "Members can view project meeting attendance" ON meeting_attendance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM meetings m
            JOIN project_members pm ON pm.project_id = m.project_id
            JOIN codev c ON c.id = pm.codev_id
            WHERE m.id = meeting_attendance.meeting_id
            AND c.email_address = auth.email()
        )
    );

-- Function to automatically sync attendance when meeting is marked complete
CREATE OR REPLACE FUNCTION sync_meeting_attendance_to_daily()
RETURNS TRIGGER AS $$
BEGIN
    -- When a meeting is marked as completed, update daily attendance
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Update attendance records for all participants
        INSERT INTO attendance (codev_id, project_id, date, status, check_in, check_out)
        SELECT 
            ma.codev_id,
            NEW.project_id,
            NEW.scheduled_date,
            CASE 
                WHEN ma.attendance_status = 'present' THEN 'present'::text
                WHEN ma.attendance_status = 'excused' THEN 'present'::text
                ELSE 'absent'::text
            END,
            ma.join_time::time,
            ma.leave_time::time
        FROM meeting_attendance ma
        WHERE ma.meeting_id = NEW.id
        ON CONFLICT (codev_id, project_id, date) 
        DO UPDATE SET
            status = EXCLUDED.status,
            check_in = COALESCE(attendance.check_in, EXCLUDED.check_in),
            check_out = COALESCE(EXCLUDED.check_out, attendance.check_out),
            updated_at = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to sync attendance
CREATE TRIGGER sync_meeting_to_attendance
    AFTER UPDATE ON meetings
    FOR EACH ROW 
    EXECUTE FUNCTION sync_meeting_attendance_to_daily();

-- Update trigger for timestamps
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meeting_attendance_updated_at BEFORE UPDATE ON meeting_attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create recurring meetings
CREATE OR REPLACE FUNCTION create_recurring_meetings(
    p_meeting_id UUID,
    p_end_date DATE
)
RETURNS VOID AS $$
DECLARE
    v_meeting RECORD;
    v_current_date DATE;
    v_interval INTERVAL;
BEGIN
    -- Get the original meeting
    SELECT * INTO v_meeting FROM meetings WHERE id = p_meeting_id;
    
    IF v_meeting.is_recurring AND v_meeting.recurrence_pattern IS NOT NULL THEN
        -- Set the interval based on pattern
        v_interval := CASE v_meeting.recurrence_pattern
            WHEN 'daily' THEN '1 day'::interval
            WHEN 'weekly' THEN '7 days'::interval
            WHEN 'biweekly' THEN '14 days'::interval
            WHEN 'monthly' THEN '1 month'::interval
        END;
        
        -- Start from the next occurrence
        v_current_date := v_meeting.scheduled_date + v_interval;
        
        -- Create meetings until end date
        WHILE v_current_date <= COALESCE(p_end_date, v_meeting.recurrence_end_date, v_meeting.scheduled_date + '3 months'::interval) LOOP
            INSERT INTO meetings (
                project_id, title, description, meeting_type, 
                scheduled_by, scheduled_date, scheduled_time, 
                duration_minutes, is_recurring, recurrence_pattern,
                meeting_link
            )
            VALUES (
                v_meeting.project_id, v_meeting.title, v_meeting.description, 
                v_meeting.meeting_type, v_meeting.scheduled_by, v_current_date, 
                v_meeting.scheduled_time, v_meeting.duration_minutes, 
                false, NULL, v_meeting.meeting_link
            );
            
            v_current_date := v_current_date + v_interval;
        END LOOP;
    END IF;
END;
$$ LANGUAGE plpgsql;