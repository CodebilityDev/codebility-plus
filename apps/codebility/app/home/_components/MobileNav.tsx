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
            ? 11
            : user.role_id;
        const data = await getSidebarData(roleId);
        setSidebarData(data);
      }
    };

    fetchSidebarData();
  }, [user?.role_id]);

  if (user?.application_status !== "passed") return null;

  return (
    <section className="flex h-full flex-col gap-2 pt-4">
      {sidebarData.map((item) => (
        <div key={item.id}>
          <h4 className="text-gray text-sm uppercase">{item.title}</h4>
          <div className="mt-3">
            {item.links.map((link) => {
              const isActive = pathname === link.route;

              return (
                <SheetClose asChild key={link.route}>
                  <Link
                    href={link.route}
                    className={`${
                      isActive
                        ? "primary-gradient text-light-900 rounded-lg"
                        : "text-dark300_light900"
                    } flex items-center justify-start gap-4 rounded-sm bg-transparent p-4`}
                  >
                    <Image
                      src={link.imgURL}
                      alt={link.label}
                      width={20}
                      height={20}
                      className={`${isActive ? "" : "invert-colors"} h-5 w-5 object-contain`}
                    />
                    <p className={`${isActive ? "base-normal" : "base-sm"}`}>
                      {link.label}
                    </p>
                  </Link>
                </SheetClose>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
};

const MobileNav = () => {
  const { isSheetOpen, setIsSheetOpen } = useHideSidebarOnResize();

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Image
          src="/assets/svgs/icon-hamburger.svg"
          width={20}
          height={20}
          alt="Menu"
          className="invert-colors lg:hidden"
          onClick={() => setIsSheetOpen(true)}
        />
      </SheetTrigger>
      <SheetContent
        aria-describedby={undefined}
        side="left"
        className="overflow-y-auto border-r border-zinc-300 bg-[#OEOEOE] bg-opacity-80 backdrop-blur-lg dark:border-zinc-800 "
      >
        <SheetHeader className="hidden">
          <SheetTitle>Sidebar</SheetTitle>
        </SheetHeader>
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/svgs/codebility-violet.svg"
            width={147}
            height={30}
            alt="Codebility violet logo"
          />
        </Link>
        <div>
          <NavContent />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
