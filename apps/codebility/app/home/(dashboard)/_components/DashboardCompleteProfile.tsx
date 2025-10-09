"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Box } from "@/components/shared/dashboard";

const Progress = ({ value, className }: { value?: number; className?: string }) => {
  const pct = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div
      className={className ?? ""}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="w-full bg-white/20 dark:bg-white/10 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-customBlue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const Badge = ({
  children,
  variant,
  className,
}: {
  children?: React.ReactNode;
  variant?: "secondary" | "outline";
  className?: string;
}) => {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const variants: Record<string, string> = {
    secondary: "bg-white/20 backdrop-blur-sm text-white dark:bg-white/10 dark:text-gray-200",
    outline: "border border-white/30 text-white backdrop-blur-sm dark:border-white/20 dark:text-gray-300",
  };
  const variantClass = variant ? variants[variant] ?? "" : "";
  return (
    <span className={`${base} ${variantClass} ${className ?? ""}`.trim()}>
      {children}
    </span>
  );
};

interface ProfilePointsData {
  success: boolean;
  totalPoints: number;
  points: Array<{
    category: string;
    points: number;
  }>;
}

export default function DashboardCompleteProfile({
  codevId,
}: {
  codevId: string;
}) {
  /* ------------------- State ------------------- */
  const [completedTasks, setCompletedTasks] = useState({
    profilePhoto: false,
    skillsList: false,
    aboutUser: false,
    contactInfo: false,
    portfolioWorks: false,
    workExperience: false,
  });

  const [openDropdowns, setOpenDropdowns] = useState({
    profilePhoto: false,
    skillsList: false,
    aboutUser: false,
    contactInfo: false,
    portfolioWorks: false,
    workExperience: false,
  });

  const [removedTasks, setRemovedTasks] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);

  const tasks = [
    {
      id: "profilePhoto",
      title: "Upload Your Profile Photo",
      description:
        "Upload your profile photo to help others recognize you and stand out in the community.",
      points: 5,
      categories: ["image_url"],
    },
    {
      id: "skillsList",
      title: "Add Your Technical Skills",
      description:
        "List your skills and areas of expertise to attract relevant opportunities.",
      points: "1",
      categories: ["tech_stacks"],
    },
    {
      id: "aboutUser",
      title: "Write Something About Yourself",
      description:
        "Tell others about yourself, your interests, hobbies and what you're looking to achieve.",
      points: 3,
      categories: ["about"],
    },
    {
      id: "contactInfo",
      title: "Add Your Contact Info & Social Links",
      description:
        "Add your most active contact information and link your social media accounts (LinkedIn, Twitter, GitHub) to expand your network.",
      points: "2",
      categories: [
        "phone_number",
        "github",
        "facebook",
        "linkedin",
        "discord",
      ],
    },
    {
      id: "portfolioWorks",
      title: "Add Your Portfolio Website Link",
      description:
        "Add your personal website, portfolio, and any other relevant links to showcase your work.",
      points: 5,
      categories: ["portfolio_website"],
    },
    {
      id: "workExperience",
      title: "Add Your Work Experience",
      description:
        "Include your past job experiences, internships, and relevant projects.",
      points: "5",
      categories: ["work_experience"],
    },
  ];

  /* ------------------- Helpers ------------------- */
  const toggleDropdown = (taskId: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  /* ------------------- Fetch Data & Update ------------------- */

  useEffect(() => {
    async function loadProfilePoints() {
      if (!codevId) {
        console.error("Missing codevId, cannot fetch profile points");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/profile-points/${codevId}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Fetch error: ${res.status} - ${text}`);
        }
        const data = (await res.json()) as ProfilePointsData;

        if (data.success && data.points) {
          const pointsMap = data.points.reduce<Record<string, number>>((acc, p) => {
            acc[p.category] = p.points;
            return acc;
          }, {});

          const newCompletedTasks = {
            profilePhoto: !!pointsMap.image_url,
            skillsList: !!pointsMap.tech_stacks,
            aboutUser: !!pointsMap.about,
            contactInfo:
              !!pointsMap.phone_number ||
              !!pointsMap.github ||
              !!pointsMap.facebook ||
              !!pointsMap.linkedin ||
              !!pointsMap.discord,
            portfolioWorks: !!pointsMap.portfolio_website,
            workExperience: !!pointsMap.work_experience,
          };

          // Check for newly completed tasks and remove them immediately
          Object.keys(newCompletedTasks).forEach((taskId) => {
            if (newCompletedTasks[taskId] && !completedTasks[taskId]) {
              setRemovedTasks((prev) => ({ ...prev, [taskId]: true }));
            }
          });

          setCompletedTasks(newCompletedTasks);
          setTotalPoints(data.totalPoints);
        }
      } catch (error) {
        console.error("Failed to fetch profile points:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfilePoints();
  }, [codevId]);

  /* ------------------- Derived Values ------------------- */
  const totalCompleted = Object.values(completedTasks).filter(Boolean).length;
  const totalTasks = tasks.length;
  const progressPercentage = (totalCompleted / totalTasks) * 100;

  // Filter out removed tasks
  const visibleTasks = tasks.filter((task) => !removedTasks[task.id]);

  const allTasksCompleted = totalCompleted === totalTasks;

  /* ------------------- Render ------------------- */
  if (loading) {
    return (
      <Box className="flex w-full flex-1 flex-col gap-6 relative overflow-hidden !bg-white/5 !backdrop-blur-2xl !border-white/10 !shadow-2xl dark:!bg-slate-900/5 dark:!border-slate-400/10 !before:absolute !before:inset-0 !before:bg-gradient-to-br !before:from-white/10 !before:to-transparent !before:pointer-events-none">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-7 w-48 bg-white/20 dark:bg-white/10 rounded animate-pulse"></div>
            <div className="h-6 w-12 bg-white/20 dark:bg-white/10 rounded-full animate-pulse"></div>
          </div>

          <div className="w-full bg-white/20 dark:bg-white/10 rounded-full h-2 animate-pulse"></div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-white/20 dark:border-white/10 bg-white/10 backdrop-blur-sm dark:bg-white/5 p-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-white/30 dark:bg-white/20"></div>
                  <div className="h-5 flex-1 bg-white/20 dark:bg-white/10 rounded"></div>
                  <div className="h-5 w-16 bg-white/20 dark:bg-white/10 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Box>
    );
  }

  if (allTasksCompleted && visibleTasks.length === 0) {
    return null; // Don't render anything if all tasks are completed and none are visible
  }

  return (
    <Box className="flex w-full flex-1 flex-col gap-6 relative overflow-hidden !bg-white/5 !backdrop-blur-2xl !border-white/10 !shadow-2xl dark:!bg-slate-900/5 dark:!border-slate-400/10 !before:absolute !before:inset-0 !before:bg-gradient-to-br !before:from-white/10 !before:to-transparent !before:pointer-events-none">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white tracking-tight">
            {allTasksCompleted ? "You're All Set! 🎉" : "Complete Your Profile"}
          </h2>
          <Badge variant="secondary" className="text-sm font-semibold">
            {totalCompleted}/{totalTasks}
          </Badge>
        </div>

        <Progress value={progressPercentage} className="h-2" />

        {allTasksCompleted && visibleTasks.length === 0 && (
          <div className="text-center py-8 space-y-2">
            <p className="text-lg font-medium text-green-400">
              Congratulations! Your profile is all set.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {visibleTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border border-white/20 dark:border-white/10 bg-white/10 backdrop-blur-sm dark:bg-white/5 overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                onClick={() => toggleDropdown(task.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                      completedTasks[task.id]
                        ? "bg-green-500 border-green-500"
                        : "bg-white/20 border-white/30 dark:bg-white/10 dark:border-white/20"
                    }`}
                  />

                  <span
                    className={`font-medium ${
                      completedTasks[task.id]
                        ? "text-gray-400 line-through"
                        : "text-white dark:text-gray-200"
                    }`}
                  >
                    {task.title}
                  </span>

                  <Badge variant="outline" className="ml-auto mr-2">
                    +{task.points} pts
                  </Badge>
                </div>

                {openDropdowns[task.id] ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {openDropdowns[task.id] && (
                <div className="px-4 pb-4 pt-2 bg-white/5 backdrop-blur-sm border-t border-white/20 dark:border-white/10">
                  <p className="text-sm text-gray-300 dark:text-gray-400">{task.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
}