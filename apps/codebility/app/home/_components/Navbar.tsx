"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Theme from "@/Components/shared/dashboard/Theme";
import { defaultAvatar } from "@/public/assets/images";
import {
  IconCog,
  IconDropdown,
  IconLogout,
  IconProfile,
} from "@/public/assets/svgs";
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
    <nav className="background-navbar fixed top-0 z-10 w-full shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center"></div>
        <div className="flex items-center gap-6">
          <Theme />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="flex items-center gap-4 focus:outline-none">
              <div className="hidden flex-col items-end md:flex">
                <p className="capitalize dark:text-white">
                  {first_name} {last_name}
                </p>
                <p className="text-gray text-sm">{email_address}</p>
              </div>
              <div className="from-violet relative size-[44px] rounded-full bg-gradient-to-b to-blue-500 p-[1.5px]">
                <Image
                  alt="Avatar"
                  src={image_url || defaultAvatar}
                  fill
                  unoptimized={true}
                  className="h-auto w-full rounded-full object-cover"
                  title={`${first_name}'s Avatar`}
                />
              </div>
              <IconDropdown className="hidden invert dark:invert-0 md:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="dark:bg-dark-100 absolute -left-24 top-3 border-white dark:border-zinc-700 md:w-[200px]">
              {menuItems.map((item) => (
                <Link href={item.href} key={item.label}>
                  <DropdownMenuItem className="flex cursor-pointer items-center gap-6 p-3 px-5">
                    <item.icon className="invert dark:invert-0" />
                    {item.label}
                  </DropdownMenuItem>
                </Link>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={async (e) => {
                  e.stopPropagation();
                  await signOut();
                }}
                className="flex cursor-pointer items-center gap-6 p-3 px-5"
              >
                <IconLogout className="invert dark:invert-0" /> Logout
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
