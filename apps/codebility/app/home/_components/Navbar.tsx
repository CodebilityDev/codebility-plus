"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Theme from "@/components/shared/dashboard/Theme";
import { MobileTheme } from "@/components/shared/dashboard/theme-mobile";
import { defaultAvatar } from "@/public/assets/images";
import {
  IconCog,
  IconDropdown,
  IconLogout,
  IconProfile,
} from "@/public/assets/svgs";
import { useUserStore } from "@/store/codev-store";
import { NotificationContainer } from "@/components/notifications/NotificationContainer";
import { AnnouncementButton } from "@/app/home/announcements/AnnouncementButton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import { signOut } from "../../auth/actions";
import MobileNav from "./MobileNav";

export const defaultMenuItems = [
  { href: "/home/settings/profile", icon: IconProfile, label: "Profile" },
];

export const adminMenus = [
  { href: "/home/settings/profile", icon: IconProfile, label: "Profile" },
  { href: "/home/account-settings", icon: IconCog, label: "Settings" },
];

const Navbar = () => {
  const { user } = useUserStore(); // Get user data from Zustand store
  const router = useRouter();

  // // Redirect to sign-in page if no user is found
  // useEffect(() => {
  //   if (!user) {
  //     router.push("/auth/sign-in");
  //   }
  // }, [user, router]);

  // // Return null while redirecting to prevent rendering
  if (!user) return null;

  const { first_name, last_name, email_address, image_url, role_id } = user;

  const menuItems = role_id === 1 ? adminMenus : defaultMenuItems;

  return (
    <>
      <nav
        className="fixed top-0 z-20 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
        role="banner"
      >
      <div className="flex w-full min-w-full items-center justify-end px-8 py-2">
        {/*   <div className="md flex items-center" role="navigation" aria-label="Logo">
          <Link
            href="/home"
            className="flex scale-75 items-center md:scale-100"
          >
            <img
              src="/assets/svgs/codebility-black.svg"
              alt="Codebility Logo"
              className="h-8 w-auto dark:hidden"
            />
            <img
              src="/assets/svgs/codebility-white.svg"
              alt="Codebility Logo"
              className="hidden h-8 w-auto dark:block"
            />
            <span className="sr-only">Codebility Dashboard - Go to Home</span>
          </Link>
        </div> */}
        <div
          className="flex items-center gap-4"
          role="navigation"
          aria-label="User menu"
        >
          {/* Announcement Button - NEW */}
          <AnnouncementButton />
          
          <NotificationContainer />
          
          <div>
            <div className="md:hidden">
              <MobileTheme />
            </div>
            <div className="hidden items-center gap-4 md:flex">
              <Theme />
            </div>
          </div>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger
              className="focus:ring-customBlue-500 flex items-center gap-4 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-offset-2"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label={`User menu for ${first_name} ${last_name}`}
            >
              <div
                className="hidden flex-col items-end md:flex"
                aria-hidden="true"
              >
                <p className="capitalize text-gray-900 dark:text-gray-100">
                  {first_name} {last_name}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{email_address}</p>
              </div>
              <div className="from-customViolet-300 to-customBlue-500 relative size-[44px] rounded-full bg-gradient-to-b p-[1.5px]">
                <Image
                  alt={`${first_name} ${last_name}'s profile picture`}
                  src={image_url || defaultAvatar}
                  fill
                  sizes="44px"
                  className="h-auto w-full rounded-full object-cover"
                  title={`${first_name}'s Avatar`}
                />
              </div>
              <IconDropdown
                className="hidden text-gray-600 dark:text-gray-400 md:block"
                aria-hidden="true"
              />
              <span className="sr-only">
                Open user menu for {first_name} {last_name} ({email_address})
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="bg-white dark:bg-gray-800 absolute -left-24 top-3 border-gray-200 dark:border-gray-700 md:w-[200px] shadow-lg"
              role="menu"
              aria-label="User account options"
            >
              {menuItems.map((item) => (
                <Link href={item.href} key={item.label}>
                  <DropdownMenuItem
                    className="flex cursor-pointer items-center gap-6 p-3 px-5"
                    role="menuitem"
                    aria-label={`Go to ${item.label} page`}
                  >
                    <item.icon
                      className="invert dark:invert-0"
                      aria-hidden="true"
                    />
                    {item.label}
                  </DropdownMenuItem>
                </Link>
              ))}

              <DropdownMenuSeparator role="separator" />

              <DropdownMenuItem
                onClick={async (e) => {
                  e.stopPropagation();
                  await signOut();
                }}
                className="flex cursor-pointer items-center gap-6 p-3 px-5"
                role="menuitem"
                aria-label="Sign out of your account"
              >
                <IconLogout
                  className="invert dark:invert-0"
                  aria-hidden="true"
                />
                Logout
                <span className="sr-only">
                  {" "}
                  - This will sign you out of your account
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <MobileNav />
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;