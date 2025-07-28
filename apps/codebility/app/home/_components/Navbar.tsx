"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Theme from "@/components/shared/dashboard/Theme";
import { defaultAvatar } from "@/public/assets/images";
import {
  IconCog,
  IconDropdown,
  IconLogout,
  IconProfile,
} from "@/public/assets/svgs";
import { Bell } from "lucide-react";
import { useUserStore } from "@/store/codev-store";

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
  { href: "/home/account-settings", icon: IconCog, label: "Settings" },
  { href: "/home/settings/profile", icon: IconProfile, label: "Profile" },
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
    <nav className="background-navbar fixed top-0 z-50 w-full shadow-sm" role="banner">
      <div className="flex items-center justify-between px-8 py-2">
        <div className="flex items-center" role="navigation" aria-label="Logo">
          <Link href="/home" className="flex items-center">
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
        </div>
        <div className="flex items-center gap-4" role="navigation" aria-label="User menu">
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="h-1.5 w-1.5 bg-white rounded-full"></span>
            </span>
          </button>
          <Theme />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger 
              className="flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label={`User menu for ${first_name} ${last_name}`}
            >
              <div className="hidden flex-col items-end md:flex" aria-hidden="true">
                <p className="capitalize dark:text-white">
                  {first_name} {last_name}
                </p>
                <p className="text-dark100_light900 text-sm">{email_address}</p>
              </div>
              <div className="from-violet relative size-[44px] rounded-full bg-gradient-to-b to-blue-500 p-[1.5px]">
                <Image
                  alt={`${first_name} ${last_name}'s profile picture`}
                  src={image_url || defaultAvatar}
                  fill
                  sizes="44px"
                  className="h-auto w-full rounded-full object-cover"
                  title={`${first_name}'s Avatar`}
                />
              </div>
              <IconDropdown className="hidden invert dark:invert-0 md:block" aria-hidden="true" />
              <span className="sr-only">
                Open user menu for {first_name} {last_name} ({email_address})
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
              className="dark:bg-dark-100 absolute -left-24 top-3 border-white dark:border-zinc-700 md:w-[200px]"
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
                    <item.icon className="invert dark:invert-0" aria-hidden="true" />
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
                <IconLogout className="invert dark:invert-0" aria-hidden="true" /> 
                Logout
                <span className="sr-only"> - This will sign you out of your account</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
