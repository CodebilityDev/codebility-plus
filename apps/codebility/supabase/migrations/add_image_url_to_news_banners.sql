-- Migration: Add image_url field to news_banners table
-- Description: Adds image upload capability to news banners for existing installations

-- Add image_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'news_banners' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE news_banners ADD COLUMN image_url VARCHAR(500);
        COMMENT ON COLUMN news_banners.image_url IS 'Optional banner image stored in Supabase bucket - banner folder';
    END IF;
END $$;