// components/TokenPoints.tsx
"use client";

import { useEffect, useState } from "react";
import { Box } from "@/Components/shared/dashboard";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function TokenPoints() {
  const [points, setPoints] = useState<Record<string, number>>({});
  const [levels, setLevels] = useState<Record<string, number>>({});
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchPoints = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: pointsData } = await supabase
        .from("codev_points")
        .select(
          `
          points,
          skill_category:skill_category_id(name)
        `,
        )
        .eq("codev_id", session.user.id);

      if (pointsData) {
        const pointsByCategory = pointsData.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.skill_category.name]: curr.points,
          }),
          {},
        );
        setPoints(pointsByCategory);
      }

      // Fetch levels based on points
      const { data: levelsData } = await supabase
        .from("levels")
        .select("*")
        .order("level", { ascending: true });

      if (levelsData) {
        const levelsByCategory = pointsData?.reduce((acc, curr) => {
          const categoryLevels = levelsData.filter(
            (l) =>
              l.skill_category_id === curr.skill_category.id &&
              curr.points >= l.min_points &&
              curr.points <= l.max_points,
          );
          return {
            ...acc,
            [curr.skill_category.name]: categoryLevels[0]?.level || 1,
          };
        }, {});
        setLevels(levelsByCategory);
      }
    };

    fetchPoints();
  }, [supabase]);

  return (
    <Box className="flex w-full flex-1 flex-col gap-4">
      <p className="text-2xl">Token Points</p>
      <div className="flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
        {Object.entries(points).map(([category, point]) => (
          <div
            key={category}
            className="flex w-full flex-col items-center gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
          >
            <p className="text-teal text-4xl">{point}</p>
            <p className="text-gray text-xl">{category} Points</p>
            <p className="text-sm">Level {levels[category]}</p>
          </div>
        ))}
      </div>
    </Box>
  );
}
