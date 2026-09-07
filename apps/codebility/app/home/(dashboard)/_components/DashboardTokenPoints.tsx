import { Box } from "@/components/shared/dashboard";
import {
  ArrowUp,
  Award,
  Calendar,
  MessageSquareText,
  Star,
  Target,
  TrendingUp,
  UserRoundPen,
  Zap,
} from "lucide-react";

import DashboardPromotionPrompt, {
  type PromotionRole,
} from "./DashboardPromotionPrompt";

// Social points default to 0 — the RPC was dropped
// (20260219_drop_obsolete_social_points_rpc.sql).
// TODO: Re-implement when feeds/social table is built
const SOCIAL_POINTS = 0;

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Frontend Developer": <Star className="h-6 w-6" />,
  "Backend Developer": <Zap className="h-6 w-6" />,
  "UI/UX Designer": <Target className="h-6 w-6" />,
  "Mobile Developer": <TrendingUp className="h-6 w-6" />,
  "QA Engineer": <Award className="h-6 w-6" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  "Frontend Developer": "from-customBlue-500 to-cyan-500",
  "Backend Developer": "from-green-500 to-emerald-500",
  "UI/UX Designer": "from-purple-500 to-pink-500",
  "Mobile Developer": "from-orange-500 to-red-500",
  "QA Engineer": "from-indigo-500 to-customBlue-500",
};

const getCategoryColor = (category: string) =>
  CATEGORY_COLORS[category] ?? "from-gray-500 to-gray-600";

/** Interns unlock Codev at level 2; Codevs unlock Mentor at level 3. */
function getPromotionRole(
  roleId: number | null,
  levels: Record<string, number>,
): PromotionRole | null {
  const reached = (level: number) =>
    Object.values(levels).some((value) => value >= level);

  if (roleId === 4 && reached(2)) return "Codev";
  if (roleId === 10 && reached(3)) return "Mentor";
  return null;
}

export default function TokenPoints({
  userId,
  roleId,
  promoteDeclined,
  points,
  levels,
  attendancePoints,
  profilePoints,
}: {
  userId: string;
  roleId: number | null;
  promoteDeclined: boolean | null;
  points: Record<string, number>;
  levels: Record<string, number>;
  attendancePoints: number;
  profilePoints: number;
}) {
  const totalSkillPoints = Object.values(points).reduce(
    (sum, point) => sum + point,
    0,
  );
  const totalPoints =
    totalSkillPoints + attendancePoints + profilePoints + SOCIAL_POINTS;

  const promotionRole = getPromotionRole(roleId, levels);

  return (
    <Box className="!before:absolute !before:inset-0 !before:bg-gradient-to-br !before:from-white/10 !before:to-transparent !before:pointer-events-none relative flex w-full flex-1 flex-col gap-6 overflow-hidden !border-white/10 !bg-white/5 !shadow-2xl !backdrop-blur-2xl dark:!border-slate-400/10 dark:!bg-slate-900/5">
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
              Attendance: {attendancePoints} + Profile: {profilePoints} +
              Social: {SOCIAL_POINTS})
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
                    <MessageSquareText className="h-6 w-6" />
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
                    {SOCIAL_POINTS}
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

          {/* Skill Points Cards — one per category */}
          {Object.entries(points).map(([category, point]) => {
            const currentLevel = levels[category] || 1;
            // 100 points per level.
            const progress = Math.min(((point % 100) / 100) * 100, 100);

            return (
              <div
                key={category}
                className="dark:bg-white/3 group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-lg dark:border-white/5 dark:hover:bg-white/5"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(category)} opacity-5 transition-opacity group-hover:opacity-10`}
                />

                <div className="relative">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`rounded-lg bg-gradient-to-br p-2 ${getCategoryColor(category)} text-white`}
                      >
                        {CATEGORY_ICONS[category] ?? (
                          <Star className="h-6 w-6" />
                        )}
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

                  {/* Progress bar toward next level */}
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

                  {/* Level badge — only shown at level 2+ */}
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

      {promotionRole && (
        <DashboardPromotionPrompt
          userId={userId}
          role={promotionRole}
          promoteDeclined={promoteDeclined ?? false}
        />
      )}
    </Box>
  );
}
