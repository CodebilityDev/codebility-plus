-- Create client outreach tracker table
-- This tracks how many clients each admin has reached out to per week

CREATE TABLE IF NOT EXISTS client_outreach (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES codev(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_company TEXT,
  outreach_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  week_start DATE NOT NULL, -- Monday of the week this outreach belongs to
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for fast lookups by admin and week
CREATE INDEX IF NOT EXISTS idx_client_outreach_admin_week
  ON client_outreach(admin_id, week_start);

-- Create index for date-based queries
CREATE INDEX IF NOT EXISTS idx_client_outreach_date
  ON client_outreach(outreach_date);

-- Add RLS policies
ALTER TABLE client_outreach ENABLE ROW LEVEL SECURITY;

-- Admins can view all outreach records
CREATE POLICY "Admins can view all client_outreach"
  ON client_outreach FOR SELECT
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Admins can insert their own outreach records
CREATE POLICY "Admins can insert own client_outreach"
  ON client_outreach FOR INSERT
  TO public
  WITH CHECK (
    auth.uid() IN (SELECT id FROM admin_users)
    AND admin_id = auth.uid()
  );

-- Admins can update their own outreach records
CREATE POLICY "Admins can update own client_outreach"
  ON client_outreach FOR UPDATE
  TO public
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
    AND admin_id = auth.uid()
  );

-- Admins can delete their own outreach records
CREATE POLICY "Admins can delete own client_outreach"
  ON client_outreach FOR DELETE
  TO public
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
    AND admin_id = auth.uid()
  );

-- Create a helper function to get the Monday of a given date
CREATE OR REPLACE FUNCTION get_week_start(input_date DATE)
RETURNS DATE
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT input_date - (EXTRACT(DOW FROM input_date)::INTEGER - 1) * INTERVAL '1 day';
$$;

-- Create a trigger to automatically set week_start before insert
CREATE OR REPLACE FUNCTION set_week_start()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.week_start := get_week_start(NEW.outreach_date::DATE);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER client_outreach_set_week_start
  BEFORE INSERT OR UPDATE ON client_outreach
  FOR EACH ROW
  EXECUTE FUNCTION set_week_start();

-- Comments for documentation
COMMENT ON TABLE client_outreach IS 'Tracks client outreach activities by admins on a weekly basis';
COMMENT ON COLUMN client_outreach.week_start IS 'Automatically set to the Monday of the week when outreach was made';
COMMENT ON COLUMN client_outreach.admin_id IS 'Admin who made the outreach';
COMMENT ON COLUMN client_outreach.client_name IS 'Name of the client contacted';
COMMENT ON COLUMN client_outreach.outreach_date IS 'When the outreach was made';
