"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarData } from "@/constants";
import useHideSidebarOnResize from "@/hooks/useHideSidebarOnResize";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@codevs/ui/sheet";
import useUser from "../_hooks/use-user";
import { getSplit } from "@/lib/get-split";
import pathsConfig from "@/config/paths.config";

const NavContent = () => {
  const user = useUser();
  const pathname = usePathname();

  return (
    <section className="flex h-full flex-col gap-2 pt-4 ">
      {sidebarData.map((item) => (
        <div key={item.id}>
          <h4 className={`text-gray text-sm uppercase`}>{item.title}</h4>
          <div className="mt-3">
            {item.links.map((link) => {
              const allowedRoutes = [
                getSplit(pathsConfig.app.settings, "/", { getLast: true }),
                getSplit(pathsConfig.app.orgchart, "/", { getLast: true }),
                ...user.permissions,
              ];

              const accessRoutes = allowedRoutes.includes(link.permission);
              const isActive = pathname === link.route;

              return (
                <SheetClose asChild key={link.route}>
                  <Link
                    href={link.route}
                    className={`${
                      isActive
                        ? "default-color text-light-900 rounded-lg"
                        : "text-dark300_light900"
                    } flex items-center justify-start gap-4 bg-transparent p-4`}
                  >
                    <Image
                      src={link.imgURL}
                      alt={link.label}
                      width={20}
                      height={20}
                      className={`${isActive ? "" : "invert-colors"} h-auto w-auto`}
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
        side="left"
        className="overflow-y-auto border-r border-zinc-300 bg-[#OEOEOE] dark:border-zinc-800"
      >
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/svgs/codebility-violet.svg"
            width={147}
            height={30}
            alt="Codebility violet logo"
          />
        </Link>
        <div>
          <SheetClose asChild>
            <NavContent />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
