"use client";

import { useEffect, useState } from "react";
import { Box } from "@/Components/shared/dashboard";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface SkillCategory {
  id: string;
  name: string;
}

interface PointData {
  points: number;
  skill_category: {
    id: string;
    name: string;
  };
}

interface Level {
  id: string;
  skill_category_id: string;
  level: number;
  min_points: number;
  max_points: number;
}

export default function TokenPoints() {
  const [points, setPoints] = useState<Record<string, number>>({});
  const [levels, setLevels] = useState<Record<string, number>>({});
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchPointsAndCategories = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Fetch all skill categories
      const { data: categories, error: categoriesError } = await supabase
        .from("skill_category")
        .select("id, name");

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
        return;
      }

      // Fetch user's points
      const { data: pointsData, error: pointsError } = await supabase
        .from("codev_points")
        .select(
          `
          points,
          skill_category:skill_category_id(id, name)
        `,
        )
        .eq("codev_id", session.user.id);

      if (pointsError) {
        console.error("Error fetching points:", pointsError);
        return;
      }

      // Map points to skill categories
      const pointsByCategory = (categories || []).reduce(
        (acc, category) => ({
          ...acc,
          [category.name]:
            pointsData?.find((point) => point.skill_category.id === category.id)
              ?.points || 0,
        }),
        {},
      );

      setPoints(pointsByCategory);

      // Fetch levels for all categories
      const { data: levelsData, error: levelsError } = await supabase
        .from("levels")
        .select("*")
        .order("level", { ascending: true });

      if (levelsError) {
        console.error("Error fetching levels:", levelsError);
        return;
      }

      // Map levels to categories
      const levelsByCategory = (categories || []).reduce((acc, category) => {
        const categoryPoints = pointsByCategory[category.name] || 0;
        const categoryLevels = levelsData?.filter(
          (l) => l.skill_category_id === category.id,
        );
        const currentLevel =
          categoryLevels?.find(
            (l) =>
              categoryPoints >= l.min_points && categoryPoints <= l.max_points,
          )?.level || 1;

        return {
          ...acc,
          [category.name]: currentLevel,
        };
      }, {});

      setLevels(levelsByCategory);
    };

    fetchPointsAndCategories();
  }, [supabase]);

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
