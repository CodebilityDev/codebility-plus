-- Make client_name optional in client_outreach table
-- This allows admins to create outreach records without necessarily having a specific client name

ALTER TABLE public.client_outreach
ALTER COLUMN client_name DROP NOT NULL;

-- Update comment for documentation
COMMENT ON COLUMN public.client_outreach.client_name IS 'Name of the client contacted (optional)';
