"use client";

import Image from "next/image";
import Box from "@/Components/shared/dashboard/Box";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal-users";
import { defaultAvatar } from "@/public/assets/images";
import { Codev } from "@/types/home/codev";

interface InternCardProps {
  user: Codev;
}

export default function InternCard({ user }: InternCardProps) {
  const { onOpen } = useModal();

  return (
    <Box className="mx-auto h-full w-full rounded-lg border-none px-0">
      <div className="flex w-full flex-col items-center gap-4 rounded-lg text-center">
        {/* Avatar + Status Badge */}
        <div className="relative size-16 rounded-full bg-cover object-cover">
          <Image
            alt={`${user.first_name} avatar`}
            src={user.image_url || defaultAvatar}
            fill
            className="h-[70px] w-[70px] rounded-full bg-cover object-cover p-0.5"
            loading="eager"
          />
          <div className="absolute bottom-[4px] right-[2px]">
            <p
              className={`rounded-full p-2 text-[9px] ${
                user.internal_status === "AVAILABLE"
                  ? "bg-green"
                  : user.internal_status === "DEPLOYED"
                    ? "bg-orange-400"
                    : "bg-gray"
              }`}
            />
          </div>
        </div>

        {/* Name + Position */}
        <div className="bg-light-700 dark:bg-dark-400 flex w-full flex-col items-center py-3">
          <p className="text-lg font-semibold capitalize">
            {user.first_name} {user.last_name}
          </p>
          {user.display_position ? (
            <p className="pb-3 font-light">{user.display_position}</p>
          ) : (
            <p className="p-4">&nbsp;</p>
          )}

          {/* Status Label */}
          <p
            className={`w-min rounded-md px-3 py-1 ${
              user.internal_status === "AVAILABLE"
                ? "bg-green"
                : user.internal_status === "DEPLOYED"
                  ? "bg-orange-400"
                  : "bg-gray"
            }`}
          >
            {user.internal_status === "AVAILABLE"
              ? "Available"
              : user.internal_status === "DEPLOYED"
                ? "Deployed"
                : "Inactive"}
          </p>
        </div>

        <Button
          onClick={() => onOpen("profileModal", user)}
          variant="link"
          className="mt-2 flex"
        >
          View Profile
        </Button>
      </div>
    </Box>
  );
}
