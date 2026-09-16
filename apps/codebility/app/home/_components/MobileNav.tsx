"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useHideSidebarOnResize from "@/hooks/navigation/useHideSidebarOnResize";
import type { Sidebar } from "@/constants/sidebar";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@codevs/ui/sheet";

interface SidebarLink {
  route: string;
  label: string;
  imgURL: string;
}

/**
 * `sidebarData` is fetched once by `LeftSidebarServer` and passed down, so this
 * no longer re-fetches the same role-filtered links on the client. Previously
 * it called the `getSidebarData` server action from a mount effect, duplicating
 * a query the layout had already made.
 */
const NavContent = ({ sidebarData }: { sidebarData: Sidebar[] }) => {
  const pathname = usePathname();

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

const MobileNav = ({ sidebarData }: { sidebarData: Sidebar[] }) => {
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
            className="invert dark:invert-0"
            aria-hidden="true"
          />
          <span className="sr-only">Open mobile navigation menu</span>
        </button>
      </SheetTrigger>
      <SheetContent
        id="mobile-navigation"
        side="left"
        className="overflow-y-auto bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Mobile Navigation Menu</SheetTitle>
          <SheetDescription>
            Navigate through the application pages using the links below
          </SheetDescription>
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
          <NavContent sidebarData={sidebarData} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;