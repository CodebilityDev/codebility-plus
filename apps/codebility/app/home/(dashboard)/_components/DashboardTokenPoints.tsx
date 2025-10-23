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
import {
  ArrowUp,
  Award,
  Calendar,
  Star,
  Target,
  TrendingUp,
  UserRoundPen,
  Zap,
} from "lucide-react";

export default function TokenPoints() {
  const { user } = useUserStore();
  const [points, setPoints] = useState<Record<string, number>>({});
  const [levels, setLevels] = useState<Record<string, number>>({});
  const [attendancePoints, setAttendancePoints] = useState(0);
  const [socialPoints, setSocialPoints] = useState(0);
  const [profilePoints, setProfilePoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToBePromoted, setRoleToBePromoted] = useState<string | null>(null);
  const [promotionAccepted, setPromotionAccepted] = useState(false);
  const setUserLevel = useUserStore((state) => state.setUserLevel);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClientClientComponent()!;

    const fetchPointsAndCategories = async () => {
      setLoading(true);
      setError(null);

      // FIXED: Use getUser() instead of getSession()
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

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

        const skillCategories = (categories as SkillCategory[]).filter(
          (category) => category.name !== "Project Manager",
        ); // Exclude PM from points overview

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
        if (attendanceError && attendanceError.code === "PGRST116") {
          // Count actual attendance records
          const {
            data: attendanceCount,
            error: countError,
            count,
          } = await supabase
            .from("attendance")
            .select("*", { count: "exact", head: true })
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
                last_updated: new Date().toISOString().split("T")[0],
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
              const data = (await res.json()) as
                | { success?: boolean; totalPoints?: number }
                | undefined;
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

        // Fetch social points
        if (user?.id) {
          try {
            // Fetch user's points
            const { data: pointsData, error: pointsError } = await supabase.rpc(
              "calculate_social_points",
              { codev_id: user.id },
            );

            if (pointsError) throw pointsError;
            if (isMounted) {
              setSocialPoints(pointsData);
            }
          } catch (error) {
            console.error("Failed to fetch social points:", error);
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
      <Box className="!before:absolute !before:inset-0 !before:bg-gradient-to-br !before:from-white/10 !before:to-transparent !before:pointer-events-none relative flex w-full flex-1 flex-col gap-6 overflow-hidden !border-white/10 !bg-white/5 !shadow-2xl !backdrop-blur-2xl dark:!border-slate-400/10 dark:!bg-slate-900/5">
        {/* Background decoration */}
        <div className="from-customBlue-50/30 dark:from-customBlue-950/10 absolute inset-0 bg-gradient-to-br to-purple-50/30 dark:to-purple-950/10" />
        <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-400/10 blur-2xl" />

        <div className="relative">
          {/* Header skeleton */}
          <div className="mb-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <Skeleton className="ml-auto h-8 w-16" />
                    <Skeleton className="ml-auto h-3 w-12" />
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
      "QA Engineer": <Award className="h-6 w-6" />,
    };
    return iconMap[category] || <Star className="h-6 w-6" />;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      "Frontend Developer": "from-customBlue-500 to-cyan-500",
      "Backend Developer": "from-green-500 to-emerald-500",
      "UI/UX Designer": "from-purple-500 to-pink-500",
      "Mobile Developer": "from-orange-500 to-red-500",
      "QA Engineer": "from-indigo-500 to-customBlue-500",
    };
    return colorMap[category] || "from-gray-500 to-gray-600";
  };

  const getProgressToNextLevel = (category: string, currentPoints: number) => {
    const nextLevelThreshold = (levels[category] ?? 1) * 100; // Assuming 100 points per level, default to level 1 if undefined
    const progress = ((currentPoints % 100) / 100) * 100;
    return Math.min(progress, 100);
  };

  const totalSkillPoints = Object.values(points).reduce(
    (sum, point) => sum + point,
    0,
  );
  const totalPoints = totalSkillPoints + attendancePoints + profilePoints;

  return (
    <Box className="!before:absolute !before:inset-0 !before:bg-gradient-to-br !before:from-white/10 !before:to-transparent !before:pointer-events-none relative flex w-full flex-1 flex-col gap-6 overflow-hidden !border-white/10 !bg-white/5 !shadow-2xl !backdrop-blur-2xl dark:!border-slate-400/10 dark:!bg-slate-900/5">
      {/* Background decoration */}
      <div className="from-customBlue-50/30 dark:from-customBlue-950/10 absolute inset-0 bg-gradient-to-br to-purple-50/30 dark:to-purple-950/10" />
      <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-400/10 blur-2xl" />

      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <div className="from-customBlue-500 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br to-purple-500">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="to-customBlue-600 bg-gradient-to-r from-purple-600 bg-clip-text text-2xl font-bold text-transparent">
              ⚡ Points Overview
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total: {totalPoints} points (Skills: {totalSkillPoints} +
              Attendance: {attendancePoints} + Profile: {profilePoints})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {/* Attendance Points Card */}
          <div className="dark:bg-white/3 group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-lg dark:border-white/5 dark:hover:bg-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-5 transition-opacity group-hover:opacity-10" />
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-2 text-white">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Attendance
                    </p>
                    <p className="text-xs text-gray-500">Consistency Points</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-2xl font-bold text-transparent">
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
          <div className="dark:bg-white/3 group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-lg dark:border-white/5 dark:hover:bg-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-5 transition-opacity group-hover:opacity-10" />
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 p-2 text-white">
                    <UserRoundPen className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Profile Completion
                    </p>
                    <p className="text-xs text-gray-500">Completion Points</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-2xl font-bold text-transparent">
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

          {/* Social Points Card */}
          <div className="dark:bg-white/3 group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-lg dark:border-white/5 dark:hover:bg-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-5 transition-opacity group-hover:opacity-10" />
            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-2 text-white">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Social
                    </p>
                    <p className="text-xs text-gray-500">Engagement Points</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-2xl font-bold text-transparent">
                    {socialPoints}
                  </p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Earned by contributing posts to the community feed
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Extra points for received likes or comments
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
                className="dark:bg-white/3 group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-lg dark:border-white/5 dark:hover:bg-white/5"
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(category)} opacity-5 transition-opacity group-hover:opacity-10`}
                />

                <div className="relative">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`rounded-lg bg-gradient-to-br p-2 ${getCategoryColor(category)} text-white`}
                      >
                        {getCategoryIcon(category)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {category}
                        </p>
                        <p className="text-xs text-gray-500">
                          Level {currentLevel}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="to-customBlue-600 bg-gradient-to-r from-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                        {point}
                      </p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>

                  {/* Progress bar for next level */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Progress to Level {currentLevel + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/20 dark:bg-white/10">
                      <div
                        className={`h-full bg-gradient-to-r ${getCategoryColor(category)} transition-all duration-500 ease-out`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Level badge */}
                  {currentLevel >= 2 && (
                    <div className="absolute -right-2 -top-2 animate-pulse rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 text-xs font-bold text-white">
                      <ArrowUp className="mr-1 inline h-3 w-3" />
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
          <div className="to-customBlue-500 absolute inset-0 rounded-lg bg-gradient-to-r from-green-400 opacity-75 blur-sm"></div>
          <Button
            className="to-customBlue-500 hover:to-customBlue-600 relative mb-4 mt-4 w-auto transform animate-pulse bg-gradient-to-r from-green-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-green-600"
            onClick={openModal}
          >
            <Award className="mr-2 h-5 w-5" />
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
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 opacity-75 blur-sm"></div>
          <Button
            className="relative mb-4 mt-4 w-auto transform animate-pulse bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-pink-600"
            onClick={openModal}
          >
            <Star className="mr-2 h-5 w-5" />
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
