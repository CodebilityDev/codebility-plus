-- =============================================
-- IN-APP SURVEY SYSTEM WITH JSONB
-- =============================================
-- This migration creates the in-app survey system using JSONB
-- for flexible question types and response storage.
--
-- Tables:
-- 1. survey_questions - Stores questions for each survey
-- 2. survey_responses - Stores user responses with JSONB answers
-- =============================================

-- =============================================
-- 1. UPDATE SURVEYS TABLE
-- =============================================
-- Make survey_url optional since surveys can now be in-app
ALTER TABLE surveys
  ALTER COLUMN survey_url DROP NOT NULL;

-- Add a flag to distinguish between internal and external surveys
ALTER TABLE surveys
  ADD COLUMN is_external BOOLEAN DEFAULT false;

COMMENT ON COLUMN surveys.is_external IS 'True if survey links to external URL (Google Forms, etc), False if built in-app';

-- =============================================
-- 2. SURVEY QUESTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,

  -- Question content
  question_text TEXT NOT NULL,
  description TEXT, -- Optional help text

  -- Question type: text, textarea, multiple_choice, checkbox, rating, date
  question_type VARCHAR(50) NOT NULL CHECK (question_type IN (
    'text',           -- Short text answer
    'textarea',       -- Long text answer
    'multiple_choice',-- Single selection from options
    'checkbox',       -- Multiple selections from options
    'rating',         -- 1-5 or 1-10 rating scale
    'date',           -- Date picker
    'email',          -- Email input with validation
    'number'          -- Numeric input
  )),

  -- Options for multiple_choice, checkbox (stored as JSONB array)
  -- Example: ["Option 1", "Option 2", "Option 3"]
  options JSONB DEFAULT '[]',

  -- Question settings (stored as JSONB for flexibility)
  -- Example: {"required": true, "min_rating": 1, "max_rating": 5}
  settings JSONB DEFAULT '{
    "required": false,
    "placeholder": ""
  }',

  -- Display order
  order_index INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_survey_questions_survey ON survey_questions(survey_id);
CREATE INDEX idx_survey_questions_order ON survey_questions(survey_id, order_index);

-- =============================================
-- 3. SURVEY RESPONSES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,

  -- Respondent (optional - can be anonymous)
  respondent_id UUID REFERENCES codev(id) ON DELETE SET NULL,
  respondent_email VARCHAR(255), -- For anonymous responses

  -- All answers stored as JSONB
  -- Example: {
  --   "question_id_1": "Short answer",
  --   "question_id_2": ["Option 1", "Option 2"],
  --   "question_id_3": 5
  -- }
  answers JSONB NOT NULL DEFAULT '{}',

  -- Response metadata
  ip_address INET, -- For duplicate prevention
  user_agent TEXT,

  -- Status
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('draft', 'completed')),

  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_survey_responses_survey ON survey_responses(survey_id);
CREATE INDEX idx_survey_responses_respondent ON survey_responses(respondent_id);
CREATE INDEX idx_survey_responses_submitted ON survey_responses(submitted_at DESC);
CREATE INDEX idx_survey_responses_answers ON survey_responses USING gin(answers);

-- =============================================
-- 4. HELPER FUNCTIONS
-- =============================================

-- Function to get survey statistics
CREATE OR REPLACE FUNCTION get_survey_statistics(p_survey_id UUID)
RETURNS TABLE (
  total_responses BIGINT,
  completed_responses BIGINT,
  draft_responses BIGINT,
  unique_respondents BIGINT,
  last_response_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_responses,
    COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as completed_responses,
    COUNT(*) FILTER (WHERE status = 'draft')::BIGINT as draft_responses,
    COUNT(DISTINCT respondent_id)::BIGINT as unique_respondents,
    MAX(submitted_at) as last_response_at
  FROM survey_responses
  WHERE survey_id = p_survey_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get question response summary (for multiple choice/checkbox)
CREATE OR REPLACE FUNCTION get_question_response_summary(
  p_survey_id UUID,
  p_question_id UUID
)
RETURNS TABLE (
  option_value TEXT,
  response_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    jsonb_array_elements_text(answers->p_question_id::text) as option_value,
    COUNT(*)::BIGINT as response_count
  FROM survey_responses
  WHERE survey_id = p_survey_id
    AND answers ? p_question_id::text
    AND status = 'completed'
  GROUP BY option_value
  ORDER BY response_count DESC;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 5. ROW LEVEL SECURITY
-- =============================================

-- Enable RLS
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Survey Questions Policies
-- Anyone can view questions for active surveys
CREATE POLICY "Anyone can view survey questions"
  ON survey_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM surveys
      WHERE surveys.id = survey_questions.survey_id
      AND surveys.is_active = true
    )
  );

-- Only admins can manage questions
CREATE POLICY "Admins can manage survey questions"
  ON survey_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM codev
      WHERE codev.id::text = auth.uid()::text
      AND codev.role_id = 1
    )
  );

-- Survey Responses Policies
-- Users can view their own responses
CREATE POLICY "Users can view their own responses"
  ON survey_responses FOR SELECT
  USING (
    respondent_id::text = auth.uid()::text
    OR EXISTS (
      SELECT 1 FROM codev
      WHERE codev.id::text = auth.uid()::text
      AND codev.role_id = 1
    )
  );

-- Users can create responses
CREATE POLICY "Users can create responses"
  ON survey_responses FOR INSERT
  WITH CHECK (true); -- Allow anyone to respond

-- Admins can view all responses
CREATE POLICY "Admins can view all responses"
  ON survey_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM codev
      WHERE codev.id::text = auth.uid()::text
      AND codev.role_id = 1
    )
  );

-- =============================================
-- 6. TRIGGERS
-- =============================================

-- Update timestamp trigger for survey_questions
CREATE OR REPLACE FUNCTION update_survey_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_survey_questions_timestamp
BEFORE UPDATE ON survey_questions
FOR EACH ROW
EXECUTE FUNCTION update_survey_questions_updated_at();

-- =============================================
-- 7. COMMENTS
-- =============================================

COMMENT ON TABLE survey_questions IS 'Survey questions with JSONB options for flexibility';
COMMENT ON TABLE survey_responses IS 'Survey responses with JSONB answers for all question types';
COMMENT ON COLUMN survey_questions.options IS 'Array of options for multiple_choice/checkbox questions';
COMMENT ON COLUMN survey_questions.settings IS 'Question-specific settings like required, min/max values';
COMMENT ON COLUMN survey_responses.answers IS 'All answers stored as key-value pairs: question_id -> answer';

-- =============================================
-- END OF MIGRATION
-- =============================================
