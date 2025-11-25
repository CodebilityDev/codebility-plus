-- Create table to track dismissed surveys
CREATE TABLE IF NOT EXISTS survey_dismissals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES codev(id) ON DELETE CASCADE,
  dismissed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(survey_id, user_id)
);

-- Add RLS policies
ALTER TABLE survey_dismissals ENABLE ROW LEVEL SECURITY;

-- Users can see their own dismissals
CREATE POLICY "Users can view their own dismissals"
  ON survey_dismissals
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own dismissals
CREATE POLICY "Users can create their own dismissals"
  ON survey_dismissals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own dismissals (to re-show survey)
CREATE POLICY "Users can delete their own dismissals"
  ON survey_dismissals
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_survey_dismissals_user_id ON survey_dismissals(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_dismissals_survey_id ON survey_dismissals(survey_id);
