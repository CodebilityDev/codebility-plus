# RLS Policy Templates & Best Practices

This document provides recommended RLS policy structures for different table types in the Codebility platform.

## Table of Contents
1. [General Principles](#general-principles)
2. [User-Owned Data](#user-owned-data)
3. [Project/Team Data](#projectteam-data)
4. [Admin-Only Data](#admin-only-data)
5. [Public Portfolio Data](#public-portfolio-data)
6. [System/Service Data](#systemservice-data)
7. [Social Features](#social-features)
8. [Common Patterns](#common-patterns)

---

## General Principles

### ✅ DO
- **Always use WITH CHECK** on INSERT/UPDATE policies to prevent privilege escalation
- **Consolidate policies** — prefer 1 policy per operation type (SELECT, INSERT, UPDATE, DELETE)
- **Use meaningful names** — `"Users can view own tasks"` not `"policy_1"`
- **Separate concerns** — Don't mix admin logic with user logic in the same policy
- **Test policies** — Verify with `SELECT * FROM table` as different user roles

### ❌ DON'T
- **Never use `true` for INSERT/UPDATE** without validation
- **Avoid duplicate policies** — 5 SELECT policies doing the same thing = performance hit
- **Don't hard-code role IDs** — Use `admin_users` view or `roles.is_admin` boolean
- **Don't expose PII to anon** — Verify if anonymous access is intentional

---

## 1. User-Owned Data

**Examples:** `education`, `work_experience`, `work_schedules`, `job_status`

**Pattern:** Users manage own data, admins manage all, mentors manage mentees, public can view graduated users.

```sql
-- Template for user-owned data
-- Replace: <table>, <owner_column>, <graduated_filter>

-- Admins: Full access
CREATE POLICY "Admins can manage <table>"
  ON <table> FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Users: Manage own data
CREATE POLICY "Users can insert own <table>"
  ON <table> FOR INSERT
  TO public
  WITH CHECK (<owner_column> = auth.uid());

CREATE POLICY "Users can view own <table>"
  ON <table> FOR SELECT
  TO public
  USING (<owner_column> = auth.uid());

CREATE POLICY "Users can update own <table>"
  ON <table> FOR UPDATE
  TO public
  USING (<owner_column> = auth.uid())
  WITH CHECK (<owner_column> = auth.uid());

CREATE POLICY "Users can delete own <table>"
  ON <table> FOR DELETE
  TO public
  USING (<owner_column> = auth.uid());

-- Mentors: View/manage mentee data
CREATE POLICY "Mentors can view mentee <table>"
  ON <table> FOR SELECT
  TO public
  USING (
    auth.uid() IN (SELECT id FROM mentor_users)
    AND <owner_column> IN (
      SELECT id FROM codev WHERE mentor_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can update mentee <table>"
  ON <table> FOR UPDATE
  TO public
  USING (
    auth.uid() IN (SELECT id FROM mentor_users)
    AND <owner_column> IN (
      SELECT id FROM codev WHERE mentor_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM mentor_users)
    AND <owner_column> IN (
      SELECT id FROM codev WHERE mentor_id = auth.uid()
    )
  );

-- Public: View graduated users only (for portfolio)
CREATE POLICY "Public can view graduated <table>"
  ON <table> FOR SELECT
  TO public
  USING (
    <owner_column> IN (
      SELECT id FROM codev
      WHERE internal_status = 'GRADUATED'
        AND availability_status = true
    )
  );
```

---

## 2. Project/Team Data

**Examples:** `tasks`, `kanban_boards`, `kanban_columns`, `kanban_sprints`, `project_members`

**Pattern:** Project members can view, admins manage all, task assignees can update.

```sql
-- Template for project-scoped data
-- Replace: <table>, <project_id_column>

-- Admins: Full access
CREATE POLICY "Admins can manage <table>"
  ON <table> FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Project members: View
CREATE POLICY "Project members can view <table>"
  ON <table> FOR SELECT
  TO public
  USING (
    <project_id_column> IN (
      SELECT project_id FROM project_members
      WHERE codev_id = auth.uid()
    )
  );

-- Project members: Create (optional, depends on table)
CREATE POLICY "Project members can create <table>"
  ON <table> FOR INSERT
  TO public
  WITH CHECK (
    <project_id_column> IN (
      SELECT project_id FROM project_members
      WHERE codev_id = auth.uid()
    )
  );

-- Specific assignees: Update (for tasks/assignable items)
CREATE POLICY "Assignees can update <table>"
  ON <table> FOR UPDATE
  TO public
  USING (
    assigned_to = auth.uid()
    OR auth.uid() = ANY(sidekick_ids)
  )
  WITH CHECK (
    assigned_to = auth.uid()
    OR auth.uid() = ANY(sidekick_ids)
  );
```

### Special Case: Tasks

```sql
-- Tasks: Complex access (assignees, sidekicks, project members)
CREATE POLICY "Users can view accessible tasks"
  ON tasks FOR SELECT
  TO public
  USING (
    codev_id = auth.uid()
    OR auth.uid() = ANY(sidekick_ids)
    OR kanban_column_id IN (
      SELECT kc.id FROM kanban_columns kc
      JOIN kanban_boards kb ON kc.board_id = kb.id
      JOIN project_members pm ON kb.project_id = pm.project_id
      WHERE pm.codev_id = auth.uid()
    )
  );

CREATE POLICY "Assignees can update tasks"
  ON tasks FOR UPDATE
  TO public
  USING (
    codev_id = auth.uid()
    OR auth.uid() = ANY(sidekick_ids)
  )
  WITH CHECK (
    codev_id = auth.uid()
    OR auth.uid() = ANY(sidekick_ids)
  );
```

---

## 3. Admin-Only Data

**Examples:** `roles`, `positions`, `levels`, `skill_category`, `notification_templates`

**Pattern:** Admins manage, everyone can view (read-only reference data).

```sql
-- Template for admin-managed reference data

-- Admins: Full access
CREATE POLICY "Admins can manage <table>"
  ON <table> FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Everyone: Read-only
CREATE POLICY "Public can view <table>"
  ON <table> FOR SELECT
  TO public
  USING (true);
```

---

## 4. Public Portfolio Data

**Examples:** `codev`, `projects`, `clients`

**Pattern:** Public can view all (portfolio site), authenticated users can view all, users update own.

```sql
-- Template for public portfolio data

-- Admins: Full access
CREATE POLICY "Admins can manage <table>"
  ON <table> FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Public: View all (for portfolio)
CREATE POLICY "Public can view <table>"
  ON <table> FOR SELECT
  TO public
  USING (true);

-- Users: Update own data
CREATE POLICY "Users can update own <table>"
  ON <table> FOR UPDATE
  TO public
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
```

### Restricted Portfolio Data (Graduated Only)

If you want to show only graduated users to anonymous visitors:

```sql
CREATE POLICY "Public can view graduated <table>"
  ON <table> FOR SELECT
  TO public
  USING (
    internal_status = 'GRADUATED'
    AND availability_status = true
    OR auth.role() = 'authenticated'  -- Authenticated users see all
  );
```

---

## 5. System/Service Data

**Examples:** `notification_queue`, `xp_logs_discord`, `guilds_discord`, `users_discord`

**Pattern:** Service role only, optional admin read access.

```sql
-- Template for system/service data

-- Service role: Full access
CREATE POLICY "Service role can manage <table>"
  ON <table> FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins: Read-only (for debugging)
CREATE POLICY "Admins can view <table>"
  ON <table> FOR SELECT
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));
```

---

## 6. Social Features

**Examples:** `overflow_post`, `overflow_comments`, `overflow_likes`, `posts`, `post_comments`, `post_upvotes`

**Pattern:** Authenticated users view all, users manage own content.

```sql
-- Template for social/feed content

-- Authenticated users: View all
CREATE POLICY "Authenticated users can view <table>"
  ON <table> FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

-- Users: Create own content
CREATE POLICY "Users can create <table>"
  ON <table> FOR INSERT
  TO public
  WITH CHECK (author_id = auth.uid());

-- Users: Update own content
CREATE POLICY "Users can update own <table>"
  ON <table> FOR UPDATE
  TO public
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Users: Delete own content
CREATE POLICY "Users can delete own <table>"
  ON <table> FOR DELETE
  TO public
  USING (author_id = auth.uid());

-- Admins: Manage all (moderation)
CREATE POLICY "Admins can manage all <table>"
  ON <table> FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));
```

### Likes/Upvotes Pattern

```sql
-- Users can view all likes
CREATE POLICY "Users can view <table>_likes"
  ON <table>_likes FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);

-- Users can like (create)
CREATE POLICY "Users can create own <table>_likes"
  ON <table>_likes FOR INSERT
  TO public
  WITH CHECK (user_id = auth.uid());

-- Users can unlike (delete own)
CREATE POLICY "Users can delete own <table>_likes"
  ON <table>_likes FOR DELETE
  TO public
  USING (user_id = auth.uid());
```

---

## 7. Common Patterns

### Admin Users View

Instead of hard-coding `role_id = 1`, use a view:

```sql
CREATE OR REPLACE VIEW admin_users AS
SELECT id FROM codev
WHERE role_id IN (1, 4);  -- Admin and Super Admin
```

Then policies become:

```sql
USING (auth.uid() IN (SELECT id FROM admin_users))
```

### Mentor Users View

```sql
CREATE OR REPLACE VIEW mentor_users AS
SELECT id FROM codev
WHERE role_id IN (2, 3);  -- Mentor roles
```

### Graduated Users Filter

```sql
-- Reusable condition
WHERE codev_id IN (
  SELECT id FROM codev
  WHERE internal_status = 'GRADUATED'
    AND availability_status = true
)
```

---

## 8. Migration Checklist

When adding RLS to a new table:

1. **Enable RLS:**
   ```sql
   ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;
   ```

2. **Create policies in this order:**
   - Service role (if system table)
   - Admin full access
   - User read access (SELECT)
   - User write access (INSERT/UPDATE/DELETE)
   - Public/anon access (if needed)

3. **Test with different roles:**
   ```sql
   -- As admin
   SET LOCAL role TO 'authenticated';
   SET LOCAL request.jwt.claims TO '{"sub": "<admin-uuid>"}';
   SELECT * FROM <table>;

   -- As regular user
   SET LOCAL request.jwt.claims TO '{"sub": "<user-uuid>"}';
   SELECT * FROM <table>;

   -- As anon
   SET LOCAL role TO 'anon';
   SELECT * FROM <table>;
   ```

4. **Verify no data leaks:**
   - Check anon can't see PII
   - Check users can't see other users' private data
   - Check users can't update others' data

---

## 9. Performance Tips

- **Index foreign keys** used in policies (e.g., `codev_id`, `project_id`)
- **Avoid subqueries in USING** when possible — use JOINs in app layer
- **Materialize views** for complex admin checks
- **Monitor slow queries** with `pg_stat_statements`

---

## 10. Security Checklist

Before deploying:

- [ ] No `INSERT/UPDATE` policies with `WITH CHECK (true)` unless system-only
- [ ] No anonymous access to PII (email, phone, etc.)
- [ ] All user-owned data has `owner_column = auth.uid()` checks
- [ ] Admins identified via view, not hard-coded role IDs
- [ ] Service role used for system tables, not public role
- [ ] Duplicate policies removed
- [ ] Policies tested with all user roles

---

## Example: Complete Table Setup

```sql
-- Example: Setting up RLS for a new "codev_achievements" table

-- 1. Enable RLS
ALTER TABLE codev_achievements ENABLE ROW LEVEL SECURITY;

-- 2. Admins: Full access
CREATE POLICY "Admins can manage codev_achievements"
  ON codev_achievements FOR ALL
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- 3. Users: Insert own achievements
CREATE POLICY "Users can add own achievements"
  ON codev_achievements FOR INSERT
  TO public
  WITH CHECK (codev_id = auth.uid());

-- 4. Users: View own achievements
CREATE POLICY "Users can view own achievements"
  ON codev_achievements FOR SELECT
  TO public
  USING (codev_id = auth.uid());

-- 5. Public: View graduated users' achievements (portfolio)
CREATE POLICY "Public can view graduated achievements"
  ON codev_achievements FOR SELECT
  TO public
  USING (
    codev_id IN (
      SELECT id FROM codev
      WHERE internal_status = 'GRADUATED'
        AND availability_status = true
    )
  );

-- 6. Mentors: View mentee achievements
CREATE POLICY "Mentors can view mentee achievements"
  ON codev_achievements FOR SELECT
  TO public
  USING (
    auth.uid() IN (SELECT id FROM mentor_users)
    AND codev_id IN (
      SELECT id FROM codev WHERE mentor_id = auth.uid()
    )
  );
```

---

## Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Common RLS Mistakes](https://supabase.com/docs/guides/auth/row-level-security#common-mistakes)

---

**Last Updated:** 2026-02-19
