"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarData } from "@/constants";
import useHideSidebarOnResize from "@/hooks/useHideSidebarOnResize";
import useUser from "../_hooks/use-user";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@codevs/ui/sheet";

const NavContent = () => {
  const user = useUser();
  const pathname = usePathname();

  return (
    <section className="flex h-full flex-col gap-2 pt-4 ">
      {sidebarData.map((item) => {
        const hasPermission = item.links.some((link) =>
          user.permissions.includes(link.permission),
        );

        return (
          <div key={item.id} className={`${!hasPermission ? "hidden" : "block"}`}>
            <h4
              className={`text-gray text-sm uppercase ${!hasPermission ? "hidden" : "block"}`}
            >
              {item.title}
            </h4>
            <div className={`${!hasPermission ? "mt-0" : "mt-3"}`}>
              {item.links.map((link) => {
                const accessRoutes = user.permissions.includes(link.permission);
                const isActive = pathname === link.route;

                if (!accessRoutes) {
                  return null;
                }

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
        );
      })}
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
