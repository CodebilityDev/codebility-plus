-- =============================================================================
-- Fix role_id for accepted developers
--
-- The accept flow was incorrectly assigning role_id: 4 (Super Admin/Intern)
-- instead of role_id: 10 (Codev). This migration:
--   1. Fixes existing accepted devs who have role_id 4 → set them to role_id 10
--   2. Does NOT touch role_id 1 (Admin) users — they stay as Admin
--   3. Only affects rows where application_status = 'passed'
--
-- Role ID mapping (confirmed from codebase usage):
--   1  = Admin
--   4  = Super Admin / Intern (over-privileged, was assigned by mistake in accept flow)
--   5  = Mentor
--   7  = Applicant
--   10 = Codev (intended role for accepted developers)
-- =============================================================================

-- Fix existing accepted developers who were given the wrong role
UPDATE public.codev
SET role_id = 10,
    updated_at = NOW()
WHERE application_status = 'passed'
  AND role_id = 4;

-- Log what was changed
SELECT 'Fixed role_id for accepted devs' AS action,
       COUNT(*) AS rows_affected
FROM public.codev
WHERE application_status = 'passed'
  AND role_id = 10;