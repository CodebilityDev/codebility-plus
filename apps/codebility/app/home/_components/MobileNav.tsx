"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSidebarData } from "@/constants/sidebar";
import useHideSidebarOnResize from "@/hooks/useHideSidebarOnResize";
import { useUserStore } from "@/store/codev-store";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@codevs/ui/sheet";

interface SidebarLink {
  route: string;
  label: string;
  imgURL: string;
}

interface SidebarSection {
  id: string;
  title: string;
  links: SidebarLink[];
}

const NavContent = () => {
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
                        className={`${isActive ? "" : "invert-colors"} h-5 w-5 object-contain`}
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

const MobileNav = () => {
  const { isSheetOpen, setIsSheetOpen } = useHideSidebarOnResize();

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <button
          className="rounded p-1 focus:outline-none focus:ring-2 focus:ring-customBlue-500 focus:ring-offset-2 lg:hidden"
          aria-label="Open navigation menu"
          aria-expanded={isSheetOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsSheetOpen(true)}
        >
          <Image
            src="/assets/svgs/icon-hamburger.svg"
            width={20}
            height={20}
            alt=""
            className="invert-colors"
            aria-hidden="true"
          />
          <span className="sr-only">Open mobile navigation menu</span>
        </button>
      </SheetTrigger>
      <SheetContent
        id="mobile-navigation"
        aria-describedby="mobile-nav-description"
        side="left"
        className="overflow-y-auto border-r border-zinc-300 bg-[#OEOEOE] bg-opacity-80 backdrop-blur-lg dark:border-zinc-800"
        role="dialog"
        aria-labelledby="mobile-nav-title"
      >
        <SheetHeader>
          <SheetTitle id="mobile-nav-title" className="sr-only">
            Mobile Navigation Menu
          </SheetTitle>
          <div id="mobile-nav-description" className="sr-only">
            Navigate through the application pages using the links below
          </div>
        </SheetHeader>
        <div className="mb-4">
          <Link
            href="/"
            className="flex items-center gap-1"
            aria-label="Go to homepage"
          >
            <Image
              src="/assets/svgs/codebility-violet.svg"
              width={147}
              height={30}
              alt="Codebility"
            />
          </Link>
        </div>
        <div>
          <NavContent />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
