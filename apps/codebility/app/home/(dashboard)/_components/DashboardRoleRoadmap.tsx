"use client";

import { useEffect, useState } from "react";

import { Box } from "@/components/shared/dashboard";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { useUserStore } from "@/store/codev-store";
import { createClientClientComponent } from "@/utils/supabase/client";

import { PhaseDetailsModal } from "./PhaseDetailsModal";

interface RoadmapPhase {
  id: string;
  phase: string;
  title: string;
  pointsRange: string;
  minPoints: number;
  maxPoints: number;
  steps: { id: string; step: string }[];
}

export default function DashboardRoleRoadmap() {
  const user = useUserStore((state) => state.user);
  const supabase = createClientClientComponent();
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const roadmapData: RoadmapPhase[] = [
    {
      id: "1",
      phase: "PHASE 1",
      title: "Intern",
      pointsRange: "0-100 points",
      minPoints: 0,
      maxPoints: 100,
      steps: [
        { id: "1", step: "Learn The Basics" },
        { id: "2", step: "Hands-On Practice" },
        { id: "3", step: "Version Control" },
      ],
    },
    {
      id: "2",
      phase: "PHASE 2",
      title: "Codev",
      pointsRange: "100-200 points",
      minPoints: 100,
      maxPoints: 200,
      steps: [
        { id: "1", step: "Deepen Language Proficiency" },
        { id: "2", step: "Explore Frameworks and Libraries" },
        { id: "3", step: "Work On Projects" },
        { id: "4", step: "Development Practices" },
      ],
    },
    {
      id: "3",
      phase: "PHASE 3",
      title: "Mentor",
      pointsRange: "200+ points",
      minPoints: 200,
      maxPoints: Infinity,
      steps: [
        { id: "1", step: "Specialize" },
        { id: "2", step: "Advanced Concepts" },
        { id: "3", step: "Collaborate" },
      ],
    },
  ];

  // Handler functions for modal
  const handlePhaseClick = (phaseId: string) => {
    setSelectedPhase(phaseId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhase(null);
  };

  // Determine the current phase based on user's role_id
  // role_id: 4 = Intern (Phase 1), 10 = Codev (Phase 2), 5 = Mentor (Phase 3)
  const getCurrentPhaseIndex = () => {
    const roleId = user?.role_id;
    if (roleId === 4) return 0; // Intern - Phase 1
    if (roleId === 10) return 1; // Codev - Phase 2
    if (roleId === 5) return 2; // Mentor - Phase 3

    // Fallback to points-based if role_id is not set
    return roadmapData.findIndex(
      (phase) => totalPoints >= phase.minPoints && totalPoints < phase.maxPoints,
    );
  };

  const currentPhaseIndex = getCurrentPhaseIndex();

  useEffect(() => {
    const fetchPoints = async () => {
      if (!supabase) return;

      try {
        setLoading(true);

        // Fetch codev points
        const { data: codevData, error: codevError } = await supabase
          .from("codev_points")
          .select("points")
          .eq("codev_id", user?.id);

        if (codevError) {
          console.error("Error fetching codev points:", codevError);
        }

        // Sum up all codev points
        const skillCategoryPoints =
          codevData?.reduce(
            (sum: number, record: any) => sum + (record.points || 0),
            0,
          ) || 0;

        // Fetch attendance points
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("attendance_points")
          .select("points")
          .eq("codev_id", user?.id)
          .maybeSingle();

        if (attendanceError) {
          console.error("Error fetching attendance points:", attendanceError);
        }

        const attendancePoints = attendanceData?.points || 0;

        // Fetch profile points via API
        let profilePoints = 0;
        try {
          const res = await fetch(`/api/profile-points/${user?.id}`);
          if (res.ok) {
            const data = (await res.json()) as { totalPoints?: number };
            profilePoints = data?.totalPoints || 0;
          }
        } catch (error) {
          console.error("Failed to fetch profile points:", error);
        }

        // Fetch social points via RPC
        const { data: socialData } = await supabase.rpc(
          "calculate_social_points",
          { codev_id: user?.id },
        );
        const socialPoints = socialData || 0;

        // Calculate total points
        const total =
          skillCategoryPoints + attendancePoints + profilePoints + socialPoints;
        setTotalPoints(total);
      } catch (error) {
        console.error("Error in fetchPoints:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPoints();
    }
  }, [user?.id, supabase]);

  // Calculate overall progress percentage
  const overallProgress = Math.min((totalPoints / 200) * 100, 100);

  if (loading) {
    return (
      <Box>
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </Box>
    );
  }

  return (
    <Box className="!before:absolute !before:inset-0 !before:bg-gradient-to-br !before:from-white/10 !before:to-transparent !before:pointer-events-none relative flex w-full flex-1 flex-col gap-6 overflow-hidden !border-white/10 !bg-white/5 !shadow-2xl !backdrop-blur-2xl dark:!border-slate-400/10 dark:!bg-slate-900/5">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Career Progression Roadmap
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your Progress: {totalPoints} points
          </p>

          {/* Progress Bar */}
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="from-customBlue-500 h-full bg-gradient-to-r to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="mt-2 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">
            {overallProgress.toFixed(1)}% Complete
          </p>
        </div>

        {/* Static Roadmap */}
        <div className="relative mx-auto max-w-2xl">
          {roadmapData.map((phase, index) => {
            const isCompleted = index < currentPhaseIndex;
            const isCurrent = index === currentPhaseIndex;
            const isPending = index > currentPhaseIndex;
            const isNotLast = index < roadmapData.length - 1;

            return (
              <div key={phase.id} className="relative">
                {/* Phase Card */}
                <div
                  onClick={() => handlePhaseClick(phase.id)}
                  className={`relative mx-auto mb-8 w-full max-w-md cursor-pointer rounded-xl border p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                    isCurrent
                      ? "border-customBlue-400 bg-gradient-to-br from-customBlue-500/20 to-purple-500/20 dark:border-customBlue-500"
                      : isCompleted
                        ? "border-green-400/50 bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:border-green-500/50"
                        : "border-white/20 bg-white/10 opacity-60 dark:border-white/10"
                  }`}
                >
                  {/* Numbered Circle Badge */}
                  <div
                    className={`absolute -left-7 -top-7 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold shadow-lg ${
                      isCurrent
                        ? "bg-gradient-to-br from-customBlue-500 to-purple-500 text-white ring-4 ring-purple-300/50 dark:ring-purple-500/30"
                        : isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {isCurrent && (
                      <div className="absolute -inset-1 animate-ping rounded-full bg-purple-400 opacity-75"></div>
                    )}
                    <span className="relative z-10">{phase.id}</span>
                  </div>

                  {/* Status Icon Badge */}
                  {isCompleted && (
                    <div className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  {isPending && (
                    <div className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-gray-500 text-white shadow-lg dark:bg-gray-600">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  )}

                  {/* Content */}
                  <div className="mb-5 mt-2">
                    <h3
                      className={`mb-1 text-sm font-medium uppercase tracking-wider ${
                        isCurrent
                          ? "text-customBlue-600 dark:text-customBlue-400"
                          : isCompleted
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-300 dark:text-gray-300"
                      }`}
                    >
                      {phase.phase}
                    </h3>
                    <h2
                      className={`text-3xl font-bold ${
                        isCurrent
                          ? "bg-gradient-to-r from-customBlue-600 to-purple-600 bg-clip-text text-transparent"
                          : isCompleted
                            ? "text-green-600 dark:text-green-400"
                            : "text-white dark:text-white"
                      }`}
                    >
                      {phase.title}
                    </h2>
                    <p
                      className={`mt-1 text-sm font-semibold ${
                        isCurrent
                          ? "text-customBlue-600 dark:text-customBlue-400"
                          : isCompleted
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-300 dark:text-gray-300"
                      }`}
                    >
                      {phase.pointsRange}
                    </p>
                  </div>

                  {/* Steps List */}
                  <ul className="space-y-3">
                    {phase.steps.map((step) => (
                      <li key={step.id} className="flex items-start gap-3">
                        <span
                          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                            isCurrent
                              ? "bg-gradient-to-r from-customBlue-500 to-purple-500 text-white"
                              : isCompleted
                                ? "bg-green-500 text-white"
                                : "bg-gray-500 text-white dark:bg-gray-600 dark:text-white"
                          }`}
                        >
                          0{step.id}
                        </span>
                        <p
                          className={`flex-1 text-base leading-relaxed ${
                            isCurrent || isCompleted
                              ? "font-medium text-gray-800 dark:text-gray-100"
                              : "font-medium text-gray-200 dark:text-gray-200"
                          }`}
                        >
                          {step.step}
                        </p>
                      </li>
                    ))}
                  </ul>

                  {/* Current Phase Badge */}
                  {isCurrent && (
                    <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-customBlue-500 to-purple-500 py-2.5 text-sm font-bold text-white shadow-lg">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      You are here!
                    </div>
                  )}
                </div>

                {/* Connecting Line */}
                {isNotLast && (
                  <div className="relative mx-auto mb-8 flex h-16 w-1 items-center justify-center">
                    <div
                      className={`h-full w-1 ${
                        isCompleted
                          ? "bg-gradient-to-b from-green-500 to-green-400"
                          : "border-l-2 border-dashed border-gray-400 dark:border-gray-600"
                      }`}
                    />
                    {isCompleted && (
                      <div className="absolute top-1/2 -translate-y-1/2">
                        <div className="h-3 w-3 animate-pulse rounded-full bg-green-400" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          💡 Click phase cards to view details
        </p>
      </div>

      {/* Phase Details Modal */}
      <PhaseDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        phaseId={selectedPhase}
      />
    </Box>
  );
}
