"use client";

import { useEffect, useState } from "react";
import PromoteToCodevModal from "@/Components/modals/PromoteToCodevModal";
import PromoteToMentorModal from "@/Components/modals/PromoteToMentorModal";
import { Box } from "@/Components/shared/dashboard";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { useUserStore } from "@/store/codev-store";
import { CodevPoints, Level, SkillCategory } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";

export default function TokenPoints() {
  const { user } = useUserStore();
  const [points, setPoints] = useState<Record<string, number>>({});
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToBePromoted, setRoleToBePromoted] = useState<string | null>(null);
  const [promotionAccepted, setPromotionAccepted] = useState(false);

  // Initialize Supabase client safely
  useEffect(() => {
    const client = createClientClientComponent();
    setSupabase(client);
  }, []);

  useEffect(() => {
    if (!supabase) return;

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

        //Intern ready to be promoted to Codev
        console.log();
        if (
          user?.role_id == 4 &&
          Object.values(levelsByCategory).some((value) => value >= 2) &&
          !promotionAccepted // Don't show if promotion was already accepted
        ) {
          setRoleToBePromoted("Codev");
          if (!user?.promote_declined) setIsModalOpen(true);
        }
        //Codev ready to be promoted to Mentor
        else if (
          user?.role_id == 10 &&
          Object.values(levelsByCategory).some((value) => value >= 3) &&
          !promotionAccepted // Don't show if promotion was already accepted
        ) {
          setRoleToBePromoted("Mentor");
          if (!user?.promote_declined) setIsModalOpen(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPointsAndCategories();
  }, [supabase, user, promotionAccepted]); // Add promotionAccepted to dependencies

  const handlePromotionAccepted = () => {
    setPromotionAccepted(true);
    setRoleToBePromoted(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <Box className="flex w-full flex-1 flex-col gap-4">
        <p className="text-2xl">Token Points</p>
        <div className="flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
          <Skeleton className="flex h-52 w-full flex-col items-center justify-between gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"></Skeleton>
          <Skeleton className="flex h-52 w-full flex-col items-center justify-between gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"></Skeleton>
          <Skeleton className="flex h-52 w-full flex-col items-center justify-between gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"></Skeleton>
          <Skeleton className="flex h-52 w-full flex-col items-center justify-between gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"></Skeleton>
          <Skeleton className="flex h-52 w-full flex-col items-center justify-between gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"></Skeleton>
        </div>
      </Box>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
      {roleToBePromoted == "Codev" && !promotionAccepted && (
        <>
          <Button className="mb-4 mt-4 w-auto" onClick={openModal}>
            Become a Codev
          </Button>
          <PromoteToCodevModal
            isOpen={isModalOpen}
            onClose={closeModal}
            userId={user?.id}
            onPromotionAccepted={handlePromotionAccepted}
          />
        </>
      )}
      {roleToBePromoted == "Mentor" && !promotionAccepted && (
        <>
          <Button className="mb-4 mt-4 w-auto" onClick={openModal}>
            Become a Mentor
          </Button>
          <PromoteToMentorModal
            isOpen={isModalOpen}
            onClose={closeModal}
            userId={user?.id}
            onPromotionAccepted={handlePromotionAccepted}
          />
        </>
      )}
    </Box>
  );
}
