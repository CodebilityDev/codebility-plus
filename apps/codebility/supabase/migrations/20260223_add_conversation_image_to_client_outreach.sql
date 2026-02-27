-- Add conversation_image field to client_outreach table
-- This allows admins to upload screenshots of conversations with potential clients

ALTER TABLE public.client_outreach
ADD COLUMN IF NOT EXISTS conversation_image TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.client_outreach.conversation_image IS 'URL or base64 data of conversation screenshot with the client';
