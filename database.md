# Codebility Database Schema Documentation

## Overview

This document provides comprehensive documentation for the Codebility platform database schema. The database is built on PostgreSQL and supports a talent management platform for developers, including project management, attendance tracking, gamification, and career opportunities.

## Core Architecture

### Entity Categories

The database is organized into several functional domains:

- **Core User Management**: User profiles, roles, and authentication
- **Project Management**: Projects, teams, and kanban boards
- **Gamification System**: Points, levels, and skill tracking
- **Job & Career Management**: Job listings, applications, and contracts
- **Communication**: Notifications, posts, and social features
- **Attendance & Time Tracking**: Work schedules and attendance records

---

## Table Documentation

### 👥 Core User Management

#### `codev` - Developer Profiles
Main table for developer/user profiles in the system.

**Key Columns:**
- `id` (uuid, PK): Unique identifier
- `first_name`, `last_name` (text, NOT NULL): User's name
- `email_address` (text, NOT NULL): Primary email
- `application_status` (text): `pending`, `passed`, `failed`
- `internal_status` (text): Current status (default: `TRAINING`)
- `tech_stacks` (array): Technologies the developer knows
- `positions` (array): Job positions/roles
- `availability_status` (boolean): Whether available for projects
- `mentor_id` (uuid): Reference to mentor
- `role_id` (integer): Reference to roles table

**Relationships:**
- Has many: `project_members`, `attendance`, `codev_points`, `tasks`
- Belongs to: `roles` (via role_id)
- Self-referential: `mentor_id` references another codev

#### `roles` - Permission System
Defines user permissions and access levels.

**Key Columns:**
- `id` (integer, PK): Role identifier  
- `name` (text, NOT NULL): Role name
- `dashboard`, `kanban`, `projects`, `applicants`, etc. (boolean): Feature permissions

#### `admin_users` & `mentor_users`
Special user type references for system administration and mentoring.

---

### 🚀 Project Management

#### `projects` - Project Information
Core project data and metadata.

**Key Columns:**
- `id` (uuid, PK): Project identifier
- `name` (text, NOT NULL): Project name
- `description` (text): Project details
- `start_date`, `end_date` (date): Project timeline
- `status` (text): Project status (default: `active`)
- `client_id` (uuid): Reference to client
- `kanban_display` (boolean): Whether to show kanban board
- `meeting_schedule` (jsonb): Meeting configuration

#### `project_members` - Team Assignments
Links developers to projects with roles.

**Key Columns:**
- `id` (uuid, PK)
- `codev_id` (uuid): Reference to developer
- `project_id` (uuid): Reference to project
- `role` (text, NOT NULL): Role in project (e.g., "team_leader", "developer")
- `joined_at` (timestamp): When member joined project

#### `clients` - Client Information
External clients who commission projects.

**Key Columns:**
- `id` (uuid, PK)
- `name` (text, NOT NULL): Client name
- `email`, `phone_number`, `address` (text): Contact info
- `status` (text): Client status (default: `prospect`)
- `client_type` (text): Type of client

#### Kanban System Tables

##### `kanban_boards`
- Board-level organization within projects
- Links to `projects` via `project_id`

##### `kanban_columns` 
- Columns within boards (e.g., "To Do", "In Progress", "Done")
- Ordered by `position` field

##### `kanban_sprints`
- Time-boxed development periods
- Has `start_at` and `end_at` timestamps

##### `tasks`
- Individual work items in the kanban system
- Assigned to developers via `codev_id`
- Categorized by `skill_category_id` for points calculation
- Includes difficulty levels and point values

---

### 🎮 Gamification System

#### `skill_category` - Skill Areas
Defines different skill categories for point tracking.

**Key Columns:**
- `id` (uuid, PK)
- `name` (text, NOT NULL): Category name (e.g., "Technical Skills", "Soft Skills")
- `description` (text): Category description

#### `codev_points` - Individual Points
Tracks points earned by developers in specific categories.

**Key Columns:**
- `id` (uuid, PK)
- `codev_id` (uuid): Reference to developer
- `skill_category_id` (uuid): Reference to skill category
- `points` (integer): Points earned (default: 0)
- `period_type` (text): Time period (default: `all`)

#### `points_history` - Point Transaction Log
Audit trail of all point awards and deductions.

**Key Columns:**
- `id` (uuid, PK)
- `codev_id` (uuid): Who earned/lost points
- `task_id` (uuid): Related task (if applicable)
- `skill_category_id` (uuid): Category of points
- `points` (integer, NOT NULL): Points amount
- `type` (text, NOT NULL): Type of point transaction
- `task_title` (text): Description of what earned points

#### `levels` - Level Definitions
Defines progression levels within skill categories.

**Key Columns:**
- `id` (uuid, PK)
- `skill_category_id` (uuid): Which skill category
- `level` (integer, NOT NULL): Level number
- `min_points`, `max_points` (integer): Point thresholds

#### Point Aggregation Views

##### `codev_total_points`
- Aggregated view combining skill and attendance points
- Shows `total_points`, `skill_points`, `attendance_points`

##### `profile_points`
- Summary points by category for profile display

---

### 💼 Job & Career Management

#### `job_listings` - Available Positions
Public job postings for career opportunities.

**Key Columns:**
- `id` (uuid, PK)
- `title` (text, NOT NULL): Job title
- `description` (text, NOT NULL): Job description
- `department`, `location` (text, NOT NULL): Job details
- `type`, `level` (text): Employment type and experience level
- `requirements` (array): Required skills/experience
- `salary_range` (text): Compensation range
- `remote` (boolean): Remote work option
- `status` (text): Job status (default: `active`)

#### `job_applications` - Application Submissions
Applications submitted for job listings.

**Key Columns:**
- `id` (uuid, PK)
- `job_id` (uuid): Reference to job listing
- `first_name`, `last_name` (text, NOT NULL): Applicant name
- `email`, `phone` (text, NOT NULL): Contact information
- `resume_url`, `portfolio`, `cover_letter` (text): Application materials
- `status` (text): Application status (default: `pending`)
- `years_of_experience` (integer): Experience level
- `reviewed_by` (uuid): Who reviewed the application

#### `job_status` - Developer Employment Status
Current employment information for developers.

**Key Columns:**
- `id` (uuid, PK)
- `codev_id` (uuid): Reference to developer
- `job_title`, `company_name` (text, NOT NULL): Current job info
- `employment_type`, `work_setup` (text, NOT NULL): Job type and setup
- `salary_range` (text): Current compensation
- `status` (text): Employment status (default: `active`)

#### `contracts` - Client Contracts
Formal agreements between developers and clients.

**Key Columns:**
- `id` (uuid, PK)
- `codev_id` (uuid): Developer on contract
- `client_id` (uuid): Client for contract
- `start_date`, `end_date` (date): Contract period
- `payment_amount` (numeric): Contract value
- `contract_type`, `payment_type` (text): Contract details
- `status` (text): Contract status (default: `pending`)

---

### ⏰ Attendance & Time Tracking

#### `attendance` - Daily Attendance Records
Tracks daily work attendance for project members.

**Key Columns:**
- `id` (uuid, PK)
- `codev_id` (uuid): Developer
- `project_id` (uuid): Project being worked on
- `date` (date, NOT NULL): Attendance date
- `status` (text, NOT NULL): `present`, `absent`, `late`, `holiday`, `weekend`
- `check_in`, `check_out` (time): Work hours
- `notes` (text): Additional notes

**Constraints:**
- Unique constraint on `(codev_id, project_id, date)` prevents duplicates

#### `attendance_points` - Attendance-Based Points
Points earned through consistent attendance.

**Key Columns:**
- `id` (uuid, PK)
- `codev_id` (uuid): Developer
- `points` (integer): Points earned (default: 0)
- `last_updated` (date): Last calculation date

#### `work_schedules` - Developer Schedules
Defines working hours and days for developers.

**Key Columns:**
- `id` (uuid, PK)
- `codev_id` (uuid): Developer
- `days_of_week` (array, NOT NULL): Working days
- `start_time`, `end_time` (time, NOT NULL): Daily work hours

---

### 🔔 Communication & Social Features

#### `notifications` - System Notifications
In-app notification system for users.

**Key Columns:**
- `id` (uuid, PK)
- `recipient_id` (uuid, NOT NULL): Who receives notification
- `sender_id` (uuid): Who sent notification (optional)
- `title`, `message` (text, NOT NULL): Notification content
- `type` (text, NOT NULL): Notification category
- `priority` (text): Importance level (default: `normal`)
- `read` (boolean): Whether notification was read
- `action_url` (text): Link for notification action

#### `notification_preferences` - User Notification Settings
User preferences for how they receive notifications.

**Key Columns:**
- `user_id` (uuid, PK)
- `email_enabled`, `push_enabled`, `in_app_enabled` (boolean): Channel preferences
- `type_preferences` (jsonb): Detailed preferences by notification type
- `quiet_hours_enabled` (boolean): Quiet time setting
- `quiet_hours_start`, `quiet_hours_end` (time): Quiet hours window

#### `notification_templates` - Reusable Templates
Templates for consistent notification formatting.

#### `notification_queue` - Email Queue
Queue system for outgoing email notifications.

#### Social Features

##### `posts` - User Posts
Social posts within the platform.

##### `post_upvotes` - Post Engagement
Tracks user engagement with posts.

##### `overflow_post` - Q&A System
Question and answer system similar to Stack Overflow.

##### `social_points` - Social Engagement Points
Points earned through social platform engagement.

---

### 📚 Profile & Education

#### `education` - Educational Background
Academic history for developers.

**Key Columns:**
- `id` (uuid, PK)
- `codev_id` (uuid): Developer
- `institution` (text, NOT NULL): School/university name
- `degree` (text): Degree obtained
- `start_date`, `end_date` (date): Study period
- `description` (text): Additional details

#### `work_experience` - Professional Experience
Work history for developers.

**Key Columns:**
- `id` (uuid, PK)
- `codev_id` (uuid): Developer
- `company_name`, `position` (text, NOT NULL): Job details
- `location` (text, NOT NULL): Job location
- `date_from`, `date_to` (date): Employment period
- `is_present` (boolean): Current job indicator
- `description` (text): Job responsibilities

#### `applicant` - Application Process
Tracks the application process for prospective developers.

**Key Columns:**
- `id` (uuid, PK)
- `codev_id` (uuid): Reference to developer profile
- `test_taken` (timestamp): When coding test was completed
- `fork_url` (text): GitHub fork for coding test
- `joined_discord`, `joined_messenger` (boolean): Platform onboarding status

---

### 🔐 Security & Legal

#### `nda_requests` - NDA Management
Tracks Non-Disclosure Agreement signing process.

**Key Columns:**
- `id` (uuid, PK)
- `codev_id` (uuid, NOT NULL): Developer who needs to sign
- `token` (text, NOT NULL): Unique signing token
- `status` (text, NOT NULL): `pending`, `completed`, etc.
- `expires_at` (timestamp, NOT NULL): Token expiration
- `completed_at` (timestamp): When NDA was signed

---

## Key Relationships

### User → Projects Flow
```
codev → project_members → projects
  ↓
attendance (by project)
  ↓
points calculation
```

### Gamification Flow
```
tasks → skill_category → codev_points
  ↓
points_history (audit trail)
  ↓
levels (progression)
```

### Job Application Flow
```
job_listings → job_applications → codev
  ↓
contracts (if hired)
  ↓
project_members (project assignment)
```

## Database Design Patterns

### 1. **Soft Deletes**
Most tables use status fields rather than hard deletes:
- `projects.status = 'active'`
- `job_listings.status = 'active'`
- `contracts.status = 'pending'`

### 2. **Audit Trails**
Many tables include created/updated timestamps:
- `created_at`, `updated_at` columns
- `points_history` for point changes
- `notification_queue` for delivery tracking

### 3. **Flexible JSON Storage**
JSONB columns for complex data:
- `notification_preferences.type_preferences`
- `projects.meeting_schedule`
- `codev.level`

### 4. **UUID Primary Keys**
Most tables use UUIDs for better distributed system support and security.

### 5. **Array Columns**
PostgreSQL arrays for multi-value fields:
- `codev.tech_stacks[]`
- `job_listings.requirements[]`
- `work_schedules.days_of_week[]`

## Performance Considerations

### Recommended Indexes

```sql
-- Attendance lookups
CREATE INDEX idx_attendance_project_date ON attendance(project_id, date);
CREATE INDEX idx_attendance_codev_date ON attendance(codev_id, date);

-- Points queries
CREATE INDEX idx_codev_points_category ON codev_points(skill_category_id, codev_id);
CREATE INDEX idx_points_history_codev ON points_history(codev_id, created_at);

-- Job applications
CREATE INDEX idx_job_applications_status ON job_applications(status, applied_at);

-- Notifications
CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, created_at);
CREATE INDEX idx_notifications_unread ON notifications(recipient_id) WHERE read = false;
```

### Query Optimization Tips

1. **Use materialized views** for complex leaderboard queries
2. **Partition large tables** like `points_history` by date
3. **Use connection pooling** for high-traffic endpoints
4. **Cache frequently accessed data** like skill categories and levels

## Common Query Patterns

### Get Developer Leaderboard
```sql
SELECT 
  c.first_name, 
  c.last_name,
  COALESCE(SUM(cp.points), 0) as total_points
FROM codev c
LEFT JOIN codev_points cp ON c.id = cp.codev_id
WHERE c.application_status = 'passed'
GROUP BY c.id, c.first_name, c.last_name
ORDER BY total_points DESC;
```

### Get Project Team Members
```sql
SELECT 
  c.first_name,
  c.last_name,
  pm.role,
  pm.joined_at
FROM project_members pm
JOIN codev c ON pm.codev_id = c.id
WHERE pm.project_id = $1;
```

### Check Attendance for Date Range
```sql
SELECT 
  a.date,
  a.status,
  a.check_in,
  a.check_out
FROM attendance a
WHERE a.codev_id = $1 
  AND a.project_id = $2
  AND a.date BETWEEN $3 AND $4
ORDER BY a.date;
```

## Migration Best Practices

1. **Always backup** before schema changes
2. **Use transactions** for multi-statement migrations
3. **Test migrations** on staging environment first
4. **Create indexes concurrently** to avoid locks
5. **Monitor performance** after schema changes

## Security Considerations

1. **Row Level Security (RLS)** policies on sensitive tables
2. **Input validation** using CHECK constraints
3. **Audit logging** for sensitive operations
4. **Connection encryption** and proper authentication
5. **Regular security updates** for PostgreSQL

---

*Last updated: $(date)*
*Database version: PostgreSQL 14+*
*Total tables: 47*