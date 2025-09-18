-- Create the new_complete_task RPC function for efficient task completion
CREATE OR REPLACE FUNCTION new_complete_task(
  task_id UUID,
  task_points INT,
  primary_codev_id UUID,
  skill_category_id UUID,
  sidekick_ids UUID[] DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  sidekick_id UUID;
  sidekick_points INT;
  existing_points RECORD;
  result JSONB;
BEGIN
  -- Start transaction
  BEGIN
    -- 1. Award points to primary assignee
    IF primary_codev_id IS NOT NULL AND skill_category_id IS NOT NULL THEN
      -- Check if points record exists
      SELECT * INTO existing_points
      FROM codev_points
      WHERE codev_id = primary_codev_id
        AND skill_category_id = new_complete_task.skill_category_id;
      
      IF existing_points.id IS NOT NULL THEN
        -- Update existing points
        UPDATE codev_points
        SET points = points + task_points,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = existing_points.id;
      ELSE
        -- Insert new points record
        INSERT INTO codev_points (codev_id, skill_category_id, points, created_at, updated_at)
        VALUES (primary_codev_id, new_complete_task.skill_category_id, task_points, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
      END IF;
    END IF;

    -- 2. Award points to sidekicks (50% of task points)
    IF sidekick_ids IS NOT NULL AND array_length(sidekick_ids, 1) > 0 THEN
      sidekick_points := FLOOR(task_points * 0.5);
      
      FOREACH sidekick_id IN ARRAY sidekick_ids
      LOOP
        -- Check if points record exists for sidekick
        SELECT * INTO existing_points
        FROM codev_points
        WHERE codev_id = sidekick_id
          AND skill_category_id = new_complete_task.skill_category_id;
        
        IF existing_points.id IS NOT NULL THEN
          -- Update existing points
          UPDATE codev_points
          SET points = points + sidekick_points,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = existing_points.id;
        ELSE
          -- Insert new points record
          INSERT INTO codev_points (codev_id, skill_category_id, points, created_at, updated_at)
          VALUES (sidekick_id, new_complete_task.skill_category_id, sidekick_points, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        END IF;
      END LOOP;
    END IF;

    -- 3. Archive the task (instead of deleting)
    UPDATE task
    SET is_archive = true,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = task_id;

    -- 4. Update developer levels
    -- Call the update_developer_levels function for primary assignee
    IF primary_codev_id IS NOT NULL THEN
      PERFORM update_developer_levels(primary_codev_id);
    END IF;
    
    -- Update levels for sidekicks
    IF sidekick_ids IS NOT NULL AND array_length(sidekick_ids, 1) > 0 THEN
      FOREACH sidekick_id IN ARRAY sidekick_ids
      LOOP
        PERFORM update_developer_levels(sidekick_id);
      END LOOP;
    END IF;

    -- Return success
    result := jsonb_build_object(
      'success', true,
      'message', 'Task completed successfully'
    );
    
    RETURN result;
    
  EXCEPTION
    WHEN OTHERS THEN
      -- Return error
      result := jsonb_build_object(
        'success', false,
        'error', SQLERRM
      );
      RETURN result;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION new_complete_task TO authenticated;

-- Create the update_developer_levels function if it doesn't exist
CREATE OR REPLACE FUNCTION update_developer_levels(p_codev_id UUID)
RETURNS VOID AS $$
DECLARE
  skill_record RECORD;
  total_points INT := 0;
  skill_levels JSONB := '{}'::jsonb;
  skill_level TEXT;
BEGIN
  -- Calculate total points and levels for each skill category
  FOR skill_record IN
    SELECT 
      sc.id as category_id,
      sc.title as category_title,
      COALESCE(cp.points, 0) as points
    FROM skill_category sc
    LEFT JOIN codev_points cp ON cp.skill_category_id = sc.id AND cp.codev_id = p_codev_id
  LOOP
    total_points := total_points + skill_record.points;
    
    -- Determine level based on points
    CASE
      WHEN skill_record.points >= 1000 THEN
        skill_level := 'Expert';
      WHEN skill_record.points >= 500 THEN
        skill_level := 'Advanced';
      WHEN skill_record.points >= 200 THEN
        skill_level := 'Intermediate';
      WHEN skill_record.points >= 50 THEN
        skill_level := 'Beginner';
      ELSE
        skill_level := 'Novice';
    END CASE;
    
    -- Add to levels JSON
    skill_levels := skill_levels || jsonb_build_object(
      skill_record.category_title,
      jsonb_build_object(
        'level', skill_level,
        'points', skill_record.points
      )
    );
  END LOOP;
  
  -- Update codev table with new levels
  UPDATE codev
  SET 
    level = skill_levels,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = p_codev_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_developer_levels TO authenticated;

-- Add index for better performance on task queries
CREATE INDEX IF NOT EXISTS idx_task_is_archive ON task(is_archive);
CREATE INDEX IF NOT EXISTS idx_task_board_column ON task(kanban_column_id, is_archive);
CREATE INDEX IF NOT EXISTS idx_codev_points_lookup ON codev_points(codev_id, skill_category_id);