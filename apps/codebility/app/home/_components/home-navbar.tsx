"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Theme from "@/Components/shared/dashboard/Theme";
import { defaultAvatar } from "@/public/assets/images";
import { IconDropdown, IconLogout, IconProfile } from "@/public/assets/svgs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import useUser from "../_hooks/use-user";
import { signOut } from "../../authv2/actions";
import MobileNav from "./home-mobile-navbar";

export const menuItems = [
  { href: "/home/account-settings", icon: IconProfile, label: "Settings" },
];

const Navbar = () => {
  const user = useUser();

  const { first_name, last_name, email, image_url } = user;

  return (
    <>
      <nav className="background-navbar fixed top-0 z-10 w-full shadow-sm">
        <div className="flex px-8 ">
          <div className="flex flex-1 items-center justify-end gap-6 p-4">
            {/* <IconBell className="invert dark:invert-0" /> */}
            <Theme />
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="flex items-center gap-4 focus:outline-none">
                <div className="hidden flex-col items-end md:flex ">
                  <p className="capitalize dark:text-white">
                    {first_name} {last_name}
                  </p>
                  <p className="text-gray text-sm">{email}</p>
                </div>
                <div className="from-violet relative size-[44px] rounded-full bg-gradient-to-b to-blue-500 bg-cover object-cover p-[1.5px]">
                  <Image
                    alt="Avatar"
                    src={image_url ? `${image_url}` : defaultAvatar}
                    fill
                    title={`${first_name}'s Avatar`}
                    className="from-violet h-auto w-full rounded-full bg-gradient-to-b to-blue-500 bg-cover object-cover"
                    loading="eager"
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
    </>
  );
};

export default Navbar;
