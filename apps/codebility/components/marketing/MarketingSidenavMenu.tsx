"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { links } from "@/constants/marketing/marketing";
import { subscribeScrollShrink, getScrollShrinkSnapshot, getServerScrollShrinkSnapshot } from "@/utils/marketing/marketing";



const SideNavMenu = () => {
  const isScrolling = useSyncExternalStore(
    subscribeScrollShrink,
    getScrollShrinkSnapshot,
    getServerScrollShrinkSnapshot,
  );

  return (
    <div className="fixed left-0 top-20 z-50 hidden w-60 flex-col gap-4 ps-5 pt-24 text-sm lg:flex xl:text-base">
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className="hero-card relative duration-300 "
        >
          <div className="border-darkgray absolute -left-10 top-1/2 w-20 border" />
          <div
            className={`relative flex h-8 ${
              isScrolling ? "w-[52px] text-xs" : "w-36 text-base"
            } border-light-900/5 bg-light-700/10 group items-center gap-2 rounded-md border-2 ps-4 text-white backdrop-blur-lg duration-300 hover:ml-4 hover:w-36 hover:bg-customViolet-100 hover:text-base hover:text-opacity-100 hover:opacity-100 xl:h-10`}
          >
            <link.icon className="size-4 shrink-0" />
            <p
              className={`text-nowrap transition-opacity duration-300 ${
                isScrolling ? "opacity-0" : "opacity-100"
              } group-hover:opacity-100`}
            >
              {link.label}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SideNavMenu;
