"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
      {!isLoading ? (
        <Box className="relative flex-1 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-950/10 dark:to-purple-950/10" />
          <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-400/10 blur-2xl" />
          
          {user && <DashboardCertificate />}
          <div className="relative mx-auto flex flex-col items-center gap-4">
            <div className="text-center">
              <h2 className="mt-4 text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent md:mt-0">
                Hello, {user?.first_name ?? ""}! 👋
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ready to level up today?</p>
            </div>

            <div className="relative">
              {/* Profile picture with enhanced styling */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-white dark:bg-gray-800 p-1 rounded-2xl">
                  <Image
                    alt={`Profile picture of ${user?.first_name} ${user?.last_name || ''}, ${user?.display_position || 'team member'}`}
                    src={user?.image_url ? `${user.image_url}` : defaultAvatar}
                    width={100}
                    height={100}
                    title={`${user?.first_name}'s Profile Picture`}
                    className="h-[100px] w-[100px] rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {/* Online status indicator */}
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{user?.display_position}</p>
              <div className="mt-2">
                <Badges />
              </div>
            </div>
          </div>

          {/* Enhanced status switch */}
          <div className="absolute right-4 top-4 flex w-1/3 flex-col items-center justify-center gap-3 lg:flex-col-reverse xl:flex-col">
            {active !== null && (
              <div className="ml-auto flex flex-col items-end gap-2">
                <Badge className={cn(
                  "font-medium shadow-lg transition-all duration-300",
                  active 
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-green-500/25" 
                    : "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-500/25"
                )}>
                  <div className="flex items-center gap-1">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      active ? "bg-white animate-pulse" : "bg-white/70"
                    )} />
                    {active ? "🟢 Active" : "🔴 Inactive"}
                  </div>
                </Badge>

                <SwitchStatusButton
                  isActive={active}
                  disabled={activeloading}
                  handleSwitch={handleStatusSwitch}
                />
                
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {active ? "Available for work" : "Away"}
                </p>
              </div>
            )}
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
