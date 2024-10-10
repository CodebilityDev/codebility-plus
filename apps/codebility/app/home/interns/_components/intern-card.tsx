"use client";

import React from "react";
import Image from "next/image";
import Box from "@/Components/shared/dashboard/Box";
import { Button } from "@/Components/ui/button";
import { useModal } from "@/hooks/use-modal-users";
import { defaultAvatar } from "@/public/assets/images";
import { User } from "@/types";

const InternCard = ({ user }: { user: User; color: string }) => {
  const { onOpen } = useModal();

  return (
    <Box
      key={user.id}
      className="mx-auto h-full w-full rounded-lg border-none px-0"
    >
      <div className="flex w-full flex-col items-center gap-4 rounded-lg text-center">
        <div className="relative size-16 rounded-full bg-cover object-cover">
          <Image
            alt={`${user.first_name} Avatar`}
            src={user.image_url || defaultAvatar}
            fill
            className="h-[70px] w-[70px] rounded-full bg-cover object-cover p-0.5"
            loading="eager"
          />
          <div className="absolute bottom-[4px] right-[2px]">
            <p
              className={`rounded-full  p-2 text-[9px] ${
                user.jobStatusType === "AVAILABLE"
                  ? "bg-green"
                  : user.jobStatusType === "DEPLOYED"
                    ? "bg-orange-400"
                    : "bg-gray"
              }`}
            ></p>
          </div>
        </div>
        <div className="bg-light-700 dark:bg-dark-400 flex w-full flex-col items-center py-3">
          <p className="text-lg font-semibold capitalize">
            {user.first_name} {user.last_name}
          </p>
          {user.main_position === null ? (
            <p className="p-4"> </p>
          ) : (
            <p className="pb-3 font-light">{user.main_position}</p>
          )}

          <p
            className={`w-min rounded-md px-3 py-1 ${
              user.jobStatusType === "AVAILABLE"
                ? "bg-green-400"
                : user.jobStatusType === "DEPLOYED"
                  ? "bg-orange-400"
                  : "bg-gray"
            }`}
          >
            {user.jobStatusType === "AVAILABLE"
              ? "Available"
              : user.jobStatusType === "DEPLOYED"
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
};

export default InternCard;
