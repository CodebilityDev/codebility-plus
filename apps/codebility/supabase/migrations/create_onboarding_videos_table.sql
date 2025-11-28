-- Create onboarding_videos table to track video completion progress
CREATE TABLE IF NOT EXISTS public.onboarding_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    applicant_id UUID NOT NULL,
    video_number INTEGER NOT NULL CHECK (video_number >= 1 AND video_number <= 4),
    completed BOOLEAN DEFAULT FALSE,
    watched_duration NUMERIC DEFAULT 0,
    total_duration NUMERIC DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Foreign key constraint (assuming applicant table exists)
    CONSTRAINT fk_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES public.applicant(id)
        ON DELETE CASCADE,

    -- Unique constraint to prevent duplicate entries
    CONSTRAINT unique_applicant_video
        UNIQUE (applicant_id, video_number)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_onboarding_videos_applicant_id
    ON public.onboarding_videos(applicant_id);

CREATE INDEX IF NOT EXISTS idx_onboarding_videos_video_number
    ON public.onboarding_videos(video_number);

-- Enable Row Level Security
ALTER TABLE public.onboarding_videos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own onboarding progress
CREATE POLICY "Users can view their own onboarding progress"
    ON public.onboarding_videos
    FOR SELECT
    USING (
        applicant_id IN (
            SELECT id FROM public.applicant WHERE codev_id = auth.uid()
        )
    );

-- Create policy to allow users to insert their own onboarding progress
CREATE POLICY "Users can insert their own onboarding progress"
    ON public.onboarding_videos
    FOR INSERT
    WITH CHECK (
        applicant_id IN (
            SELECT id FROM public.applicant WHERE codev_id = auth.uid()
        )
    );

-- Create policy to allow users to update their own onboarding progress
CREATE POLICY "Users can update their own onboarding progress"
    ON public.onboarding_videos
    FOR UPDATE
    USING (
        applicant_id IN (
            SELECT id FROM public.applicant WHERE codev_id = auth.uid()
        )
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_onboarding_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
CREATE TRIGGER update_onboarding_videos_updated_at
    BEFORE UPDATE ON public.onboarding_videos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_onboarding_videos_updated_at();

-- Add helpful comment to the table
COMMENT ON TABLE public.onboarding_videos IS 'Tracks applicant progress through onboarding videos';
COMMENT ON COLUMN public.onboarding_videos.video_number IS 'Video number (1-4)';
COMMENT ON COLUMN public.onboarding_videos.watched_duration IS 'Duration watched in seconds';
COMMENT ON COLUMN public.onboarding_videos.total_duration IS 'Total video duration in seconds';
COMMENT ON COLUMN public.onboarding_videos.completed IS 'Whether the video has been completed (watched >= 90%)';
