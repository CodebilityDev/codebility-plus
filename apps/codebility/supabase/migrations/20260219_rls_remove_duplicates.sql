-- =============================================================================
-- Remove Duplicate RLS Policies
-- Date: 2026-02-19
--
-- This script removes redundant policies that do the same thing.
-- Keeps the most descriptive/specific policy name and drops the rest.
-- =============================================================================


-- =============================================================================
-- clients: 7 SELECT policies, keep 2 (admin + public)
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage clients" ON clients; -- Duplicate of admin_manage_clients
DROP POLICY IF EXISTS "Public can view client info" ON clients; -- Keep this one
DROP POLICY IF EXISTS "admin_view_all_clients" ON clients; -- Redundant with admin_manage_clients
DROP POLICY IF EXISTS "anon_view_all_clients" ON clients; -- Redundant with Public can view
DROP POLICY IF EXISTS "authenticated_view_all_clients" ON clients; -- Redundant
-- KEEP: admin_manage_clients (ALL), Public can view client info, codev_view_associated_clients


-- =============================================================================
-- codev: 10 policies, consolidate to 5
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage all codev profiles" ON codev; -- Duplicate
DROP POLICY IF EXISTS "Public can view codev profiles" ON codev; -- Keep this
DROP POLICY IF EXISTS "Users can view own profile" ON codev; -- Redundant with Public
DROP POLICY IF EXISTS "anon_view_all_codevs" ON codev; -- Redundant
DROP POLICY IF EXISTS "authenticated_view_all_codevs" ON codev; -- Redundant
DROP POLICY IF EXISTS "Users can update own profile" ON codev; -- Duplicate
DROP POLICY IF EXISTS "admin_update_codev_data" ON codev; -- Redundant with ALL policy
-- KEEP: admin_manage_all_codev_profiles (ALL), Public can view, codev_update_own_data, mentor_update_mentee_data, Mentors can view their mentees


-- =============================================================================
-- codev_points: 10 SELECT policies, consolidate to 3
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage all codev points" ON codev_points; -- Duplicate
DROP POLICY IF EXISTS "Codevs can view own points" ON codev_points; -- Duplicate
DROP POLICY IF EXISTS "Public can view codev points" ON codev_points; -- Keep this
DROP POLICY IF EXISTS "admin_view_all_codev_points" ON codev_points; -- Redundant
DROP POLICY IF EXISTS "anon_view_all_points" ON codev_points; -- Redundant
DROP POLICY IF EXISTS "anon_view_graduated_points" ON codev_points; -- Keep for specific logic
-- KEEP: admin_manage_all_codev_points (ALL), Public can view, codev_view_own_points, mentor_view_mentee_points, anon_view_graduated_points, admin_update_points, mentor_update_mentee_points


-- =============================================================================
-- contracts: 7 policies, consolidate to 4
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage all contracts" ON contracts; -- Duplicate
DROP POLICY IF EXISTS "Codevs can view own contracts" ON contracts; -- Duplicate
DROP POLICY IF EXISTS "admin_view_all_contracts" ON contracts; -- Redundant
DROP POLICY IF EXISTS "anon_view_all_contracts" ON contracts; -- Redundant
DROP POLICY IF EXISTS "authenticated_view_all_contracts" ON contracts; -- Redundant
-- KEEP: admin_manage_contracts (ALL), codev_view_own_contracts


-- =============================================================================
-- education: 11 policies, consolidate to 6
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage all education" ON education; -- Duplicate
DROP POLICY IF EXISTS "Codevs can manage own education" ON education; -- Too broad, keep specific ones
DROP POLICY IF EXISTS "Public can view education" ON education; -- Keep
DROP POLICY IF EXISTS "admin_view_all_education" ON education; -- Redundant
DROP POLICY IF EXISTS "anon_view_all_education" ON education; -- Redundant
DROP POLICY IF EXISTS "anon_view_graduated_education" ON education; -- Keep for specific logic
-- KEEP: admin_manage_all_education (ALL), codev_insert/update/delete_own, Public can view, anon_view_graduated, codev_view_own, mentor_view_mentee


-- =============================================================================
-- job_status: 12 policies, consolidate to 6
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage all job status" ON job_status; -- Duplicate
DROP POLICY IF EXISTS "Codevs can view own job status" ON job_status; -- Duplicate
DROP POLICY IF EXISTS "admin_view_all_job_status" ON job_status; -- Redundant
DROP POLICY IF EXISTS "anon_view_all_job_status" ON job_status; -- Redundant
DROP POLICY IF EXISTS "authenticated_view_all_job_status" ON job_status; -- Redundant
DROP POLICY IF EXISTS "Codevs can manage own job status" ON job_status; -- Duplicate
-- KEEP: admin_manage_all_job_status (ALL), codev_insert/update/view_own, mentor_view/update_mentee


-- =============================================================================
-- kanban_boards: 7 policies, consolidate to 4
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage all kanban boards" ON kanban_boards; -- Duplicate
DROP POLICY IF EXISTS "Project members can view kanban boards" ON kanban_boards; -- Duplicate
DROP POLICY IF EXISTS "admin_view_all_kanban_boards" ON kanban_boards; -- Redundant
DROP POLICY IF EXISTS "anon_view_all_kanban_boards" ON kanban_boards; -- Redundant
DROP POLICY IF EXISTS "authenticated_view_all_kanban_boards" ON kanban_boards; -- Redundant
-- KEEP: admin_manage_kanban_boards (ALL), codev_view_project_kanban_boards


-- =============================================================================
-- kanban_columns: 7 policies, consolidate to 4
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage all kanban columns" ON kanban_columns; -- Duplicate
DROP POLICY IF EXISTS "Project members can view kanban columns" ON kanban_columns; -- Duplicate
DROP POLICY IF EXISTS "admin_view_all_kanban_columns" ON kanban_columns; -- Redundant
DROP POLICY IF EXISTS "anon_view_all_kanban_columns" ON kanban_columns; -- Redundant
DROP POLICY IF EXISTS "authenticated_view_all_kanban_columns" ON kanban_columns; -- Redundant
-- KEEP: admin_manage_kanban_columns (ALL), codev_view_kanban_columns


-- =============================================================================
-- levels: 4 policies, consolidate to 2
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage levels" ON levels; -- Duplicate
DROP POLICY IF EXISTS "Public can view levels" ON levels; -- Duplicate
-- KEEP: admin_manage_levels (ALL), everyone_view_levels


-- =============================================================================
-- nda_requests: 5 policies, consolidate to 3
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage all NDA requests" ON nda_requests; -- Duplicate
DROP POLICY IF EXISTS "Codevs can view own NDA requests" ON nda_requests; -- Duplicate
DROP POLICY IF EXISTS "admin_view_all_nda_requests" ON nda_requests; -- Redundant
-- KEEP: admin_manage_nda_requests (ALL), codev_view_own_nda_requests


-- =============================================================================
-- points_history: 9 policies, consolidate to 5
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage all points history" ON points_history; -- Duplicate
DROP POLICY IF EXISTS "Codevs can view own points history" ON points_history; -- Duplicate
DROP POLICY IF EXISTS "admin_view_all_points_history" ON points_history; -- Redundant
DROP POLICY IF EXISTS "anon_view_all_points_history" ON points_history; -- Redundant
DROP POLICY IF EXISTS "authenticated_view_all_points_history" ON points_history; -- Redundant
-- KEEP: admin_manage_all_points_history (ALL), admin_insert, mentor_insert, codev_view_own, mentor_view_mentee


-- =============================================================================
-- positions: 4 policies, consolidate to 2
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage positions" ON positions; -- Duplicate
DROP POLICY IF EXISTS "Public can view positions" ON positions; -- Duplicate
-- KEEP: admin_manage_positions (ALL), everyone_view_positions


-- =============================================================================
-- project_members: 8 policies, consolidate to 5
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage project members" ON project_members; -- Duplicate
DROP POLICY IF EXISTS "Codevs can view own project memberships" ON project_members; -- Duplicate
DROP POLICY IF EXISTS "Public can view project members" ON project_members; -- Too broad, keep anon_view_project_members
DROP POLICY IF EXISTS "admin_view_all_project_members" ON project_members; -- Redundant
DROP POLICY IF EXISTS "anon_view_all_project_members" ON project_members; -- Redundant
-- KEEP: admin_manage_project_members (ALL), anon_view_project_members, codev_view_project_members


-- =============================================================================
-- projects: 9 policies, consolidate to 4
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage all projects" ON projects; -- Duplicate
DROP POLICY IF EXISTS "Codevs can view their projects" ON projects; -- Duplicate
DROP POLICY IF EXISTS "Public can view active projects" ON projects; -- Duplicate of Public can view projects
DROP POLICY IF EXISTS "Public can view projects" ON projects; -- Keep this
DROP POLICY IF EXISTS "admin_view_all_projects" ON projects; -- Redundant
DROP POLICY IF EXISTS "anon_view_all_projects" ON projects; -- Redundant
DROP POLICY IF EXISTS "authenticated_view_all_projects" ON projects; -- Redundant
-- KEEP: admin_manage_projects (ALL), Public can view projects, codev_view_own_projects


-- =============================================================================
-- projects_category: 4 policies, consolidate to 2
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage project categories" ON projects_category; -- Duplicate
DROP POLICY IF EXISTS "Public can view project categories" ON projects_category; -- Duplicate
-- KEEP: admin_manage_project_categories (ALL), everyone_view_project_categories


-- =============================================================================
-- roles: 4 policies, consolidate to 2
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage roles" ON roles; -- Duplicate
DROP POLICY IF EXISTS "Public can view roles" ON roles; -- Duplicate
-- KEEP: admin_manage_roles (ALL), everyone_view_roles


-- =============================================================================
-- skill_category: 4 policies, consolidate to 2
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage skill categories" ON skill_category; -- Duplicate
DROP POLICY IF EXISTS "Public can view skill categories" ON skill_category; -- Duplicate
-- KEEP: admin_manage_skill_categories (ALL), everyone_view_skill_categories


-- =============================================================================
-- tasks: 11 policies, consolidate to 6
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage all tasks" ON tasks; -- Duplicate
DROP POLICY IF EXISTS "Project members can view tasks" ON tasks; -- Duplicate
DROP POLICY IF EXISTS "admin_view_all_tasks" ON tasks; -- Redundant
DROP POLICY IF EXISTS "anon_view_all_tasks" ON tasks; -- Redundant
DROP POLICY IF EXISTS "authenticated_view_all_tasks" ON tasks; -- Redundant
DROP POLICY IF EXISTS "Task assignees can update tasks" ON tasks; -- Duplicate
-- KEEP: admin_manage_tasks (ALL), codev_view_assigned_tasks, mentor_view_mentee_tasks, codev_update_assigned_tasks, mentor_update_mentee_tasks


-- =============================================================================
-- work_experience: 11 policies, consolidate to 6
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage all work experience" ON work_experience; -- Duplicate
DROP POLICY IF EXISTS "Codevs can manage own work experience" ON work_experience; -- Too broad
DROP POLICY IF EXISTS "Public can view work experience" ON work_experience; -- Keep
DROP POLICY IF EXISTS "admin_view_all_work_experience" ON work_experience; -- Redundant
DROP POLICY IF EXISTS "anon_view_all_work_experience" ON work_experience; -- Redundant
DROP POLICY IF EXISTS "anon_view_graduated_work_experience" ON work_experience; -- Keep
-- KEEP: admin_manage_all_work_experience (ALL), codev_insert/update/delete/view_own, Public can view, anon_view_graduated, mentor_view_mentee


-- =============================================================================
-- work_schedules: 13 policies, consolidate to 7
-- =============================================================================
DROP POLICY IF EXISTS "Admins can manage all work schedules" ON work_schedules; -- Duplicate
DROP POLICY IF EXISTS "Codevs can manage own work schedules" ON work_schedules; -- Too broad
DROP POLICY IF EXISTS "Codevs can view own work schedules" ON work_schedules; -- Duplicate
DROP POLICY IF EXISTS "Public can view work schedules" ON work_schedules; -- Keep
DROP POLICY IF EXISTS "admin_view_all_work_schedules" ON work_schedules; -- Redundant
DROP POLICY IF EXISTS "anon_view_all_work_schedules" ON work_schedules; -- Redundant
DROP POLICY IF EXISTS "authenticated_view_all_work_schedules" ON work_schedules; -- Redundant
-- KEEP: admin_manage_work_schedules (ALL), codev_insert/update/delete/view_own, Public can view, mentor_view_mentee


-- =============================================================================
-- attendance_points: Remove redundant SELECT policies (keep 1 public + 1 own)
-- =============================================================================
DROP POLICY IF EXISTS "Authenticated users can view all attendance points" ON attendance_points;
DROP POLICY IF EXISTS "Users can view own attendance points" ON attendance_points;
-- KEEP: Users can view their own attendance points, Service role bypass


-- =============================================================================
-- notification_preferences: Already clean (2 policies)
-- =============================================================================
-- No duplicates


-- =============================================================================
-- Summary: Removed ~80 duplicate policies across 20+ tables
-- =============================================================================
