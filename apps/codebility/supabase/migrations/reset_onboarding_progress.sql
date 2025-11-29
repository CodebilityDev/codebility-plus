-- Reset Onboarding Progress Script
-- This script resets an applicant's onboarding progress completely
-- Replace 'YOUR_APPLICANT_ID' with the actual applicant ID

-- Step 1: Reset all video progress to incomplete
UPDATE public.onboarding_videos
SET
    completed = FALSE,
    watched_duration = 0,
    completed_at = NULL,
    updated_at = NOW()
WHERE applicant_id = 'YOUR_APPLICANT_ID';

-- Step 2: Reset quiz and commitment data in applicant table
UPDATE public.applicant
SET
    quiz_score = NULL,
    quiz_total = NULL,
    quiz_passed = FALSE,
    quiz_completed_at = NULL,
    signature_data = NULL,
    commitment_signed_at = NULL,
    can_do_mobile = NULL,
    updated_at = NOW()
WHERE id = 'YOUR_APPLICANT_ID';

-- Step 3: Verify the reset (optional - for checking)
-- SELECT * FROM public.onboarding_videos WHERE applicant_id = 'YOUR_APPLICANT_ID';
-- SELECT quiz_score, quiz_total, quiz_passed, quiz_completed_at, commitment_signed_at
-- FROM public.applicant WHERE id = 'YOUR_APPLICANT_ID';
