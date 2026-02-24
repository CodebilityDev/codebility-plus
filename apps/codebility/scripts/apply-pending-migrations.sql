-- ========================================
-- PENDING MIGRATIONS FOR CLIENT OUTREACH
-- Run this SQL in Supabase SQL Editor
-- ========================================

-- Migration 1: Add job_link column
-- File: 20260220_add_job_link_to_client_outreach.sql
ALTER TABLE public.client_outreach
ADD COLUMN IF NOT EXISTS job_link TEXT;

COMMENT ON COLUMN public.client_outreach.job_link IS 'Optional URL to the job posting or opportunity related to this outreach';

-- Migration 2: Add conversation_image column
-- File: 20260223_add_conversation_image_to_client_outreach.sql
ALTER TABLE public.client_outreach
ADD COLUMN IF NOT EXISTS conversation_image TEXT;

COMMENT ON COLUMN public.client_outreach.conversation_image IS 'URL or base64 data of conversation screenshot with the client';

-- Migration 3: Make client_name optional
-- File: 20260224_make_client_name_optional.sql
ALTER TABLE public.client_outreach
ALTER COLUMN client_name DROP NOT NULL;

COMMENT ON COLUMN public.client_outreach.client_name IS 'Name of the client contacted (optional)';

-- ========================================
-- Verification query - run this to confirm
-- ========================================
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'client_outreach'
ORDER BY ordinal_position;
