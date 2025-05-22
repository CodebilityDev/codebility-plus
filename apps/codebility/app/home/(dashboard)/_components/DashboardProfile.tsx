"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Badges from "@/Components/shared/Badges";
import Box from "@/Components/shared/dashboard/Box";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import SwitchStatusButton from "@/Components/ui/SwitchStatusButton";
import { defaultAvatar } from "@/public/assets/images";
import { useUserStore } from "@/store/codev-store";

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

  const handleStatusSwitch = async () => {
    if (!user) return;

    setActiveLoading(true);

    try {
      await updateUserAvailabilityStatus({
        userId: user?.id,
        status: !active,
      });

      setActive((prev) => !prev);
    } catch (error) {
      console.error(error);
    } finally {
      setActiveLoading(false);
    }
  };

  return (
    <>
      {!isLoading ? (
        <Box className="relative flex-1">
          {/* {user && <DashboardCertificate user={user} />} */}
          <div className="mx-auto flex flex-col items-center gap-3">
            <p className="mt-4 text-2xl font-semibold capitalize md:mt-0">
              Hello, {user?.first_name ?? ""}!
            </p>

            <Image
              alt="Avatar"
              src={user?.image_url ? `${user.image_url}` : defaultAvatar}
              width={100}
              height={100}
              title={`${user?.first_name}'s Avatar`}
              unoptimized={true}
              className="from-violet h-[100px] w-[100px] rounded-lg bg-gradient-to-b to-blue-500 bg-cover object-cover"
            />
            <p className="text-md">{user?.display_position}</p>

            <Badges />
          </div>

          {/* status switch */}
          <div className="absolute right-4 top-4 flex w-1/3 flex-col items-center justify-center gap-2 lg:flex-col-reverse xl:flex-col">
            {active !== null && (
              <div className="ml-auto flex gap-2">
                <Badge className={cn(active ? "bg-green" : "bg-red-500")}>
                  {active ? "Active" : "Inactive"}
                </Badge>

                <SwitchStatusButton
                  isActive={active}
                  disabled={activeloading}
                  handleSwitch={handleStatusSwitch}
                />
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
