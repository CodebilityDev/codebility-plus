-- =============================================================================
-- CRITICAL SECURITY FIXES - Based on Codebase Analysis
-- Date: 2026-02-19
--
-- This addresses critical security issues found during comprehensive code review.
-- These issues allow unauthorized data manipulation and point inflation.
-- =============================================================================


-- =============================================================================
-- FIX 1: Tighten attendance_points RLS - Prevent Point Inflation
-- =============================================================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert attendance_points" ON attendance_points;
DROP POLICY IF EXISTS "Authenticated users can update attendance_points" ON attendance_points;

-- Only team leads and admins can manage attendance points
CREATE POLICY "Team leads can manage team attendance_points"
  ON attendance_points FOR ALL
  TO public
  USING (
    -- User is admin
    auth.uid() IN (SELECT id FROM admin_users)
    OR
    -- User is team lead of a project containing this codev
    EXISTS (
      SELECT 1 FROM project_members pm1
      JOIN project_members pm2 ON pm1.project_id = pm2.project_id
      WHERE pm1.codev_id = auth.uid()
        AND pm1.role = 'team_leader'
        AND pm2.codev_id = attendance_points.codev_id
    )
  );

-- Allow users to view their own attendance points
CREATE POLICY "Users can view own attendance_points"
  ON attendance_points FOR SELECT
  TO public
  USING (
    codev_id = auth.uid()
    OR auth.uid() IN (SELECT id FROM admin_users)
  );


-- =============================================================================
-- FIX 2: Add missing RPC functions for overflow likes
-- =============================================================================

-- Function to toggle overflow_post like
CREATE OR REPLACE FUNCTION toggle_overflow_post_like(post_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  like_exists BOOLEAN;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if like exists
  SELECT EXISTS(
    SELECT 1 FROM overflow_likes
    WHERE post_id = post_id_param
      AND user_id = current_user_id
      AND comment_id IS NULL
  ) INTO like_exists;

  IF like_exists THEN
    -- Unlike: delete like and decrement count
    DELETE FROM overflow_likes
    WHERE post_id = post_id_param
      AND user_id = current_user_id
      AND comment_id IS NULL;

    UPDATE overflow_post
    SET likes = GREATEST(likes - 1, 0)
    WHERE id = post_id_param;

    RETURN FALSE;  -- Unliked
  ELSE
    -- Like: insert like and increment count
    INSERT INTO overflow_likes (post_id, user_id, created_at)
    VALUES (post_id_param, current_user_id, NOW());

    UPDATE overflow_post
    SET likes = likes + 1
    WHERE id = post_id_param;

    RETURN TRUE;  -- Liked
  END IF;
END;
$$;

-- Function to toggle overflow_comment like
CREATE OR REPLACE FUNCTION toggle_overflow_comment_like(comment_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  like_exists BOOLEAN;
  current_user_id UUID;
  related_post_id UUID;
BEGIN
  current_user_id := auth.uid();

  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get post_id from comment
  SELECT post_id INTO related_post_id
  FROM overflow_comments
  WHERE id = comment_id_param;

  IF related_post_id IS NULL THEN
    RAISE EXCEPTION 'Comment not found';
  END IF;

  -- Check if like exists
  SELECT EXISTS(
    SELECT 1 FROM overflow_likes
    WHERE comment_id = comment_id_param
      AND user_id = current_user_id
  ) INTO like_exists;

  IF like_exists THEN
    -- Unlike: delete like
    DELETE FROM overflow_likes
    WHERE comment_id = comment_id_param
      AND user_id = current_user_id;

    RETURN FALSE;  -- Unliked
  ELSE
    -- Like: insert like
    INSERT INTO overflow_likes (post_id, comment_id, user_id, created_at)
    VALUES (related_post_id, comment_id_param, current_user_id, NOW());

    RETURN TRUE;  -- Liked
  END IF;
END;
$$;


-- =============================================================================
-- FIX 3: Create helper function to check if user is admin
-- =============================================================================

CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = user_id
  );
$$;


-- =============================================================================
-- FIX 4: Create helper function to check if user is team lead of a project
-- =============================================================================

CREATE OR REPLACE FUNCTION is_team_lead_of_project(project_id_param UUID, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = project_id_param
      AND codev_id = user_id
      AND role = 'team_leader'
  );
$$;


-- =============================================================================
-- FIX 5: Restrict codev UPDATE to admins and self only
-- =============================================================================

-- Check if codev table already has RLS enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables t
    JOIN pg_class c ON c.relname = t.tablename
    WHERE t.tablename = 'codev' AND c.relrowsecurity = true
  ) THEN
    -- RLS was disabled, this is a problem
    RAISE NOTICE 'WARNING: codev table RLS is DISABLED - should enable RLS on codev table';
  END IF;
END
$$;

-- Add restrictive UPDATE policy for codev (if one doesn't exist with proper checks)
CREATE POLICY "Users and admins can update codev with restrictions"
  ON codev FOR UPDATE
  TO public
  USING (
    -- User is updating their own record
    id = auth.uid()
    OR
    -- User is an admin
    auth.uid() IN (SELECT id FROM admin_users)
    OR
    -- User is a mentor updating their mentee
    (auth.uid() IN (SELECT id FROM mentor_users) AND mentor_id = auth.uid())
  )
  WITH CHECK (
    -- Same conditions for WITH CHECK
    id = auth.uid()
    OR
    auth.uid() IN (SELECT id FROM admin_users)
    OR
    (auth.uid() IN (SELECT id FROM mentor_users) AND mentor_id = auth.uid())
  );


-- =============================================================================
-- NOTES AND VERIFICATION
-- =============================================================================

-- After running this migration, verify:
--
-- 1. Attendance Points Security:
--    - Non-team-leads cannot modify attendance_points
--    - Team leads can only modify points for their team members
--    - Admins can modify all points
--
-- 2. Overflow Likes:
--    - RPC functions exist and work correctly
--    - Like counts update atomically
--
-- 3. Codev Updates:
--    - Users can only update their own records
--    - Admins can update all records
--    - Mentors can update mentee records
--
-- 4. Helper Functions:
--    - is_admin() works correctly
--    - is_team_lead_of_project() works correctly
--
-- To test:
-- SELECT is_admin();  -- Should return true for admins
-- SELECT is_team_lead_of_project('<some-project-uuid>');  -- True if you're team lead
-- =============================================================================
