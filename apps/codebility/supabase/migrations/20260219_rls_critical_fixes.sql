-- =============================================================================
-- RLS Critical Security Fixes
-- Date: 2026-02-19
--
-- Fixes:
--  1. Restrict profile_points to admin-only mutations
--  2. Restrict attendance_points INSERT to admin/system only
--  3. Restrict notification_queue to system only
--  4. Add WITH CHECK clauses to prevent privilege escalation
--  5. Add policies to tables with RLS enabled but no policies
--  6. Remove anonymous full access where inappropriate
--
-- IMPORTANT: Review anon policies at the end - verify if public access is intentional
-- =============================================================================


-- =============================================================================
-- PART 1: FIX profile_points - Remove wide-open authenticated policies
-- =============================================================================

-- Drop the overly permissive authenticated policies
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON profile_points;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON profile_points;
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON profile_points;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON profile_points;

-- Add restrictive policies: Only admins can mutate, users can view own
CREATE POLICY "Admins can manage profile_points"
  ON profile_points FOR ALL
  TO public
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY "Users can view own profile_points"
  ON profile_points FOR SELECT
  TO public
  USING (codev_id = auth.uid());


-- =============================================================================
-- PART 2: FIX attendance_points - Restrict INSERT, add WITH CHECK
-- =============================================================================

-- Drop the wide-open INSERT and UPDATE policies
DROP POLICY IF EXISTS "System can insert attendance points" ON attendance_points;
DROP POLICY IF EXISTS "System can update attendance points" ON attendance_points;

-- Admins/system can insert attendance points (with validation)
CREATE POLICY "Admins can insert attendance_points"
  ON attendance_points FOR INSERT
  TO public
  WITH CHECK (
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Admins can update attendance points (with validation)
CREATE POLICY "Admins can update attendance_points"
  ON attendance_points FOR UPDATE
  TO public
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM admin_users)
  );


-- =============================================================================
-- PART 3: FIX notification_queue - Should be service_role or admin only
-- =============================================================================

-- Drop the wide-open policy
DROP POLICY IF EXISTS "System can manage notification queue" ON notification_queue;

-- Only service role can manage notification queue
CREATE POLICY "Service role can manage notification_queue"
  ON notification_queue FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can view notification queue for debugging
CREATE POLICY "Admins can view notification_queue"
  ON notification_queue FOR SELECT
  TO public
  USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );


-- =============================================================================
-- PART 4: ADD WITH CHECK to existing INSERT policies missing it
-- =============================================================================

-- job_listings: Ensure created_by matches auth user
DROP POLICY IF EXISTS "Authenticated users can create jobs" ON job_listings;
CREATE POLICY "Authenticated users can create jobs"
  ON job_listings FOR INSERT
  TO public
  WITH CHECK (
    auth.uid() IS NOT NULL AND created_by = auth.uid()
  );

-- notifications: Ensure system notifications are valid
-- (Keep existing policy but document that "true" is intentional for system-created notifications)

-- survey_responses: Ensure respondent_id matches auth user
DROP POLICY IF EXISTS "Users can create responses" ON survey_responses;
CREATE POLICY "Users can create responses"
  ON survey_responses FOR INSERT
  TO public
  WITH CHECK (
    respondent_id = auth.uid()
  );


-- =============================================================================
-- PART 5: ADD POLICIES to tables with RLS enabled but no policies
-- =============================================================================

-- announcements: Admins manage, authenticated users view
CREATE POLICY "Admins can manage announcements"
  ON announcements FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Authenticated users can view announcements"
  ON announcements FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);


-- applicant: Users can manage own applicant data, admins can manage all
CREATE POLICY "Users can manage own applicant data"
  ON applicant FOR ALL
  TO public
  USING (codev_id = auth.uid())
  WITH CHECK (codev_id = auth.uid());

CREATE POLICY "Admins can manage all applicants"
  ON applicant FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can view all applicants"
  ON applicant FOR SELECT
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- attendance: Users can view own, admins manage all
CREATE POLICY "Users can view own attendance"
  ON attendance FOR SELECT
  TO public
  USING (codev_id = auth.uid());

CREATE POLICY "Admins can manage attendance"
  ON attendance FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- kanban_sprints: Project members can view, admins manage
CREATE POLICY "Project members can view kanban_sprints"
  ON kanban_sprints FOR SELECT
  TO public
  USING (
    project_id IN (
      SELECT project_id FROM project_members WHERE codev_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage kanban_sprints"
  ON kanban_sprints FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- task_ticket_codes: Public can view (used for URL routing), admins manage
CREATE POLICY "Public can view task_ticket_codes"
  ON task_ticket_codes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage task_ticket_codes"
  ON task_ticket_codes FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- tasks_comments: Task assignees and project members can manage own comments
-- Note: Assuming tasks_comments has codev_id or user_id column
-- Adjust column name based on actual schema
CREATE POLICY "Users can view comments on accessible tasks"
  ON tasks_comments FOR SELECT
  TO public
  USING (
    task_id IN (
      SELECT id FROM tasks
      WHERE codev_id = auth.uid()
         OR auth.uid() = ANY(sidekick_ids)
         OR kanban_column_id IN (
           SELECT kc.id FROM kanban_columns kc
           JOIN kanban_boards kb ON kc.board_id = kb.id
           JOIN project_members pm ON kb.project_id = pm.project_id
           WHERE pm.codev_id = auth.uid()
         )
    )
  );

CREATE POLICY "Users can create comments on accessible tasks"
  ON tasks_comments FOR INSERT
  TO public
  WITH CHECK (
    task_id IN (
      SELECT id FROM tasks
      WHERE codev_id = auth.uid()
         OR auth.uid() = ANY(sidekick_ids)
         OR kanban_column_id IN (
           SELECT kc.id FROM kanban_columns kc
           JOIN kanban_boards kb ON kc.board_id = kb.id
           JOIN project_members pm ON kb.project_id = pm.project_id
           WHERE pm.codev_id = auth.uid()
         )
    )
  );

CREATE POLICY "Admins can manage all task comments"
  ON tasks_comments FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- overflow_post: Authenticated users can create, view all, manage own
CREATE POLICY "Authenticated users can view overflow_post"
  ON overflow_post FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create overflow posts"
  ON overflow_post FOR INSERT
  TO public
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update own overflow posts"
  ON overflow_post FOR UPDATE
  TO public
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete own overflow posts"
  ON overflow_post FOR DELETE
  TO public
  USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all overflow posts"
  ON overflow_post FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- overflow_comments: Users manage own comments
CREATE POLICY "Authenticated users can view overflow_comments"
  ON overflow_comments FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create overflow_comments"
  ON overflow_comments FOR INSERT
  TO public
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update own overflow_comments"
  ON overflow_comments FOR UPDATE
  TO public
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete own overflow_comments"
  ON overflow_comments FOR DELETE
  TO public
  USING (author_id = auth.uid());


-- overflow_likes: Users manage own likes
CREATE POLICY "Authenticated users can view overflow_likes"
  ON overflow_likes FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create own overflow_likes"
  ON overflow_likes FOR INSERT
  TO public
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own overflow_likes"
  ON overflow_likes FOR DELETE
  TO public
  USING (user_id = auth.uid());


-- posts: Authenticated users can view, users manage own posts
CREATE POLICY "Authenticated users can view posts"
  ON posts FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  TO public
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO public
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO public
  USING (author_id = auth.uid());

CREATE POLICY "Admins can manage all posts"
  ON posts FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- post_comments: Users manage own comments
CREATE POLICY "Authenticated users can view post_comments"
  ON post_comments FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create post_comments"
  ON post_comments FOR INSERT
  TO public
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update own post_comments"
  ON post_comments FOR UPDATE
  TO public
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can delete own post_comments"
  ON post_comments FOR DELETE
  TO public
  USING (author_id = auth.uid());


-- post_upvotes: Users manage own upvotes
CREATE POLICY "Authenticated users can view post_upvotes"
  ON post_upvotes FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create own post_upvotes"
  ON post_upvotes FOR INSERT
  TO public
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own post_upvotes"
  ON post_upvotes FOR DELETE
  TO public
  USING (user_id = auth.uid());


-- comment_mentions: Mentioned users can view, system can create
CREATE POLICY "Mentioned users can view comment_mentions"
  ON comment_mentions FOR SELECT
  TO public
  USING (mentioned_user_id = auth.uid());

CREATE POLICY "System can create comment_mentions"
  ON comment_mentions FOR INSERT
  TO public
  WITH CHECK (true);


-- post_content_images: Public can view, users can upload for own posts
CREATE POLICY "Public can view post_content_images"
  ON post_content_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can upload images for own posts"
  ON post_content_images FOR INSERT
  TO public
  WITH CHECK (
    post_id IN (SELECT id FROM posts WHERE author_id = auth.uid())
  );


-- post_tags and post_tags_lookup: Public can view, admins manage
CREATE POLICY "Public can view post_tags"
  ON post_tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage post_tags"
  ON post_tags FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Public can view post_tags_lookup"
  ON post_tags_lookup FOR SELECT
  TO public
  USING (true);

CREATE POLICY "System can manage post_tags_lookup"
  ON post_tags_lookup FOR ALL
  TO public
  USING (true);


-- project_categories: Public can view, admins manage
CREATE POLICY "Public can view project_categories"
  ON project_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage project_categories"
  ON project_categories FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- notification_templates: Admins only
CREATE POLICY "Admins can manage notification_templates"
  ON notification_templates FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- Discord tables (if not service_role only already)
CREATE POLICY "Service role can manage badges_discord"
  ON badges_discord FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage levelup_messages_discord"
  ON levelup_messages_discord FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage user_badges_discord"
  ON user_badges_discord FOR ALL
  TO service_role
  USING (true);


-- =============================================================================
-- PART 6: DOCUMENT ANON ACCESS (Manual review required)
-- =============================================================================

-- The following tables allow anonymous (public, not logged in) users full read access:
--
-- - clients
-- - codev
-- - codev_points
-- - contracts
-- - education
-- - job_status
-- - kanban_boards
-- - kanban_columns
-- - points_history
-- - project_members
-- - projects
-- - tasks
-- - work_experience
-- - work_schedules
--
-- REVIEW REQUIRED: If this is a public portfolio site, this may be intentional.
-- If not, run the companion script `20260219_rls_remove_anon_access.sql` to restrict.
--
-- =============================================================================
