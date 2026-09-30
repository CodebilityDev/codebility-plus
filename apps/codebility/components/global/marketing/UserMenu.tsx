"use client";

import { useState } from "react";

import { useNavUser } from "@/hooks/global/useNavUser";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@codevs/ui";
import { defaultAvatar } from "@/public/assets/images/index";
import { IconLogout } from "@/public/assets/svgs/index";
import { CareersSignIn } from "@/components/global/marketing/CareersSignIn";
import type { UserMenuProps } from "@/types/global/marketing";
import { getMenuItems } from "@/utils/global/marketing";

export const UserMenu = ({handleLogout}: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const userData = useNavUser();

  if (!userData) return <CareersSignIn />;

  const {first_name, last_name, email, image_url, application_status, role_id, applicant } = userData

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger className="hidden items-center gap-4 focus:outline-none lg:flex">
        <div className="flex-col items-end lg:flex">
          <p className="capitalize text-white">
            {first_name} {last_name}
          </p>
          <p className="text-white text-sm">{email}</p>
        </div>
        <div className="from-customViolet-300 relative overflow-hidden rounded-full bg-gradient-to-b to-customBlue-500 lg:h-[44px] lg:w-[52px]">
          <Image
            alt="Avatar"
            src={image_url || defaultAvatar}
            fill
            sizes="52px"
            title={`${first_name}'s Avatar`}
            className="rounded-full"
          />
        </div>

        {isOpen ? (
          <ChevronUp className="h-6 w-6 text-white" />
        ) : (
          <ChevronDown className="h-6 w-6 text-white" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="dark:bg-dark-100 bg-dark-100 absolute -left-24 top-3 border-zinc-700 md:w-[200px]">
        {getMenuItems(application_status ?? "", role_id ?? 0, applicant).map((item) => (
          <Link key={item.label} href={item.href}>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-6 p-3 px-5"
              style={{
                backgroundColor:
                  isHovered === item.label ? "#292524" : "transparent",
                color: "#ffffff",
              }}
              onMouseEnter={() => setIsHovered(item.label)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <item.icon style={{ color: "#ffffff" }} />
              {item.label}
            </DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-6 p-3 px-5 text-white"
          style={{
            backgroundColor: isHovered === "logout" ? "#292524" : "transparent",
          }}
          onMouseEnter={() => setIsHovered("logout")}
          onMouseLeave={() => setIsHovered(null)}
        >
          <IconLogout className="text-white" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};