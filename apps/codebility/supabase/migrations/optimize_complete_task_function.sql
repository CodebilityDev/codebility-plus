-- Optimize the complete_task function for better performance
CREATE OR REPLACE FUNCTION complete_task(
    task_id uuid,
    task_points integer,
    primary_codev_id uuid,
    skill_category_id uuid,
    sidekick_ids uuid[] DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    sidekick_points integer;
    sidekick_id uuid;
    result json;
BEGIN
    -- Use a single transaction
    BEGIN
        -- 1. Batch update/insert for primary assignee points
        INSERT INTO codev_points (
            codev_id,
            skill_category_id,
            points,
            period_type,
            created_at,
            updated_at
        ) VALUES (
            primary_codev_id,
            complete_task.skill_category_id,
            task_points,
            'all',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (codev_id, skill_category_id) 
        DO UPDATE SET 
            points = codev_points.points + EXCLUDED.points,
            updated_at = CURRENT_TIMESTAMP;

        -- 2. Insert points history
        INSERT INTO points_history (
            codev_id,
            task_id,
            points,
            skill_category_id,
            type,
            awarded_at,
            created_at
        ) VALUES (
            primary_codev_id,
            complete_task.task_id,
            task_points,
            complete_task.skill_category_id,
            'task_completion',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );

        -- 3. Handle sidekick points if any
        IF sidekick_ids IS NOT NULL AND array_length(sidekick_ids, 1) > 0 THEN
            sidekick_points := FLOOR(task_points * 0.5);
            
            -- Batch insert/update for all sidekicks
            INSERT INTO codev_points (
                codev_id,
                skill_category_id,
                points,
                period_type,
                created_at,
                updated_at
            )
            SELECT 
                unnest(sidekick_ids),
                complete_task.skill_category_id,
                sidekick_points,
                'all',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            ON CONFLICT (codev_id, skill_category_id) 
            DO UPDATE SET 
                points = codev_points.points + EXCLUDED.points,
                updated_at = CURRENT_TIMESTAMP;

            -- Batch insert points history for sidekicks
            INSERT INTO points_history (
                codev_id,
                task_id,
                points,
                skill_category_id,
                type,
                awarded_at,
                created_at
            )
            SELECT 
                unnest(sidekick_ids),
                complete_task.task_id,
                sidekick_points,
                complete_task.skill_category_id,
                'sidekick_task_completion',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP;
        END IF;

        -- 4. Update levels using a more efficient approach
        -- Update primary assignee level
        WITH skill_points AS (
            SELECT 
                cp.skill_category_id,
                cp.points,
                l.level
            FROM codev_points cp
            LEFT JOIN LATERAL (
                SELECT level 
                FROM levels l
                WHERE l.skill_category_id = cp.skill_category_id
                AND l.min_points <= cp.points
                ORDER BY l.level DESC
                LIMIT 1
            ) l ON true
            WHERE cp.codev_id = primary_codev_id
        )
        UPDATE codev 
        SET level = (
            SELECT jsonb_object_agg(skill_category_id::text, level)
            FROM skill_points
            WHERE level IS NOT NULL
        )
        WHERE id = primary_codev_id;

        -- Update sidekick levels if any
        IF sidekick_ids IS NOT NULL AND array_length(sidekick_ids, 1) > 0 THEN
            WITH sidekick_levels AS (
                SELECT 
                    cp.codev_id,
                    jsonb_object_agg(
                        cp.skill_category_id::text, 
                        l.level
                    ) FILTER (WHERE l.level IS NOT NULL) as levels_json
                FROM codev_points cp
                LEFT JOIN LATERAL (
                    SELECT level 
                    FROM levels l
                    WHERE l.skill_category_id = cp.skill_category_id
                    AND l.min_points <= cp.points
                    ORDER BY l.level DESC
                    LIMIT 1
                ) l ON true
                WHERE cp.codev_id = ANY(sidekick_ids)
                GROUP BY cp.codev_id
            )
            UPDATE codev c
            SET level = sl.levels_json
            FROM sidekick_levels sl
            WHERE c.id = sl.codev_id;
        END IF;

        -- 5. Delete the task
        DELETE FROM tasks WHERE id = complete_task.task_id;

        -- Return success
        RETURN json_build_object(
            'success', true,
            'message', 'Task completed successfully'
        );
        
    EXCEPTION
        WHEN OTHERS THEN
            -- Return error
            RETURN json_build_object(
                'success', false,
                'error', SQLERRM
            );
    END;
END;
$$;

-- Create missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_codev_points_lookup ON codev_points(codev_id, skill_category_id);
CREATE INDEX IF NOT EXISTS idx_levels_lookup ON levels(skill_category_id, min_points);
CREATE INDEX IF NOT EXISTS idx_points_history_codev ON points_history(codev_id);
CREATE INDEX IF NOT EXISTS idx_tasks_column ON tasks(kanban_column_id);

-- Add unique constraint for codev_points if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'codev_points_codev_skill_unique'
    ) THEN
        ALTER TABLE codev_points 
        ADD CONSTRAINT codev_points_codev_skill_unique 
        UNIQUE (codev_id, skill_category_id);
    END IF;
END $$;