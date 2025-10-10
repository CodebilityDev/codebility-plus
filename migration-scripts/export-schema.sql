-- ==============================================
-- SUPABASE SCHEMA EXPORT SCRIPT
-- ==============================================
-- This script will help you export your schema structure
-- Run this in your OLD Supabase SQL Editor

-- 1. Export all table schemas
SELECT 'CREATE TABLE ' || schemaname || '.' || tablename || ' (' ||
       string_agg(column_name || ' ' || data_type ||
                  CASE 
                    WHEN character_maximum_length IS NOT NULL 
                    THEN '(' || character_maximum_length || ')'
                    ELSE ''
                  END ||
                  CASE 
                    WHEN is_nullable = 'NO' THEN ' NOT NULL'
                    ELSE ''
                  END, ', ') || ');'
FROM information_schema.tables t
JOIN information_schema.columns c ON c.table_name = t.tablename
WHERE t.schemaname = 'public'
GROUP BY schemaname, tablename;

-- 2. Export all primary keys
SELECT 'ALTER TABLE ' || tc.table_schema || '.' || tc.table_name || 
       ' ADD CONSTRAINT ' || tc.constraint_name || 
       ' PRIMARY KEY (' || string_agg(kcu.column_name, ', ') || ');'
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'PRIMARY KEY' 
    AND tc.table_schema = 'public'
GROUP BY tc.table_schema, tc.table_name, tc.constraint_name;

-- 3. Export all foreign keys
SELECT 'ALTER TABLE ' || tc.table_schema || '.' || tc.table_name ||
       ' ADD CONSTRAINT ' || tc.constraint_name ||
       ' FOREIGN KEY (' || kcu.column_name || ')' ||
       ' REFERENCES ' || ccu.table_schema || '.' || ccu.table_name ||
       '(' || ccu.column_name || ');'
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public';

-- 4. Export all indexes
SELECT indexdef FROM pg_indexes 
WHERE schemaname = 'public' 
    AND indexname NOT LIKE '%_pkey';

-- 5. Export all functions
SELECT pg_get_functiondef(p.oid) || ';'
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public';

-- 6. Export all triggers
SELECT 'CREATE TRIGGER ' || trigger_name || 
       ' ' || action_timing || ' ' || string_agg(event_manipulation, ' OR ') ||
       ' ON ' || event_object_table ||
       ' FOR EACH ' || action_orientation ||
       ' EXECUTE FUNCTION ' || action_statement || ';'
FROM information_schema.triggers
WHERE trigger_schema = 'public'
GROUP BY trigger_name, action_timing, event_object_table, action_orientation, action_statement;

-- 7. Export RLS policies
SELECT 'CREATE POLICY ' || policyname || ' ON ' || tablename ||
       ' FOR ' || cmd || ' TO ' || array_to_string(roles, ', ') ||
       CASE WHEN qual IS NOT NULL THEN ' USING (' || qual || ')' ELSE '' END ||
       CASE WHEN with_check IS NOT NULL THEN ' WITH CHECK (' || with_check || ')' ELSE '' END || ';'
FROM pg_policies
WHERE schemaname = 'public';

-- 8. Export table permissions
SELECT 'GRANT ' || privilege_type || ' ON ' || table_schema || '.' || table_name || 
       ' TO ' || grantee || ';'
FROM information_schema.role_table_grants
WHERE table_schema = 'public';