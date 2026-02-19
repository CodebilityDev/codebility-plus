-- Drop obsolete RPC function that references deleted social_points_categories table
-- This table was removed in 20260219_schema_fixes.sql as it had zero references

-- Check if the function exists before dropping
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND p.proname = 'calculate_social_points'
  ) THEN
    DROP FUNCTION IF EXISTS public.calculate_social_points;
    RAISE NOTICE 'Dropped obsolete calculate_social_points function';
  ELSE
    RAISE NOTICE 'Function calculate_social_points does not exist, nothing to drop';
  END IF;
END $$;
