"use client";

import { getSidebarData } from "@/actions/home/sidebar";
import { useUserStore } from "@/store/global/codev-store";
import type { SidebarSection } from "@/types/home/home";
import { SheetClose } from "@codevs/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export const NavContent = () => {
  const { user } = useUserStore();
  const pathname = usePathname();
  const [sidebarData, setSidebarData] = useState<SidebarSection[]>([]);

  // Fetch sidebar data based on user role
  useEffect(() => {
    const fetchSidebarData = async () => {
      if (user?.role_id) {
        const roleId =
          user.internal_status == "INACTIVE" ||
          user.availability_status == false
            ? -1
            : user.role_id;
        const data = await getSidebarData(roleId);
        setSidebarData(data);
      }
    };

    fetchSidebarData();
  }, [user?.role_id]);

  if (user?.application_status !== "passed") return null;

  return (
    <nav
      className="flex h-full flex-col gap-2 pt-4"
      role="navigation"
      aria-label="Main navigation"
    >
      {sidebarData.map((item) => (
        <div
          key={item.id}
          role="group"
          aria-labelledby={`nav-section-${item.id}`}
        >
          <h4
            id={`nav-section-${item.id}`}
            className="text-gray text-sm uppercase"
          >
            {item.title}
          </h4>
          <ul className="mt-3" role="list">
            {item.links.map((link) => {
              const isActive = pathname === link.route;

              return (
                <li key={link.route} role="none">
                  <SheetClose asChild>
                    <Link
                      href={link.route}
                      className={`${
                        isActive
                          ? "primary-gradient text-light-900 rounded-lg"
                          : "text-dark300_light900"
                      } flex items-center justify-start gap-4 rounded-sm bg-transparent p-4`}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={`Navigate to ${link.label}${isActive ? " (current page)" : ""}`}
                    >
                      <Image
                        src={link.imgURL}
                        alt=""
                        width={20}
                        height={20}
                        className={`${isActive ? "brightness-0 invert" : "brightness-0 dark:invert"} h-5 w-5 object-contain`}
                        aria-hidden="true"
                      />
                      <span
                        className={`${isActive ? "base-normal" : "base-sm"}`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};
