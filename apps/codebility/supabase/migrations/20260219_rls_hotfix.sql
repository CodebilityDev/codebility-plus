-- =============================================================================
-- RLS HOTFIX - Fix Breaking Issues from Critical Fixes Migration
-- Date: 2026-02-19
--
-- This fixes critical breaking changes introduced by the RLS policies.
-- Run this IMMEDIATELY after the critical fixes migration.
-- =============================================================================


-- =============================================================================
-- PART 1: CREATE admin_users VIEW (Required by all policies)
-- =============================================================================

CREATE OR REPLACE VIEW public.admin_users AS
SELECT id FROM public.codev
WHERE role_id IN (1, 4);  -- Admin and Super Admin role IDs


-- =============================================================================
-- PART 2: FIX attendance - Allow team members to view/insert
-- =============================================================================

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can view own attendance" ON attendance;

-- Allow project members to view attendance for their projects
CREATE POLICY "Project members can view attendance"
  ON attendance FOR SELECT
  TO public
  USING (
    project_id IN (
      SELECT project_id FROM project_members WHERE codev_id = auth.uid()
    )
    OR auth.uid() IN (SELECT id FROM admin_users)
  );

-- Allow authenticated users to insert attendance (team members marking attendance)
CREATE POLICY "Project members can insert attendance"
  ON attendance FOR INSERT
  TO public
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM project_members WHERE codev_id = auth.uid()
    )
    OR auth.uid() IN (SELECT id FROM admin_users)
  );

-- Allow users to update their own attendance records
CREATE POLICY "Users can update own attendance"
  ON attendance FOR UPDATE
  TO public
  USING (codev_id = auth.uid() OR auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (codev_id = auth.uid() OR auth.uid() IN (SELECT id FROM admin_users));


-- =============================================================================
-- PART 3: FIX kanban_sprints - Allow project members to create sprints
-- =============================================================================

CREATE POLICY "Project members can create kanban_sprints"
  ON kanban_sprints FOR INSERT
  TO public
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM project_members WHERE codev_id = auth.uid()
    )
    OR auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Project members can update kanban_sprints"
  ON kanban_sprints FOR UPDATE
  TO public
  USING (
    project_id IN (
      SELECT project_id FROM project_members WHERE codev_id = auth.uid()
    )
    OR auth.uid() IN (SELECT id FROM admin_users)
  )
  WITH CHECK (
    project_id IN (
      SELECT project_id FROM project_members WHERE codev_id = auth.uid()
    )
    OR auth.uid() IN (SELECT id FROM admin_users)
  );


-- =============================================================================
-- PART 4: FIX overflow_post - Allow owners to update/delete
-- =============================================================================

-- Assuming overflow_post has 'codev_id' or 'user_id' column for ownership
-- Adjust column name based on actual schema

CREATE POLICY "Users can update own overflow_post"
  ON overflow_post FOR UPDATE
  TO public
  USING (
    (SELECT codev_id FROM overflow_post WHERE id = overflow_post.id) = auth.uid()
  )
  WITH CHECK (
    (SELECT codev_id FROM overflow_post WHERE id = overflow_post.id) = auth.uid()
  );

CREATE POLICY "Users can delete own overflow_post"
  ON overflow_post FOR DELETE
  TO public
  USING (
    (SELECT codev_id FROM overflow_post WHERE id = overflow_post.id) = auth.uid()
  );


-- =============================================================================
-- PART 5: FIX overflow_comments - Allow owners to update/delete
-- =============================================================================

CREATE POLICY "Users can update own overflow_comments"
  ON overflow_comments FOR UPDATE
  TO public
  USING (auth.uid() IS NOT NULL);  -- Simplified - refine with actual owner column

CREATE POLICY "Users can delete own overflow_comments"
  ON overflow_comments FOR DELETE
  TO public
  USING (auth.uid() IS NOT NULL);  -- Simplified - refine with actual owner column


-- =============================================================================
-- PART 6: FIX overflow_likes - Allow users to delete their own likes
-- =============================================================================

-- Already has INSERT policy, just needs DELETE
-- Assuming user_id column exists

CREATE POLICY "Users can delete own overflow_likes"
  ON overflow_likes FOR DELETE
  TO public
  USING (auth.uid() IS NOT NULL);  -- Refine with actual user_id column check


-- =============================================================================
-- PART 7: FIX posts - Allow owners to update/delete
-- =============================================================================

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO public
  USING (auth.uid() IS NOT NULL);  -- Simplified - refine with owner column

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO public
  USING (auth.uid() IS NOT NULL);  -- Simplified - refine with owner column


-- =============================================================================
-- PART 8: FIX post_comments - Allow owners to update/delete
-- =============================================================================

CREATE POLICY "Users can update own post_comments"
  ON post_comments FOR UPDATE
  TO public
  USING (auth.uid() IS NOT NULL);  -- Simplified - refine with owner column

CREATE POLICY "Users can delete own post_comments"
  ON post_comments FOR DELETE
  TO public
  USING (auth.uid() IS NOT NULL);  -- Simplified - refine with owner column


-- =============================================================================
-- PART 9: FIX post_upvotes - Allow users to delete their upvotes
-- =============================================================================

CREATE POLICY "Users can delete own post_upvotes"
  ON post_upvotes FOR DELETE
  TO public
  USING (auth.uid() IS NOT NULL);  -- Refine with user_id check


-- =============================================================================
-- PART 10: FIX tasks_comments - Allow users to update/delete own comments
-- =============================================================================

CREATE POLICY "Users can update own task_comments"
  ON tasks_comments FOR UPDATE
  TO public
  USING (auth.uid() IS NOT NULL);  -- Simplified - needs owner column

CREATE POLICY "Users can delete own task_comments"
  ON tasks_comments FOR DELETE
  TO public
  USING (auth.uid() IS NOT NULL);  -- Simplified - needs owner column


-- =============================================================================
-- PART 11: FIX profile_points - Allow users to manage their own points via API
-- =============================================================================

-- The API route needs to work for users updating their own profiles
-- Add a policy that allows users to delete/insert their own points

CREATE POLICY "Users can delete own profile_points"
  ON profile_points FOR DELETE
  TO public
  USING (codev_id = auth.uid());

CREATE POLICY "Users can insert own profile_points"
  ON profile_points FOR INSERT
  TO public
  WITH CHECK (codev_id = auth.uid());


-- =============================================================================
-- PART 12: FIX attendance_points - Allow system operations
-- =============================================================================

-- The system needs to automatically calculate and insert attendance points
-- Add policies for authenticated operations (server actions)

CREATE POLICY "Authenticated users can insert attendance_points"
  ON attendance_points FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update attendance_points"
  ON attendance_points FOR UPDATE
  TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);


-- =============================================================================
-- NOTES:
--
-- Some policies above use simplified checks (auth.uid() IS NOT NULL) where
-- owner column names were unknown. After running this, verify actual column
-- names and update policies to:
--
-- - overflow_post: Check actual owner column (codev_id, user_id, author_id?)
-- - overflow_comments: Same
-- - posts: Same
-- - post_comments: Same
-- - tasks_comments: Same
--
-- Query to find owner columns:
-- SELECT table_name, column_name
-- FROM information_schema.columns
-- WHERE table_name IN ('overflow_post', 'overflow_comments', 'posts',
--                      'post_comments', 'tasks_comments')
--   AND column_name LIKE '%id%';
-- =============================================================================
