"use client";

import Image from "next/image"

import useAuth from "@/hooks/use-auth"

import Badges from "@/Components/shared/Badges"
import Box from "@/Components/shared/dashboard/Box"
import { defaultAvatar } from "@/public/assets/images"
import { Skeleton } from "@/Components/ui/skeleton/skeleton"

const ProfileDashboard = () => {
  const { isLoading, userData } = useAuth()
  return (
    <>
      {!isLoading ? (
        <Box className="relative flex-1">
          <div className="mx-auto flex flex-col items-center gap-3">
            <p className="text-2xl font-semibold capitalize">Hello, {userData?.first_name ?? ""}!</p>

            <Image
              alt="Avatar"
              src={userData.image_url || defaultAvatar}
              width={100}
              height={100}
              title={`${userData.name}'s Avatar`}
              className="h-[100px] w-[100px] rounded-lg bg-gradient-to-b from-violet to-blue-500 bg-cover object-cover"
            />
            <p className="text-md">{userData.main_position}</p>

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
  )
}

export default ProfileDashboard
