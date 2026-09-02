-- Denormalized landing rank matching utils/codev-priority.ts (prioritizeCodevs / rankLevelOfBadge).
-- Running this migration backfills every codev row via recompute_codev_landing_rank_score.
-- Triggers keep the score updated on later writes.

ALTER TABLE codev
  ADD COLUMN IF NOT EXISTS landing_rank_score bigint NOT NULL DEFAULT 0;

/**
 * Pack sort keys into one bigint (DESC order ≈ prioritizeCodevs):
 * 1. totalPoints (badge-linked codev_points only)
 * 2. hasLevel2OrAbove
 * 3. validBadgeCount
 * 4. has image_url
 * 5. has work_experience
 * 6. years_of_experience
 */
CREATE OR REPLACE FUNCTION public.recompute_codev_landing_rank_score(p_codev_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_total_points bigint := 0;
  v_has_level2 boolean := false;
  v_badge_count integer := 0;
  v_has_image boolean := false;
  v_has_work boolean := false;
  v_years integer := 0;
  v_score bigint := 0;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM codev WHERE id = p_codev_id) THEN
    RETURN;
  END IF;

  -- Mirrors rankLevelOfBadge: only points whose skill_category_id has level > 0
  SELECT
    COALESCE(SUM(cp.points), 0)::bigint,
    COALESCE(
      BOOL_OR(
        COALESCE((c.level ->> cp.skill_category_id::text)::numeric, 0) >= 2
      ),
      false
    ),
    COUNT(*)::integer
  INTO v_total_points, v_has_level2, v_badge_count
  FROM codev c
  INNER JOIN codev_points cp ON cp.codev_id = c.id
  WHERE c.id = p_codev_id
    AND c.level IS NOT NULL
    AND cp.skill_category_id IS NOT NULL
    AND COALESCE((c.level ->> cp.skill_category_id::text)::numeric, 0) > 0;

  v_total_points := COALESCE(v_total_points, 0);
  v_has_level2 := COALESCE(v_has_level2, false);
  v_badge_count := COALESCE(v_badge_count, 0);

  SELECT
    (c.image_url IS NOT NULL AND length(trim(c.image_url)) > 0),
    EXISTS (SELECT 1 FROM work_experience we WHERE we.codev_id = c.id),
    COALESCE(c.years_of_experience, 0)
  INTO v_has_image, v_has_work, v_years
  FROM codev c
  WHERE c.id = p_codev_id;

  -- Weights so lower tiers cannot overflow into higher ones
  -- (assumes totalPoints << 1e9, badge_count << 100, years << 100)
  v_score :=
    v_total_points * 1000000000
    + (CASE WHEN v_has_level2 THEN 10000000 ELSE 0 END)
    + (v_badge_count::bigint * 100000)
    + (CASE WHEN v_has_image THEN 1000 ELSE 0 END)
    + (CASE WHEN v_has_work THEN 100 ELSE 0 END)
    + v_years::bigint;

  UPDATE codev
  SET landing_rank_score = v_score
  WHERE id = p_codev_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_recompute_landing_rank_score_from_codev()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.recompute_codev_landing_rank_score(NEW.id);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_recompute_landing_rank_score_from_child()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  target_id uuid;
BEGIN
  target_id := COALESCE(NEW.codev_id, OLD.codev_id);
  IF target_id IS NOT NULL THEN
    PERFORM public.recompute_codev_landing_rank_score(target_id);
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS codev_landing_rank_score_aiu ON codev;
CREATE TRIGGER codev_landing_rank_score_aiu
  AFTER INSERT OR UPDATE OF level, image_url, years_of_experience
  ON codev
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_recompute_landing_rank_score_from_codev();

DROP TRIGGER IF EXISTS codev_points_landing_rank_score_aiud ON codev_points;
CREATE TRIGGER codev_points_landing_rank_score_aiud
  AFTER INSERT OR UPDATE OR DELETE ON codev_points
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_recompute_landing_rank_score_from_child();

DROP TRIGGER IF EXISTS work_experience_landing_rank_score_aiud ON work_experience;
CREATE TRIGGER work_experience_landing_rank_score_aiud
  AFTER INSERT OR UPDATE OR DELETE ON work_experience
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_recompute_landing_rank_score_from_child();

-- Backfill: recompute every existing codev (one-time data edit on migrate)
SELECT public.recompute_codev_landing_rank_score(c.id)
FROM codev c;

CREATE INDEX IF NOT EXISTS idx_codev_landing_interns_rank
  ON codev (landing_rank_score DESC, id ASC)
  WHERE availability_status = true AND role_id IN (4, 10);
