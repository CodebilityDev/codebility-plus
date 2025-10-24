-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  duration VARCHAR(100) NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  category VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES codev(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_created_by ON services(created_by);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for services table
CREATE POLICY "Services are viewable by authenticated users" ON services
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can insert services" ON services
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM codev 
      WHERE id = auth.uid() 
      AND role_id = 1
    )
  );

CREATE POLICY "Only admins can update services" ON services
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM codev 
      WHERE id = auth.uid() 
      AND role_id = 1
    )
  );

CREATE POLICY "Only admins can delete services" ON services
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM codev 
      WHERE id = auth.uid() 
      AND role_id = 1
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();