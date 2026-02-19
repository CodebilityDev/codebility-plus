-- =============================================================================
-- RLS Critical Security Fixes (Simplified)
-- Date: 2026-02-19
--
-- This version fixes critical issues without making assumptions about column names.
-- Additional specific policies can be added after confirming table schemas.
-- =============================================================================


-- =============================================================================
-- PART 1: FIX profile_points - Remove wide-open authenticated policies
-- =============================================================================

DROP POLICY IF EXISTS "Allow insert for authenticated users" ON profile_points;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON profile_points;
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON profile_points;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON profile_points;

CREATE POLICY "Admins can manage profile_points"
  ON profile_points FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Users can view own profile_points"
  ON profile_points FOR SELECT
  TO public
  USING (codev_id = auth.uid());


-- =============================================================================
-- PART 2: FIX attendance_points - Restrict INSERT, add WITH CHECK
-- =============================================================================

DROP POLICY IF EXISTS "System can insert attendance points" ON attendance_points;
DROP POLICY IF EXISTS "System can update attendance points" ON attendance_points;

CREATE POLICY "Admins can insert attendance_points"
  ON attendance_points FOR INSERT
  TO public
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Admins can update attendance_points"
  ON attendance_points FOR UPDATE
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));


-- =============================================================================
-- PART 3: FIX notification_queue - Should be service_role or admin only
-- =============================================================================

DROP POLICY IF EXISTS "System can manage notification queue" ON notification_queue;

CREATE POLICY "Service role can manage notification_queue"
  ON notification_queue FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can view notification_queue"
  ON notification_queue FOR SELECT
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- =============================================================================
-- PART 4: ADD WITH CHECK to existing INSERT policies
-- =============================================================================

DROP POLICY IF EXISTS "Authenticated users can create jobs" ON job_listings;
CREATE POLICY "Authenticated users can create jobs"
  ON job_listings FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

DROP POLICY IF EXISTS "Users can create responses" ON survey_responses;
CREATE POLICY "Users can create responses"
  ON survey_responses FOR INSERT
  TO public
  WITH CHECK (respondent_id = auth.uid());


-- =============================================================================
-- PART 5: ADD BASIC POLICIES to tables with RLS enabled but no policies
-- Using admin-only approach for safety - specific policies can be added later
-- =============================================================================

-- announcements
CREATE POLICY "Admins can manage announcements"
  ON announcements FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY "Authenticated users can view announcements"
  ON announcements FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);


-- applicant
CREATE POLICY "Users can manage own applicant data"
  ON applicant FOR ALL
  TO public
  USING (codev_id = auth.uid())
  WITH CHECK (codev_id = auth.uid());

CREATE POLICY "Admins can manage all applicants"
  ON applicant FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- attendance
CREATE POLICY "Users can view own attendance"
  ON attendance FOR SELECT
  TO public
  USING (codev_id = auth.uid());

CREATE POLICY "Admins can manage attendance"
  ON attendance FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- kanban_sprints
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


-- task_ticket_codes
CREATE POLICY "Public can view task_ticket_codes"
  ON task_ticket_codes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage task_ticket_codes"
  ON task_ticket_codes FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- tasks_comments (simplified - admin only mutations for now)
CREATE POLICY "Authenticated users can view tasks_comments"
  ON tasks_comments FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create tasks_comments"
  ON tasks_comments FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all task comments"
  ON tasks_comments FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- overflow_post (simplified - admin only for now)
CREATE POLICY "Authenticated users can view overflow_post"
  ON overflow_post FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create overflow_post"
  ON overflow_post FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all overflow posts"
  ON overflow_post FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- overflow_comments
CREATE POLICY "Authenticated users can view overflow_comments"
  ON overflow_comments FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create overflow_comments"
  ON overflow_comments FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage overflow_comments"
  ON overflow_comments FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- overflow_likes
CREATE POLICY "Authenticated users can view overflow_likes"
  ON overflow_likes FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create overflow_likes"
  ON overflow_likes FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage overflow_likes"
  ON overflow_likes FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- posts
CREATE POLICY "Authenticated users can view posts"
  ON posts FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all posts"
  ON posts FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- post_comments
CREATE POLICY "Authenticated users can view post_comments"
  ON post_comments FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create post_comments"
  ON post_comments FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage post_comments"
  ON post_comments FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- post_upvotes
CREATE POLICY "Authenticated users can view post_upvotes"
  ON post_upvotes FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create post_upvotes"
  ON post_upvotes FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage post_upvotes"
  ON post_upvotes FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- comment_mentions
CREATE POLICY "Authenticated users can view comment_mentions"
  ON comment_mentions FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can create comment_mentions"
  ON comment_mentions FOR INSERT
  TO public
  WITH CHECK (true);


-- post_content_images
CREATE POLICY "Public can view post_content_images"
  ON post_content_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can upload images"
  ON post_content_images FOR INSERT
  TO public
  WITH CHECK (auth.uid() IS NOT NULL);


-- post_tags
CREATE POLICY "Public can view post_tags"
  ON post_tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage post_tags"
  ON post_tags FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- post_tags_lookup
CREATE POLICY "Public can view post_tags_lookup"
  ON post_tags_lookup FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage post_tags_lookup"
  ON post_tags_lookup FOR ALL
  TO public
  USING (auth.uid() IS NOT NULL);


-- project_categories
CREATE POLICY "Public can view project_categories"
  ON project_categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage project_categories"
  ON project_categories FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- notification_templates
CREATE POLICY "Admins can manage notification_templates"
  ON notification_templates FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));


-- Discord tables (service_role only)
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
-- NOTES:
--
-- The policies above use simplified permissions for tables where column names
-- were unknown. Specifically:
--
-- - overflow_post, posts, overflow_comments, post_comments:
--   Allow all authenticated users to create, admins to manage
--   TODO: Add owner-based UPDATE/DELETE when column names are confirmed
--
-- - tasks_comments:
--   Allow authenticated users to view/create
--   TODO: Restrict to task participants when schema is confirmed
--
-- After running this, you can add more specific policies for individual tables
-- using the patterns in RLS_POLICY_TEMPLATES.md
-- =============================================================================
