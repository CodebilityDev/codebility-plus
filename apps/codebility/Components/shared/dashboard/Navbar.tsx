"use client"

import Image from "next/image"
import React from "react"

import Link from "next/link"
import Theme from "@/Components/shared/dashboard/Theme"
import MobileNav from "@/Components/shared/dashboard/MobileNav"
import { IconDropdown, IconLogout, IconProfile } from "@/public/assets/svgs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu"
import useAuth from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { defaultAvatar } from "@/public/assets/images"

export const menuItems = [{ href: "/settings", icon: IconProfile, label: "Settings" }]

const Navbar = () => {
  const { userData } = useAuth()
  const router = useRouter()
  return (
    <>
      <nav className="background-navbar fixed top-0 z-10 w-full shadow-sm">
        <div className="flex px-8 ">
          <div className="flex flex-1 items-center justify-end gap-6 p-4">
            {/* <IconBell className="invert dark:invert-0" /> */}
            <Theme />
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-4 focus:outline-none">
                <div className="hidden flex-col items-end md:flex ">
                  <p className="capitalize dark:text-white">
                    {userData?.first_name} {userData?.last_name}
                  </p>
                  <p className="text-sm text-gray">{userData?.email_address}</p>
                </div>
                <div className="relative size-[44px] rounded-full bg-gradient-to-b from-violet to-blue-500 bg-cover object-cover p-[1.5px]">
                  <Image
                    alt="Avatar"
                    src={userData?.image_url ?? defaultAvatar}
                    fill
                    title={`${userData?.name}'s Avatar`}
                    className="h-auto w-full rounded-full bg-gradient-to-b from-violet to-blue-500 bg-cover object-cover"
                    loading="eager"
                  />
                </div>
                <IconDropdown className="hidden invert dark:invert-0 md:block" />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="absolute -left-24 top-3 border-white dark:border-zinc-700 dark:bg-dark-100 md:w-[200px]">
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
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push("/auth/signout")
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
  )
}

export default Navbar