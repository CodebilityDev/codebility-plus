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
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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
    secondary: "bg-gray-700 text-gray-200",
    outline: "border border-gray-600 text-gray-300",
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

          setCompletedTasks({
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
          });

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

  /* ------------------- Render ------------------- */
  if (loading) {
    return (
      <Box className="flex w-full flex-1 flex-col gap-6 relative overflow-hidden">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Complete Your Profile
            </h2>
          </div>
          <div className="text-center text-gray-400 py-8">Loading...</div>
        </div>
      </Box>
    );
  }

  return (
    <Box className="flex w-full flex-1 flex-col gap-6 relative overflow-hidden">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white tracking-tight">
            Complete Your Profile
          </h2>
          <Badge variant="secondary" className="text-sm font-semibold">
            {totalCompleted}/{totalTasks}
          </Badge>
        </div>

        <Progress value={progressPercentage} className="h-2" />

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border border-gray-700 bg-gray-800/50 overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
                onClick={() => toggleDropdown(task.id)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-4 h-4 rounded-full border ${
                      completedTasks[task.id]
                        ? "bg-green-500 border-green-500"
                        : "bg-gray-700 border-gray-600"
                    }`}
                  />

                  <span
                    className={`font-medium ${
                      completedTasks[task.id]
                        ? "text-gray-500 line-through"
                        : "text-gray-200"
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
                <div className="px-4 pb-4 pt-2 bg-gray-900/30 border-t border-gray-700">
                  <p className="text-sm text-gray-400">{task.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Box>
  );
}
