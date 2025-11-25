-- Migration: Create survey system
-- Description: Creates table for managing surveys displayed to users

CREATE TABLE IF NOT EXISTS surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  survey_url VARCHAR(500) NOT NULL, -- URL to external survey (Google Forms, Typeform, etc.)
  type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'feedback', 'satisfaction', 'research', 'onboarding')),
  image_url VARCHAR(500), -- Optional survey image stored in Supabase bucket
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1, -- Higher number = higher priority
  target_audience VARCHAR(50) DEFAULT 'all' CHECK (target_audience IN ('all', 'codev', 'intern', 'hr', 'admin')),
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP, -- Optional end date for survey
  created_by UUID REFERENCES codev(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  -- Add index for performance
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date > start_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_surveys_active ON surveys(is_active);
CREATE INDEX IF NOT EXISTS idx_surveys_priority ON surveys(priority DESC);
CREATE INDEX IF NOT EXISTS idx_surveys_dates ON surveys(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_surveys_target_audience ON surveys(target_audience);

-- Add RLS policies (Row Level Security)
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read active surveys
CREATE POLICY "Anyone can view active surveys" ON surveys
  FOR SELECT USING (is_active = true);

-- Policy: Only admins can manage surveys (assuming role_id 1 is admin)
CREATE POLICY "Admins can manage surveys" ON surveys
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM codev
      WHERE codev.id = auth.uid()
      AND codev.role_id = 1
    )
  );
