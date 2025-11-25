-- Check existing columns in projects table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'projects' 
    AND table_schema = 'public'
ORDER BY ordinal_position;