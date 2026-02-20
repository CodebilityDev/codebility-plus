-- Automatically archive/clean up applicant records when application_status changes to "passed"
-- This prevents dual-status issues where users appear in both applicants and in-house

-- Create a new table to archive applicant data for historical purposes
CREATE TABLE IF NOT EXISTS applicant_archive (
  id UUID PRIMARY KEY,
  codev_id UUID NOT NULL,
  test_taken TIMESTAMPTZ,
  fork_url TEXT,
  reminded_count INTEGER DEFAULT 0,
  last_reminded_date TIMESTAMPTZ,
  quiz_score INTEGER,
  quiz_total INTEGER,
  quiz_passed BOOLEAN,
  quiz_completed_at TIMESTAMPTZ,
  can_do_mobile BOOLEAN,
  commitment_signed_at TIMESTAMPTZ,
  signature_data TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_codev FOREIGN KEY (codev_id) REFERENCES codev(id) ON DELETE CASCADE
);

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS idx_applicant_archive_codev_id ON applicant_archive(codev_id);
CREATE INDEX IF NOT EXISTS idx_applicant_archive_archived_at ON applicant_archive(archived_at);

-- Add comment
COMMENT ON TABLE applicant_archive IS 'Archives applicant data when they become accepted (status = passed)';

-- Create function to archive applicant data when status changes to "passed"
CREATE OR REPLACE FUNCTION archive_applicant_on_passed()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if application_status changed to "passed"
  IF NEW.application_status = 'passed' AND (OLD.application_status IS NULL OR OLD.application_status != 'passed') THEN
    -- Move the applicant record to archive table
    INSERT INTO applicant_archive (
      id,
      codev_id,
      test_taken,
      fork_url,
      reminded_count,
      last_reminded_date,
      quiz_score,
      quiz_total,
      quiz_passed,
      quiz_completed_at,
      can_do_mobile,
      commitment_signed_at,
      signature_data,
      created_at,
      updated_at
    )
    SELECT
      id,
      codev_id,
      test_taken,
      fork_url,
      reminded_count,
      last_reminded_date,
      quiz_score,
      quiz_total,
      quiz_passed,
      quiz_completed_at,
      can_do_mobile,
      commitment_signed_at,
      signature_data,
      created_at,
      updated_at
    FROM applicant
    WHERE codev_id = NEW.id
    ON CONFLICT (id) DO NOTHING; -- Prevent duplicate archives

    -- Delete the original applicant record
    DELETE FROM applicant WHERE codev_id = NEW.id;

    RAISE NOTICE 'Applicant record archived for codev_id: %', NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires after codev application_status is updated
DROP TRIGGER IF EXISTS trigger_archive_applicant_on_passed ON codev;
CREATE TRIGGER trigger_archive_applicant_on_passed
  AFTER UPDATE OF application_status ON codev
  FOR EACH ROW
  EXECUTE FUNCTION archive_applicant_on_passed();

-- Add RLS policies for applicant_archive
ALTER TABLE applicant_archive ENABLE ROW LEVEL SECURITY;

-- Admins can view archived applicant data
CREATE POLICY "Admins can view applicant_archive"
  ON applicant_archive FOR SELECT
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));

COMMENT ON FUNCTION archive_applicant_on_passed() IS 'Automatically archives applicant records to applicant_archive table when application_status changes to passed';
