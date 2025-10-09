"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import UserInactiveModal from "@/components/modals/UserInactiveModal";
import Badges from "@/components/shared/Badges";
import Box from "@/components/shared/dashboard/Box";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import SwitchStatusButton from "@/components/ui/SwitchStatusButton";
import { defaultAvatar } from "@/public/assets/images";
import { useUserStore } from "@/store/codev-store";
import { useSidebarStore } from "@/store/sidebar-store";

import { cn } from "@codevs/ui";
import { Badge } from "@codevs/ui/badge";

import {
  fetchUserAvailabilityStatus,
  updateUserAvailabilityStatus,
} from "../actions";
import DashboardCertificate from "./DashboardCertificate";

export default function DashboardProfile() {
  const { user } = useUserStore();
  const isLoading = !user;

  const [active, setActive] = useState<boolean | null>(null);
  const [activeloading, setActiveLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchStatus = async () => {
      try {
        const res = await fetchUserAvailabilityStatus(user?.id);
        setActive(res);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStatus();
  }, [user]);

  const triggerRefresh = useSidebarStore((state) => state.triggerRefresh);

  const handleStatusSwitch = async () => {
    if (!user) return;

    setActiveLoading(true);

    // if inactive, it cannot be set to active from here
    if (active === false) {
      setActiveLoading(false);
      setIsModalOpen(true);
      return;
    }

    try {
      await updateUserAvailabilityStatus({
        userId: user?.id,
        status: !active,
      });

      setActive((prev) => !prev);
      await useUserStore.getState().hydrate();
    } catch (error) {
      console.error(error);
    } finally {
      setActiveLoading(false);
      triggerRefresh();
    }
  };

  return (
    <>
      <UserInactiveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {!isLoading ? (
        <Box className="relative flex-1 overflow-hidden !bg-white/5 !backdrop-blur-2xl !border-white/10 !shadow-2xl dark:!bg-slate-900/5 dark:!border-slate-400/10 !before:absolute !before:inset-0 !before:bg-gradient-to-br !before:from-white/10 !before:to-transparent !before:pointer-events-none">
          {/* Background decoration */}
          <div className="from-customBlue-50/30 dark:from-customBlue-950/10 absolute inset-0 bg-gradient-to-br to-purple-50/30 dark:to-purple-950/10" />
          <div className="absolute -left-4 -top-4 h-32 w-32 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-400/10 blur-2xl" />

          {/* Dynamic layout with profile picture as hero */}
          <div className="relative flex flex-col gap-6">
            {/* Hero Profile Section */}
            <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              {/* Profile picture - responsive sizing */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="group relative">
                  <div className="from-customBlue-500 absolute inset-0 rounded-3xl bg-gradient-to-br to-purple-500 opacity-75 blur-lg transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"></div>
                  <div className="relative rounded-3xl bg-white/80 p-1.5 backdrop-blur-sm dark:bg-gray-800/80">
                    <Image
                      alt={`Profile picture of ${user?.first_name} ${user?.last_name || ""}, ${user?.display_position || "team member"}`}
                      src={user?.image_url ? `${user.image_url}` : defaultAvatar}
                      width={120}
                      height={120}
                      title={`${user?.first_name}'s Profile Picture`}
                      className="h-[100px] w-[100px] sm:h-[120px] sm:w-[120px] rounded-2xl object-cover transition-all duration-500 group-hover:scale-105 group-hover:rotate-2"
                    />
                  </div>
                  {/* Enhanced online status indicator */}
                  <div className="absolute -bottom-2 -right-2 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 shadow-lg">
                    <div className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                  </div>
                </div>
                
                {/* Badges section - under profile pic with no background */}
                <div className="flex justify-center">
                  <Badges />
                </div>
              </div>

              {/* Welcome content - responsive layout */}
              <div className="flex-1 space-y-3 text-center sm:text-left w-full">
                <div className="pr-16 sm:pr-20">
                  <h2 className="to-blue-600 bg-gradient-to-r from-purple-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl md:text-3xl leading-tight">
                    Hey {user?.first_name ?? ""}! 👋
                  </h2>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1">
                    Ready to conquer today?
                  </p>
                </div>
                
                {/* Position badge */}
                <div className="inline-block">
                  <div className="rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-2 backdrop-blur-sm border border-blue-300/30 dark:border-blue-600/30">
                    <p className="text-base font-bold text-gray-800 dark:text-gray-100">
                      {user?.display_position}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate and Active Status - Always top-right */}
          <div className="absolute right-2 top-2 sm:right-4 sm:top-4 z-20">
            <div className="flex items-center gap-2">
              {/* Active status */}
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
              
              {/* Certificate button */}
              {user && <DashboardCertificate />}
            </div>
          </div>

        </Box>
      ) : (
        <Box className="flex-1">
          <div className="mx-auto flex flex-col items-center gap-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </Box>
      )}
    </>
  );
}
