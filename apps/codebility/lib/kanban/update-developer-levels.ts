import { createClientServerComponent } from "@/utils/supabase/server";

export const updateDeveloperLevels = async (codevId?: string) => {
  if (!codevId) return;

  const supabase = await createClientServerComponent();

  const { data: pointsData, error: pointsError } = await supabase
    .from("codev_points")
    .select("skill_category_id, points")
    .eq("codev_id", codevId);

  if (pointsError) {
    console.error("Error fetching points:", pointsError);
    return;
  }

  const levels: Record<string, number> = {};

  const levelPromises = pointsData.map(async (pointRecord) => {
    const { data: levelData, error: levelError } = await supabase
      .from("levels")
      .select("*")
      .eq("skill_category_id", pointRecord.skill_category_id)
      .lte("min_points", pointRecord.points)
      .order("level", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!levelError && levelData) {
      return {
        skillCategoryId: pointRecord.skill_category_id,
        level: levelData.level,
      };
    }
    return null;
  });

  const levelResults = await Promise.all(levelPromises);

  levelResults.forEach((result) => {
    if (result) {
      levels[result.skillCategoryId] = result.level;
    }
  });

  if (Object.keys(levels).length > 0) {
    const { error: updateError } = await supabase
      .from("codev")
      .update({ level: levels })
      .eq("id", codevId);

    if (updateError) {
      console.error("Error updating levels:", updateError);
    }
  }
};
