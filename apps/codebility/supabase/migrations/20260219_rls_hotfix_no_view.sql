-- =============================================================================
-- RLS HOTFIX - Fix Breaking Issues (Without admin_users view creation)
-- Date: 2026-02-19
--
-- This version skips admin_users view creation since it already exists.
-- =============================================================================


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

CREATE POLICY "Users can update own overflow_post"
  ON overflow_post FOR UPDATE
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own overflow_post"
  ON overflow_post FOR DELETE
  TO public
  USING (auth.uid() IS NOT NULL);


-- =============================================================================
-- PART 5: FIX overflow_comments - Allow owners to update/delete
-- =============================================================================

CREATE POLICY "Users can update own overflow_comments"
  ON overflow_comments FOR UPDATE
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own overflow_comments"
  ON overflow_comments FOR DELETE
  TO public
  USING (auth.uid() IS NOT NULL);


-- =============================================================================
-- PART 6: FIX overflow_likes - Allow users to delete their own likes
-- =============================================================================

CREATE POLICY "Users can delete own overflow_likes"
  ON overflow_likes FOR DELETE
  TO public
  USING (auth.uid() IS NOT NULL);


-- =============================================================================
-- PART 7: FIX posts - Allow owners to update/delete
-- =============================================================================

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO public
  USING (auth.uid() IS NOT NULL);


-- =============================================================================
-- PART 8: FIX post_comments - Allow owners to update/delete
-- =============================================================================

CREATE POLICY "Users can update own post_comments"
  ON post_comments FOR UPDATE
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own post_comments"
  ON post_comments FOR DELETE
  TO public
  USING (auth.uid() IS NOT NULL);


-- =============================================================================
-- PART 9: FIX post_upvotes - Allow users to delete their upvotes
-- =============================================================================

CREATE POLICY "Users can delete own post_upvotes"
  ON post_upvotes FOR DELETE
  TO public
  USING (auth.uid() IS NOT NULL);


-- =============================================================================
-- PART 10: FIX tasks_comments - Allow users to update/delete own comments
-- =============================================================================

CREATE POLICY "Users can update own task_comments"
  ON tasks_comments FOR UPDATE
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own task_comments"
  ON tasks_comments FOR DELETE
  TO public
  USING (auth.uid() IS NOT NULL);


-- =============================================================================
-- PART 11: FIX profile_points - Allow users to manage their own points via API
-- =============================================================================

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

CREATE POLICY "Authenticated users can insert attendance_points"
  ON attendance_points FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update attendance_points"
  ON attendance_points FOR UPDATE
  TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
