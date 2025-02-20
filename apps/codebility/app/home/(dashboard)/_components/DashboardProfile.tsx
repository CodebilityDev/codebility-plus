"use client";

import Image from "next/image";
import Badges from "@/Components/shared/Badges";
import Box from "@/Components/shared/dashboard/Box";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { defaultAvatar } from "@/public/assets/images";
import { useUserStore } from "@/store/codev-store";

export default function DashboardProfile() {
  const { user } = useUserStore();

  const isLoading = !user;

  return (
    <>
      {!isLoading ? (
        <Box className="relative flex-1">
          <div className="mx-auto flex flex-col items-center gap-3">
            <p className="text-2xl font-semibold capitalize">
              Hello, {user?.first_name ?? ""}!
            </p>

            <Image
              alt="Avatar"
              src={user?.image_url ? `${user.image_url}` : defaultAvatar}
              width={100}
              height={100}
              title={`${user?.first_name}'s Avatar`}
              className="from-violet h-[100px] w-[100px] rounded-lg bg-gradient-to-b to-blue-500 bg-cover object-cover"
            />
            <p className="text-md">{user?.display_position}</p>

            <Badges />
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
