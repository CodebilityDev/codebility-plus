# Codebility Database Migrations

This directory contains all SQL migrations for the Codebility application.

## Migration Naming Convention

Migrations follow the format: `YYYYMMDD_description.sql`

Example: `20251128_add_onboarding_system.sql`

## How to Apply Migrations

### Using Supabase CLI
```bash
cd apps/codebility
supabase db push
```

### Using SQL Editor
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the migration file content
4. Execute the query

## Migration Categories

### Onboarding System
- `add_quiz_and_commitment_fields.sql` - Adds quiz, commitment, and mobile capability fields
- `create_onboarding_videos_table.sql` - Creates table for tracking video progress

### Attendance System  
- `20250118_create_attendance_tables.sql` - Core attendance tracking
- `20250119_add_excused_status_to_attendance.sql` - Adds excused status
- `fix_attendance_warning_for_new_members.sql` - Fixes warnings for new members

### Notification System
- `create_notification_system.sql` - Core notification infrastructure
- `fix_notification_rls_policies.sql` - Row Level Security policies
- `simple_notification_fix.sql` - Additional notification fixes

### Projects
- `20250118_add_meeting_schedule_to_projects.sql` - Meeting schedules
- `20251127_project_category_many_to_many.sql` - Many-to-many project categories

### Other Features
- `create_news_banner_system.sql` - News banner infrastructure
- `create_proposal_system.sql` - Proposal system
- `create_survey_system.sql` - In-app surveys
- `create_in_app_survey_system.sql` - Enhanced survey system

## Important Notes

- Always backup your database before running migrations
- Test migrations in a staging environment first
- Migrations should be idempotent when possible (use IF NOT EXISTS, etc.)
- Add proper comments to explain complex logic

## Video Files

Onboarding videos are stored separately in Supabase Storage:
- Location: `public/onboarding-videos/`
- Files: `part1.mp4`, `part2.mp4`, `part3.mp4`, `part4.mp4`
- Upload via Supabase Dashboard → Storage → Create/Select bucket → Upload files
