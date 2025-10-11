-- ==============================================
-- SUPABASE DATA EXPORT SCRIPT
-- ==============================================
-- This script will help you export all your data
-- Run this in your OLD Supabase SQL Editor

-- First, let's see all tables in your database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ==============================================
-- COPY COMMANDS FOR EACH TABLE
-- ==============================================
-- Replace 'your_table_name' with actual table names from above query
-- Run these one by one to export data to CSV files

-- Example for common tables (adjust based on your actual tables):

-- Export users/codev table
COPY (SELECT * FROM codev) TO STDOUT WITH CSV HEADER;

-- Export roles table
COPY (SELECT * FROM roles) TO STDOUT WITH CSV HEADER;

-- Export projects table
COPY (SELECT * FROM project) TO STDOUT WITH CSV HEADER;

-- Export project_members table
COPY (SELECT * FROM project_members) TO STDOUT WITH CSV HEADER;

-- Export education table
COPY (SELECT * FROM education) TO STDOUT WITH CSV HEADER;

-- Export work_experience table
COPY (SELECT * FROM work_experience) TO STDOUT WITH CSV HEADER;

-- Export codev_points table
COPY (SELECT * FROM codev_points) TO STDOUT WITH CSV HEADER;

-- Export skill_categories table
COPY (SELECT * FROM skill_category) TO STDOUT WITH CSV HEADER;

-- Export kanban tables
COPY (SELECT * FROM kanban_board) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM kanban_column) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM kanban_sprint) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM task) TO STDOUT WITH CSV HEADER;

-- Export attendance tables
COPY (SELECT * FROM attendance) TO STDOUT WITH CSV HEADER;
COPY (SELECT * FROM attendance_summary) TO STDOUT WITH CSV HEADER;

-- Export job_listings table
COPY (SELECT * FROM job_listings) TO STDOUT WITH CSV HEADER;

-- Export job_applications table
COPY (SELECT * FROM job_applications) TO STDOUT WITH CSV HEADER;

-- ==============================================
-- GENERATE DYNAMIC COPY COMMANDS
-- ==============================================
-- This will generate COPY commands for all your tables automatically
SELECT 'COPY (SELECT * FROM ' || table_name || ') TO STDOUT WITH CSV HEADER;' as copy_command
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    AND table_name NOT LIKE '%_pkey'
ORDER BY table_name;