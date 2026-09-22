import { Box } from "@/components/shared/dashboard";
import type { ProfileCompletionDetail } from "@/lib/server/profile-points";

import DashboardCompleteProfileTask from "./DashboardCompleteProfileTask";

const TASKS = [
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
    categories: ["phone_number", "github", "facebook", "linkedin", "discord"],
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
] as const;

export default function DashboardCompleteProfile({
  completion,
}: {
  completion: Record<string, ProfileCompletionDetail>;
}) {
  // A task counts as done when any of its underlying fields scored points.
  const pendingTasks = TASKS.filter(
    (task) =>
      !task.categories.some((category) => completion[category]?.completed),
  );

  const totalCompleted = TASKS.length - pendingTasks.length;
  const progressPercentage = (totalCompleted / TASKS.length) * 100;

  // Nothing left to nudge the user about.
  if (pendingTasks.length === 0) return null;

  return (
    <Box className="!before:absolute !before:inset-0 !before:bg-gradient-to-br !before:from-white/10 !before:to-transparent !before:pointer-events-none flex w-full flex-1 flex-col gap-6 overflow-hidden !border-white/10 !bg-white/5 !shadow-2xl !backdrop-blur-2xl dark:!border-slate-400/10 dark:!bg-slate-900/5">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Complete Your Profile
          </h2>
          <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-sm font-semibold text-white backdrop-blur-sm dark:bg-white/10 dark:text-gray-200">
            {totalCompleted}/{TASKS.length}
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={Math.round(progressPercentage)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2"
        >
          <div className="h-2 w-full rounded-full bg-white/20 dark:bg-white/10">
            <div
              className="from-customBlue-500 h-2 rounded-full bg-gradient-to-r to-purple-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {pendingTasks.map((task) => (
            <DashboardCompleteProfileTask
              key={task.id}
              title={task.title}
              description={task.description}
              points={task.points}
            />
          ))}
        </div>
      </div>
    </Box>
  );
}
