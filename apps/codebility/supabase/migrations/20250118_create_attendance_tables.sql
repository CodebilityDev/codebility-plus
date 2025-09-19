-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codev_id UUID NOT NULL REFERENCES codev(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'holiday', 'weekend')),
    check_in TIME,
    check_out TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(codev_id, project_id, date)
);

-- Create attendance_points table for tracking points
CREATE TABLE IF NOT EXISTS attendance_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codev_id UUID NOT NULL REFERENCES codev(id) ON DELETE CASCADE,
    points INTEGER NOT NULL DEFAULT 0,
    last_updated DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(codev_id)
);

-- Create attendance_summary table
CREATE TABLE IF NOT EXISTS attendance_summary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codev_id UUID NOT NULL REFERENCES codev(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL CHECK (year >= 2024),
    total_days INTEGER NOT NULL DEFAULT 0,
    present_days INTEGER NOT NULL DEFAULT 0,
    absent_days INTEGER NOT NULL DEFAULT 0,
    late_days INTEGER NOT NULL DEFAULT 0,
    points_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(codev_id, project_id, month, year)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_project_date ON attendance(project_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_codev_date ON attendance(codev_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_summary_project_period ON attendance_summary(project_id, year, month);

-- Enable RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_summary ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for attendance table
CREATE POLICY "Team leads can manage project attendance" ON attendance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM project_members pm
            JOIN codev c ON c.id = pm.codev_id
            WHERE pm.project_id = attendance.project_id
            AND pm.role = 'team_leader'
            AND c.email_address = auth.email()
        )
    );

CREATE POLICY "Members can view their own attendance" ON attendance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM codev c
            WHERE c.id = attendance.codev_id
            AND c.email_address = auth.email()
        )
    );

CREATE POLICY "Members can view project attendance" ON attendance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM project_members pm
            JOIN codev c ON c.id = pm.codev_id
            WHERE pm.project_id = attendance.project_id
            AND c.email_address = auth.email()
        )
    );

-- Create RLS policies for attendance_points table
CREATE POLICY "Users can view their own points" ON attendance_points
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM codev c
            WHERE c.id = attendance_points.codev_id
            AND c.email_address = auth.email()
        )
    );

CREATE POLICY "Team leads can manage points" ON attendance_points
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM project_members pm
            JOIN codev c ON c.id = pm.codev_id
            WHERE pm.role = 'team_leader'
            AND c.email_address = auth.email()
        )
    );

-- Create RLS policies for attendance_summary table
CREATE POLICY "Members can view their own summary" ON attendance_summary
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM codev c
            WHERE c.id = attendance_summary.codev_id
            AND c.email_address = auth.email()
        )
    );

CREATE POLICY "Members can view project summaries" ON attendance_summary
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM project_members pm
            JOIN codev c ON c.id = pm.codev_id
            WHERE pm.project_id = attendance_summary.project_id
            AND c.email_address = auth.email()
        )
    );

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_points_updated_at BEFORE UPDATE ON attendance_points
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_summary_updated_at BEFORE UPDATE ON attendance_summary
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();