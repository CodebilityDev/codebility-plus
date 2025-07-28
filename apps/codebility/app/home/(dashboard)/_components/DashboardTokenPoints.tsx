"use client";

import { useEffect, useState } from "react";
import PromoteToCodevModal from "@/components/modals/PromoteToCodevModal";
import PromoteToMentorModal from "@/components/modals/PromoteToMentorModal";
import { Box } from "@/components/shared/dashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { useUserStore } from "@/store/codev-store";
import { CodevPoints, Level, SkillCategory } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";
import { Zap, Target, TrendingUp, Award, Star, ArrowUp } from "lucide-react";

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
  const setUserLevel = useUserStore((state) => state.setUserLevel);

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
          setUserLevel(2);
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

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, any> = {
      "Frontend Developer": <Star className="h-6 w-6" />,
      "Backend Developer": <Zap className="h-6 w-6" />,
      "UI/UX Designer": <Target className="h-6 w-6" />,
      "Mobile Developer": <TrendingUp className="h-6 w-6" />,
      "QA Engineer": <Award className="h-6 w-6" />
    };
    return iconMap[category] || <Star className="h-6 w-6" />;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      "Frontend Developer": "from-blue-500 to-cyan-500",
      "Backend Developer": "from-green-500 to-emerald-500", 
      "UI/UX Designer": "from-purple-500 to-pink-500",
      "Mobile Developer": "from-orange-500 to-red-500",
      "QA Engineer": "from-indigo-500 to-blue-500"
    };
    return colorMap[category] || "from-gray-500 to-gray-600";
  };

  const getProgressToNextLevel = (category: string, currentPoints: number) => {
    const nextLevelThreshold = levels[category] * 50; // Assuming 50 points per level
    const progress = (currentPoints % 50) / 50 * 100;
    return Math.min(progress, 100);
  };

  const totalPoints = Object.values(points).reduce((sum, point) => sum + point, 0);

  return (
    <Box className="flex w-full flex-1 flex-col gap-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-950/10 dark:to-purple-950/10" />
      <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-400/10 blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ⚡ Skill Points
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total: {totalPoints} points across all skills
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {Object.entries(points).map(([category, point]) => {
            const currentLevel = levels[category] || 1;
            const progress = getProgressToNextLevel(category, point);
            
            return (
              <div
                key={category}
                className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(category)} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`rounded-lg p-2 bg-gradient-to-br ${getCategoryColor(category)} text-white`}>
                        {getCategoryIcon(category)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{category}</p>
                        <p className="text-xs text-gray-500">Level {currentLevel}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {point}
                      </p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                  
                  {/* Progress bar for next level */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Progress to Level {currentLevel + 1}</span>
                      <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getCategoryColor(category)} transition-all duration-500 ease-out`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Level badge */}
                  {currentLevel >= 2 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                      <ArrowUp className="h-3 w-3 inline mr-1" />
                      LVL {currentLevel}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {roleToBePromoted == "Codev" && !promotionAccepted && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg blur-sm opacity-75"></div>
          <Button 
            className="relative mb-4 mt-4 w-auto bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 shadow-lg transform transition-all duration-200 hover:scale-105 animate-pulse" 
            onClick={openModal}
          >
            <Award className="h-5 w-5 mr-2" />
            🎉 Become a Codev!
          </Button>
          <PromoteToCodevModal
            isOpen={isModalOpen}
            onClose={closeModal}
            userId={user?.id}
            onPromotionAccepted={handlePromotionAccepted}
          />
        </div>
      )}
      {roleToBePromoted == "Mentor" && !promotionAccepted && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg blur-sm opacity-75"></div>
          <Button 
            className="relative mb-4 mt-4 w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 shadow-lg transform transition-all duration-200 hover:scale-105 animate-pulse" 
            onClick={openModal}
          >
            <Star className="h-5 w-5 mr-2" />
            🌟 Become a Mentor!
          </Button>
          <PromoteToMentorModal
            isOpen={isModalOpen}
            onClose={closeModal}
            userId={user?.id}
            onPromotionAccepted={handlePromotionAccepted}
          />
        </div>
      )}
    </Box>
  );
}
