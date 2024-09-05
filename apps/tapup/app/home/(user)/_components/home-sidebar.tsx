"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { SidebarLink, sidebarLinks } from "../_lib/home-sidebar-links";
import Sublink from "./home-sidebar-sublink";

function HomeSidebar() {
  return (
    <aside className="z-30 hidden min-h-screen w-full bg-background shadow-lg lg:block">
      <nav className="flex h-dvh flex-col shadow-sm">
        <div className="mb-8 flex items-center gap-2 p-4 pb-2 text-2xl">
          <span className="font-bold text-foreground">Tap</span>
          <span className="font-bold text-primary">Up</span>
        </div>

        <ul className="flex flex-1 flex-col gap-4 px-8 text-primary">
          {sidebarLinks.map((el, i) => (
            <SidebarItems
              item={el}
              key={el.key}
              chevron={Boolean(el.subLinks && el.subLinks.length > 0)}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default HomeSidebar;

type SidebarItemsProps = {
  item: SidebarLink;
  chevron: boolean;
};

export function SidebarItems({ item, chevron }: SidebarItemsProps) {
  const pathname = usePathname();
  const isActive = () => {
    return item.path === pathname;
  };
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <li
        className={`text-pr flex cursor-pointer  items-center justify-between rounded-md bg-background px-2 py-3 duration-300 ${isActive() ? "bg-primary text-primary-foreground" : "bg-background hover:bg-primary/80 hover:text-primary-foreground"} ${item.key === "settings" && "mb-3 mt-auto"}`}
      >
        <Link
          href={item.path}
          className="flex w-40 items-center gap-2 text-sm hover:text-primary-foreground"
        >
          {item.icon}
          {item.label}
        </Link>
        {chevron && (
          <div onClick={() => setIsOpen(!isOpen)}>
            <ChevronDown
              className={`${isOpen ? "rotate-180" : ""} duration-300`}
            />
          </div>
        )}
      </li>

      {chevron && (
        <div
          className={`overflow-hidden transition-all duration-300   ${
            isOpen ? "max-h-40" : "max-h-0"
          }`}
        >
          {item.subLinks?.map((el) => (
            <Sublink href={el.path} key={el.key} link={el.label} />
          ))}
        </div>
      )}
    </>
  );
}
