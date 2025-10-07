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
import { Zap, Target, TrendingUp, Award, Star, ArrowUp, Calendar, UserRoundPen } from "lucide-react";

export default function TokenPoints() {
  const { user } = useUserStore();
  const [points, setPoints] = useState<Record<string, number>>({});
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [attendancePoints, setAttendancePoints] = useState(0);
  const [profilePoints, setProfilePoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToBePromoted, setRoleToBePromoted] = useState<string | null>(null);
  const [promotionAccepted, setPromotionAccepted] = useState(false);
  const setUserLevel = useUserStore((state) => state.setUserLevel);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClientClientComponent();

    const fetchPointsAndCategories = async () => {
      setLoading(true);
      setError(null);

      // FIXED: Use getUser() instead of getSession()
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (!isMounted) return;

      if (authError || !authUser) {
        if (isMounted) {
          setError("No authenticated user found.");
          setLoading(false);
        }
        return;
      }

      try {
        // Fetch all skill categories
        const { data: categories, error: categoriesError } = await supabase
          .from("skill_category")
          .select("id, name");

        if (!isMounted) return;

        if (categoriesError) throw categoriesError;

        const skillCategories = (categories as SkillCategory[])
          .filter(category => category.name !== "Project Manager"); // Exclude PM from points overview

        // Fetch user's points
        const { data: pointsData, error: pointsError } = await supabase
          .from("codev_points")
          .select("id, codev_id, skill_category_id, points")
          .eq("codev_id", authUser.id);

        if (!isMounted) return;

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

        if (isMounted) {
          setPoints(pointsByCategory);
        }

        // Fetch attendance points from separate table
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("attendance_points")
          .select("points")
          .eq("codev_id", authUser.id)
          .single();

        // If no attendance points record exists, create one
        if (attendanceError && attendanceError.code === 'PGRST116') {
          // Count actual attendance records
          const { data: attendanceCount, error: countError, count } = await supabase
            .from("attendance")
            .select("*", { count: 'exact', head: true })
            .eq("codev_id", authUser.id)
            .in("status", ["present", "late"]);
          
          const totalPoints = (count || 0) * 2;
          
          if (totalPoints > 0) {
            // Create attendance points record
            const { data: newAttendancePoints } = await supabase
              .from("attendance_points")
              .insert({
                codev_id: authUser.id,
                points: totalPoints,
                last_updated: new Date().toISOString().split('T')[0]
              })
              .select()
              .single();
            
            if (isMounted) {
              setAttendancePoints(newAttendancePoints?.points || 0);
            }
          } else {
            if (isMounted) {
              setAttendancePoints(0);
            }
          }
        } else if (!attendanceError) {
          if (isMounted) {
            setAttendancePoints(attendanceData?.points || 0);
          }
        } else {
          console.error("Error fetching attendance points:", attendanceError);
          if (isMounted) {
            setAttendancePoints(0);
          }
        }

        // Fetch profile points from the API
        if (user?.id) {
          try {
            const res = await fetch(`/api/profile-points/${user.id}`);
            if (res.ok) {
              const data = (await res.json()) as { success?: boolean; totalPoints?: number } | undefined;
              if (data?.success && isMounted) {
                setProfilePoints(data.totalPoints ?? 0);
              }
            }
          } catch (error) {
            console.error("Failed to fetch profile points:", error);
            if (isMounted) {
              setProfilePoints(0);
            }
          }
        }

        // Fetch levels for all categories
        const { data: levelsData, error: levelsError } = await supabase
          .from("levels")
          .select("id, skill_category_id, level, min_points, max_points")
          .order("level", { ascending: true });

        if (!isMounted) return;

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

        if (isMounted) {
          setLevels(levelsByCategory);
        }

        if (isMounted) {
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
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching data:", err);
          setError("Failed to fetch data. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPointsAndCategories();

    return () => {
      isMounted = false;
    };
  }, [user, promotionAccepted]); // Add promotionAccepted to dependencies

  const handlePromotionAccepted = () => {
    setPromotionAccepted(true);
    setRoleToBePromoted(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <Box className="flex w-full flex-1 flex-col gap-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-customBlue-50/30 to-purple-50/30 dark:from-customBlue-950/10 dark:to-purple-950/10" />
        <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-400/10 blur-2xl" />
        
        <div className="relative">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Skeleton className="h-8 w-16 ml-auto" />
                    <Skeleton className="h-3 w-12 ml-auto" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
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
      "Frontend Developer": "from-customBlue-500 to-cyan-500",
      "Backend Developer": "from-green-500 to-emerald-500", 
      "UI/UX Designer": "from-purple-500 to-pink-500",
      "Mobile Developer": "from-orange-500 to-red-500",
      "QA Engineer": "from-indigo-500 to-customBlue-500"
    };
    return colorMap[category] || "from-gray-500 to-gray-600";
  };

  const getProgressToNextLevel = (category: string, currentPoints: number) => {
    const nextLevelThreshold = (levels[category] ?? 1) * 100; // Assuming 100 points per level, default to level 1 if undefined
    const progress = (currentPoints % 100) / 100 * 100;
    return Math.min(progress, 100);
  };

  const totalSkillPoints = Object.values(points).reduce((sum, point) => sum + point, 0);
  const totalPoints = totalSkillPoints + attendancePoints + profilePoints;

  return (
    <Box className="flex w-full flex-1 flex-col gap-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-customBlue-50/30 to-purple-50/30 dark:from-customBlue-950/10 dark:to-purple-950/10" />
      <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-400/10 blur-2xl" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-customBlue-500 to-purple-500">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-customBlue-600 bg-clip-text text-transparent">
              ⚡ Points Overview
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total: {totalPoints} points (Skills: {totalSkillPoints} + Attendance: {attendancePoints} + Profile: {profilePoints})
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Attendance Points Card */}
          <div className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Attendance</p>
                    <p className="text-xs text-gray-500">Consistency Points</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    {attendancePoints}
                  </p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Earned by marking attendance regularly
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  +2 points per day present
                </p>
              </div>
            </div>
          </div>

          {/* Profile Points Card */}
          <div className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg p-2 bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                    <UserRoundPen className="h-6 w-6" />
                  </div>
                  <div> 
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Profile Completion</p>
                    <p className="text-xs text-gray-500">Completion Points</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {profilePoints}
                  </p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Earned by completing your profile information 
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Points vary based on completeness
                </p>
              </div>
            </div>
          </div>

          {/* Skill Points Cards */}
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
                      <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-customBlue-600 bg-clip-text text-transparent">
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
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-customBlue-500 rounded-lg blur-sm opacity-75"></div>
          <Button 
            className="relative mb-4 mt-4 w-auto bg-gradient-to-r from-green-500 to-customBlue-500 hover:from-green-600 hover:to-customBlue-600 text-white font-bold py-3 px-6 shadow-lg transform transition-all duration-200 hover:scale-105 animate-pulse" 
            onClick={openModal}
          >
            <Award className="h-5 w-5 mr-2" />
            Become a Codev!
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
            Become a Mentor!
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