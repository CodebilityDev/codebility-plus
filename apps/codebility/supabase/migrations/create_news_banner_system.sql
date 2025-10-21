-- Migration: Create news banner system
-- Description: Creates table for managing news banners displayed on the home page

CREATE TABLE IF NOT EXISTS news_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error', 'announcement')),
  image_url VARCHAR(500), -- Optional banner image stored in Supabase bucket
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1, -- Higher number = higher priority
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP, -- Optional end date for banner
  created_by UUID REFERENCES codev(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  -- Add index for performance
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date > start_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_banners_active ON news_banners(is_active);
CREATE INDEX IF NOT EXISTS idx_news_banners_priority ON news_banners(priority DESC);
CREATE INDEX IF NOT EXISTS idx_news_banners_dates ON news_banners(start_date, end_date);

-- Insert default example banner (optional)
INSERT INTO news_banners (title, message, type, priority) 
VALUES (
  'Welcome to Codebility!', 
  'Check out our latest updates and announcements.',
  'info',
  1
);

-- Add RLS policies (Row Level Security)
ALTER TABLE news_banners ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read active banners
CREATE POLICY "Anyone can view active news banners" ON news_banners
  FOR SELECT USING (is_active = true);

-- Policy: Only admins can manage banners (assuming role_id 1 is admin)
CREATE POLICY "Admins can manage news banners" ON news_banners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM codev 
      WHERE codev.id = auth.uid() 
      AND codev.role_id = 1
    )
  );