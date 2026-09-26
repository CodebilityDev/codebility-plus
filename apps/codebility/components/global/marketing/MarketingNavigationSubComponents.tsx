"use client";

import { useState, use, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";



import { defaultAvatar } from "@/public/assets/images/index";
import { IconLogout } from "@/public/assets/svgs/index";

import { ChevronDown, ChevronUp } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@codevs/ui";


import { createClientClientComponent } from "@/lib/global/supabase-client";
import { setLocalStorageValue, useLocalStorageValue } from "@/hooks/global/useLocalStorageValue";
import { NavUserProfile } from "@/types/global/database";
import { CareersSignIn } from "@/components/global/marketing/CareersSignIn";
import { NAV_USER_PROFILE_KEY } from "@/constants/global/marketing";
import { getMenuItems } from "@/utils/global/marketing";
import type { DrawerAuthSectionProps, UserMenuProps } from "@/types/global/marketing";



async function getNavUser() {
  const supabase = createClientClientComponent();
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
      .from("codev")
      .select(`*, applicant (id, codev_id)`)
      .eq("id", user.id)
      .single();

  if (!profile) return null;

  const cleanUserData = {
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: profile.email_address,
    image_url: profile.image_url,
    application_status: profile.application_status,
    role_id: profile.role_id,
    applicant: profile.applicant ?? null,
  };

  if (typeof window !== "undefined") {
    setLocalStorageValue(NAV_USER_PROFILE_KEY, cleanUserData);
  }

  return cleanUserData;
}


let navUserPromise: ReturnType<typeof getNavUser> | null = null;

function getNavUserPromise() {
  if (!navUserPromise) navUserPromise = getNavUser()
  return navUserPromise;
}

export const DrawerAuthSection = ({handleLogout}: DrawerAuthSectionProps) =>
   { 
    const cachedUserData = useLocalStorageValue<NavUserProfile>(NAV_USER_PROFILE_KEY);

    const userPromise = useMemo(() => {
      if (cachedUserData) {
        return Promise.resolve(cachedUserData);
      }
      return getNavUserPromise();
    }, [cachedUserData]);

    const userData = use(userPromise)

    if (!userData) return null;
    
    return (
  <>
    <div className="border-t border-zinc-700 my-2" />
    {getMenuItems(
      userData.application_status,
      userData.role_id,
      userData.applicant,
    ).map((item) => (
      <Link href={item.href} key={item.label}>
        <div className="flex items-center gap-4 p-4 text-left text-xl font-semibold">
          <item.icon className="h-6 w-6" style={{ color: "#ffffff" }} />
          {item.label}
        </div>
      </Link>
    ))}
    <div className="border-t border-zinc-700 my-2" />
    <button
      onClick={handleLogout}
      className="flex items-center gap-4 w-full cursor-pointer border-none p-4 text-left text-xl font-semibold"
    >
      <IconLogout className="h-6 w-6 text-white" />
      Logout
    </button>
  </>
)};

export const UserMenu = ({handleLogout}: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const cachedUserData = useLocalStorageValue<NavUserProfile>(NAV_USER_PROFILE_KEY);

  const userPromise = useMemo(() => {
      if (cachedUserData) {
        return Promise.resolve(cachedUserData);
      }
      return getNavUserPromise();
    }, [cachedUserData]);

  const userData = use(userPromise)

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
        {getMenuItems(application_status, role_id, applicant).map((item) => (
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