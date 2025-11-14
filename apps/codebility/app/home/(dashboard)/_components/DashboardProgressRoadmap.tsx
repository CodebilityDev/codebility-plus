"use client";

import { useEffect, useState } from "react";
import { Box } from "@/components/shared/dashboard";
import { Badge } from "@codevs/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { useUserStore } from "@/store/codev-store";
import { CheckCircle2, Circle } from "lucide-react";

interface RoadmapStep {
  id: string;
  step: string;
}

interface RoadmapPhase {
  id: string;
  phase: string;
  title: string;
  pointRange: string;
  steps: RoadmapStep[];
}

const roadmapData: RoadmapPhase[] = [
  {
    id: "1",
    phase: "Phase 1",
    title: "Intern",
    pointRange: "0-100 pts",
    steps: [
      { id: "1", step: "Learn The Basics" },
      { id: "2", step: "Hands-On Practice" },
      { id: "3", step: "Version Control" },
    ],
  },
  {
    id: "2",
    phase: "Phase 2",
    title: "Codev",
    pointRange: "100-200 pts",
    steps: [
      { id: "1", step: "Deepen Language Proficiency" },
      { id: "2", step: "Explore Frameworks and Libraries" },
      { id: "3", step: "Work On Projects" },
      { id: "4", step: "Development Practices" },
    ],
  },
  {
    id: "3",
    phase: "Phase 3",
    title: "Mentor",
    pointRange: "200+ pts",
    steps: [
      { id: "1", step: "Specialize" },
      { id: "2", step: "Advanced Concepts" },
      { id: "3", step: "Collaborate" },
    ],
  },
];

export default function DashboardProgressRoadmap() {
  const { user } = useUserStore();
  const [userPoints, setUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserPoints = async () => {
      try {
        // Fetch total points from codev_points table
        const supabase = (await import("@/utils/supabase/client"))
          .createClientClientComponent();

        if (!supabase) {
          console.error("Failed to initialize Supabase client.");
          setIsLoading(false);
          return;
        }

        const { data: pointsData, error: pointsError } = await supabase
          .from("codev_points")
          .select("points")
          .eq("codev_id", user.id);

        if (pointsError) throw pointsError;

        // Calculate total skill points
        const totalSkillPoints =
          pointsData?.reduce((sum, record) => sum + (record.points || 0), 0) ||
          0;

        // Fetch attendance points
        const { data: attendanceData } = await supabase
          .from("attendance_points")
          .select("points")
          .eq("codev_id", user.id)
          .single();

        const attendancePoints = attendanceData?.points || 0;

        // Fetch profile points
        let profilePoints = 0;
        try {
          const res = await fetch(`/api/profile-points/${user.id}`);
          if (res.ok) {
            const data = (await res.json()) as {
              success?: boolean;
              totalPoints?: number;
            };
            profilePoints = data?.totalPoints || 0;
          }
        } catch (error) {
          console.error("Failed to fetch profile points:", error);
        }

        // Fetch social points
        const { data: socialData } = await supabase.rpc(
          "calculate_social_points",
          { codev_id: user.id },
        );
        const socialPoints = socialData || 0;

        // Calculate total points
        const totalPoints =
          totalSkillPoints + attendancePoints + profilePoints + socialPoints;

        setUserPoints(totalPoints);

        // Determine active phase based on total points
        if (totalPoints < 100) {
          setActivePhaseIndex(0);
        } else if (totalPoints < 200) {
          setActivePhaseIndex(1);
        } else {
          setActivePhaseIndex(2);
        }
      } catch (error) {
        console.error("Error fetching user points:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPoints();
  }, [user]);

  const getPhaseStatus = (index: number) => {
    if (index < activePhaseIndex) return "completed";
    if (index === activePhaseIndex) return "active";
    return "upcoming";
  };

  const getPhaseColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50 dark:bg-green-950/30";
      case "active":
        return "border-blue-500 bg-blue-50 dark:bg-blue-950/30";
      default:
        return "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30";
    }
  };

  return (
    <Box className="flex w-full flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold">Your Learning Roadmap</p>
        {!isLoading && (
          <Badge variant="info" className="text-sm">
            {userPoints} points
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      ) : (
        <div className="relative">
          {/* Connection Line for Desktop */}
          <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-gray-300 dark:to-gray-700 md:block" />

          <div className="flex flex-col gap-6">
            {roadmapData.map((phase, index) => {
              const status = getPhaseStatus(index);
              const isCompleted = status === "completed";
              const isActive = status === "active";

              return (
                <div key={phase.id} className="relative">
                  {/* Status Indicator Circle */}
                  <div className="absolute -left-1 top-6 z-10 hidden md:block">
                    {isCompleted ? (
                      <CheckCircle2 className="h-8 w-8 rounded-full bg-white text-green-500 dark:bg-gray-950" />
                    ) : isActive ? (
                      <div className="h-8 w-8 rounded-full border-4 border-blue-500 bg-white dark:bg-gray-950">
                        <div className="h-full w-full animate-pulse rounded-full bg-blue-500" />
                      </div>
                    ) : (
                      <Circle className="h-8 w-8 rounded-full bg-white text-gray-400 dark:bg-gray-950" />
                    )}
                  </div>

                  {/* Phase Card */}
                  <Card
                    className={`ml-0 md:ml-16 transition-all duration-300 ${getPhaseColor(status)} ${
                      isActive ? "shadow-lg scale-[1.02]" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4">
                        {/* Phase Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant={
                                  isCompleted
                                    ? "success"
                                    : isActive
                                      ? "default"
                                      : "outline"
                                }
                                className="text-xs"
                              >
                                {phase.phase}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {phase.pointRange}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-foreground">
                              {phase.title}
                            </h3>
                          </div>
                          {/* Mobile Status Indicator */}
                          <div className="md:hidden">
                            {isCompleted ? (
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : isActive ? (
                              <div className="h-6 w-6 rounded-full border-2 border-blue-500 bg-blue-500/20" />
                            ) : (
                              <Circle className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Steps */}
                        <div className="grid gap-2 sm:grid-cols-2">
                          {phase.steps.map((step) => (
                            <div
                              key={step.id}
                              className="flex items-center gap-2 rounded-lg bg-background/50 p-3 transition-colors hover:bg-background"
                            >
                              <div
                                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                  isCompleted
                                    ? "bg-green-500 text-white"
                                    : isActive
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                }`}
                              >
                                {step.id}
                              </div>
                              <span
                                className={`text-sm ${
                                  isCompleted || isActive
                                    ? "font-medium text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {step.step}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Progress Message */}
                        {isActive && (
                          <div className="mt-2 rounded-md bg-blue-100 p-3 dark:bg-blue-900/30">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                              🎯 You're currently on this phase! Keep up the great work.
                            </p>
                          </div>
                        )}
                        {isCompleted && (
                          <div className="mt-2 rounded-md bg-green-100 p-3 dark:bg-green-900/30">
                            <p className="text-sm font-medium text-green-900 dark:text-green-100">
                              ✅ Completed! You've mastered this phase.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Box>
  );
}
