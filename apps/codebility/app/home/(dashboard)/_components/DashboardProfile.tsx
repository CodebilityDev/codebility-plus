import Image from "next/image";
import Badges from "@/components/shared/Badges";
import Box from "@/components/shared/dashboard/Box";
import type { DashboardUser } from "@/lib/server/dashboard-data";
import { defaultAvatar } from "@/public/assets/images";

import { cn } from "@codevs/ui";
import { Badge } from "@codevs/ui/badge";

import DashboardCertificate from "./DashboardCertificate";

export default function DashboardProfile({ user }: { user: DashboardUser }) {
  const active = user.availability_status ?? null;

  return (
    <Box className="!before:absolute !before:inset-0 !before:bg-gradient-to-br !before:from-white/10 !before:to-transparent !before:pointer-events-none relative flex-1 overflow-hidden !border-white/10 !bg-white/5 !shadow-2xl !backdrop-blur-2xl dark:!border-slate-400/10 dark:!bg-slate-900/5">
      {/* Background decoration */}
      <div className="from-customBlue-50/30 dark:from-customBlue-950/10 absolute inset-0 bg-gradient-to-br to-purple-50/30 dark:to-purple-950/10" />
      <div className="absolute -left-4 -top-4 h-32 w-32 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-400/10 blur-2xl" />

      {/* Dynamic layout with profile picture as hero */}
      <div className="relative flex flex-col gap-6">
        {/* Hero Profile Section */}
        <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          {/* Profile picture - responsive sizing */}
          <div className="flex shrink-0 flex-col items-center gap-3">
            <div className="group relative">
              <div className="from-customBlue-500 absolute inset-0 rounded-3xl bg-gradient-to-br to-purple-500 opacity-75 blur-lg transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"></div>
              <div className="relative rounded-3xl bg-white/80 p-1.5 backdrop-blur-sm dark:bg-gray-800/80">
                <Image
                  alt={`Profile picture of ${user.first_name} ${user.last_name || ""}, ${user.display_position || "team member"}`}
                  src={user.image_url ? `${user.image_url}` : defaultAvatar}
                  width={120}
                  height={120}
                  title={`${user.first_name}'s Profile Picture`}
                  className="h-[100px] w-[100px] rounded-2xl object-cover transition-all duration-500 group-hover:rotate-2 group-hover:scale-105 sm:h-[120px] sm:w-[120px]"
                />
              </div>
              {/* Enhanced online status indicator */}
              <div className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm dark:bg-gray-800/90 sm:h-8 sm:w-8">
                <div className="h-4 w-4 animate-pulse rounded-full bg-green-500 shadow-lg shadow-green-500/50 sm:h-5 sm:w-5"></div>
              </div>
            </div>

            {/* Badges section - under profile pic with no background */}
            <div className="flex justify-center">
              <Badges />
            </div>
          </div>

          {/* Welcome content - responsive layout */}
          <div className="w-full flex-1 space-y-3 text-center sm:text-left">
            <div className="pr-16 sm:pr-20">
              <h2 className="to-blue-600 bg-gradient-to-r from-purple-600 bg-clip-text text-xl font-bold leading-tight text-transparent sm:text-2xl md:text-3xl">
                Hey {user.first_name ?? ""}! 👋
              </h2>
              <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                Ready to conquer today?
              </p>
            </div>

            {/* Position badge */}
            <div className="inline-block">
              <div className="rounded-full border border-blue-300/30 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-2 backdrop-blur-sm dark:border-blue-600/30">
                <p className="text-base font-bold text-gray-800 dark:text-gray-100">
                  {user.display_position}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate and Active Status - Always top-right */}
      <div className="absolute right-2 top-2 z-20 sm:right-4 sm:top-4">
        <div className="flex items-center gap-2">
          {active !== null && (
            <Badge
              className={cn(
                "px-2 py-1 text-xs font-medium transition-all duration-300",
                active
                  ? "border border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "border border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400",
              )}
            >
              <div className="flex items-center gap-1">
                <div
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    active
                      ? "animate-pulse bg-green-600 dark:bg-green-400"
                      : "bg-red-600 dark:bg-red-400",
                  )}
                />
                <span className="hidden sm:inline">
                  {active ? "Active" : "Inactive"}
                </span>
                <span className="sm:hidden">{active ? "On" : "Off"}</span>
              </div>
            </Badge>
          )}

          <DashboardCertificate roleId={user.role_id ?? null} />
        </div>
      </div>
    </Box>
  );
}
