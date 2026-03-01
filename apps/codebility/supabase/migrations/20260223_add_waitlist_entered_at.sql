-- Add waitlist_entered_at timestamp to applicant table
-- This tracks when an applicant transitions from onboarding to waitlist status

ALTER TABLE public.applicant
ADD COLUMN IF NOT EXISTS waitlist_entered_at TIMESTAMPTZ;

-- Add comment for documentation
COMMENT ON COLUMN public.applicant.waitlist_entered_at IS 'Timestamp when the applicant moved from onboarding to waitlist status';

-- Add index for querying applicants by waitlist entry date
CREATE INDEX IF NOT EXISTS idx_applicant_waitlist_entered
    ON public.applicant(waitlist_entered_at)
    WHERE waitlist_entered_at IS NOT NULL;
