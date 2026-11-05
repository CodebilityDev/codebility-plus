"use client";

import { useNavUser } from "@/hooks/global/useNavUser";
import Link from "next/link";

import { IconLogout } from "@/public/assets/svgs/index";
import type { DrawerAuthSectionProps } from "@/types/global/marketing";
import { getMenuItems } from "@/utils/global/marketing";

export const DrawerAuthSection = ({handleLogout}: DrawerAuthSectionProps) =>
   { 
    const userData = useNavUser();

    if (!userData) return null;
    
    return (
  <>
    <div className="border-t border-zinc-700 my-2" />
    {getMenuItems(
      userData.application_status ?? "",
      userData.role_id ?? 0,
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