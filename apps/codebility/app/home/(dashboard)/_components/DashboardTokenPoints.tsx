"use client";

import { useEffect, useState } from "react";
import { Box } from "@/Components/shared/dashboard";
import { CodevPoints, Level, SkillCategory } from "@/types/home/codev";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function TokenPoints() {
  const [points, setPoints] = useState<Record<string, number>>({});
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchPointsAndCategories = async () => {
      setLoading(true);
      setError(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setError("No user session found.");
        setLoading(false);
        return;
      }

      try {
        // Fetch all skill categories
        const { data: categories, error: categoriesError } = await supabase
          .from("skill_category")
          .select("id, name");

        if (categoriesError) throw categoriesError;

        const skillCategories = categories as SkillCategory[];

        // Fetch user's points
        const { data: pointsData, error: pointsError } = await supabase
          .from("codev_points")
          .select("id, codev_id, skill_category_id, points")
          .eq("codev_id", session.user.id);

        if (pointsError) throw pointsError;

        const userPoints = pointsData as CodevPoints[];

        // Map points to skill categories
        const pointsByCategory = skillCategories.reduce(
          (acc, category) => {
            const matchingPoint = userPoints?.find(
              (point) => point.skill_category_id === category.id,
            );
            acc[category.name] = matchingPoint ? matchingPoint.points : 0;
            return acc;
          },
          {} as Record<string, number>,
        );

        setPoints(pointsByCategory);

        // Fetch levels for all categories
        const { data: levelsData, error: levelsError } = await supabase
          .from("levels")
          .select("id, skill_category_id, level, min_points, max_points")
          .order("level", { ascending: true });

        if (levelsError) throw levelsError;

        const skillLevels = levelsData as Level[];

        // Map levels to categories
        const levelsByCategory = skillCategories.reduce(
          (acc, category) => {
            const categoryPoints = pointsByCategory[category.name] || 0;
            const categoryLevels = skillLevels?.filter(
              (l) => l.skill_category_id === category.id,
            );

            const currentLevel =
              categoryLevels?.find(
                (l) =>
                  categoryPoints >= l.min_points &&
                  (l.max_points === undefined ||
                    categoryPoints <= l.max_points),
              )?.level || 1;

            acc[category.name] = currentLevel;
            return acc;
          },
          {} as Record<string, number>,
        );

        setLevels(levelsByCategory);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPointsAndCategories();
  }, [supabase]);

  if (loading) {
    return <p>Loading token points...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <Box className="flex w-full flex-1 flex-col gap-4">
      <p className="text-2xl">Token Points</p>
      <div className="flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
        {Object.entries(points).map(([category, point]) => (
          <div
            key={category}
            className="flex w-full flex-col items-center justify-between gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
          >
            <p className="text-teal text-4xl">{point}</p>
            <p className="text-gray text-center text-sm">{category} Points</p>
            <p className="text-sm">Level {levels[category]}</p>
          </div>
        ))}
      </div>
    </Box>
  );
}
