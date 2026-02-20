-- Add job_link column to client_outreach table
-- This allows admins to optionally provide a job posting link instead of or in addition to email

ALTER TABLE client_outreach
ADD COLUMN IF NOT EXISTS job_link TEXT;

-- Add comment for documentation
COMMENT ON COLUMN client_outreach.job_link IS 'Optional URL to the job posting or opportunity related to this outreach';
