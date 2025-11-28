-- Add quiz and commitment fields to applicant table

-- Add quiz score fields
ALTER TABLE public.applicant
ADD COLUMN IF NOT EXISTS quiz_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS quiz_total INTEGER DEFAULT 0;

-- Add signature and commitment fields
ALTER TABLE public.applicant
ADD COLUMN IF NOT EXISTS signature_data TEXT,
ADD COLUMN IF NOT EXISTS commitment_signed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS can_do_mobile BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS quiz_passed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS quiz_completed_at TIMESTAMPTZ;

-- Add comments for documentation
COMMENT ON COLUMN public.applicant.quiz_score IS 'Score achieved on the onboarding quiz';
COMMENT ON COLUMN public.applicant.quiz_total IS 'Total possible points on the onboarding quiz';
COMMENT ON COLUMN public.applicant.signature_data IS 'Base64 encoded signature image data';
COMMENT ON COLUMN public.applicant.commitment_signed_at IS 'Timestamp when the commitment agreement was signed';
COMMENT ON COLUMN public.applicant.can_do_mobile IS 'Whether the applicant can do mobile development';
COMMENT ON COLUMN public.applicant.quiz_passed IS 'Whether the applicant passed the quiz (70%+)';
COMMENT ON COLUMN public.applicant.quiz_completed_at IS 'Timestamp when the quiz was completed';

-- Optional: Add index for querying applicants who have completed onboarding
CREATE INDEX IF NOT EXISTS idx_applicant_commitment_signed
    ON public.applicant(commitment_signed_at)
    WHERE commitment_signed_at IS NOT NULL;

-- Optional: Add index for querying applicants with mobile development skills
CREATE INDEX IF NOT EXISTS idx_applicant_mobile_developers
    ON public.applicant(can_do_mobile)
    WHERE can_do_mobile = TRUE;
