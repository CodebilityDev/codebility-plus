-- =============================================================================
-- Migration: Fix admin_users View Privilege Escalation (Role 4 is Intern)
-- Date: 2026-08-16
--
-- Description:
-- Updates public.admin_users view definition so that it strictly returns users
-- with role_id = 1 (Admin) and application_status = 'passed'.
-- Matches exact column schema signature of the live view.
-- =============================================================================

CREATE OR REPLACE VIEW public.admin_users AS
SELECT 
    codev.id,
    codev.email_address,
    codev.first_name,
    codev.last_name,
    codev.role_id
FROM public.codev
WHERE codev.role_id = 1 
  AND codev.application_status = 'passed';
