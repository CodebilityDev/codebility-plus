"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSidebarData, Sidebar, SidebarLink } from "@/constants/sidebar";
import useAuthCookie from "@/hooks/use-cookie";
import useHideSidebarOnResize from "@/hooks/useHideSidebarOnResize";

// UI components
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@codevs/ui/sheet";

const NavContent = ({ sidebarData }: { sidebarData: Sidebar[] }) => {
  const pathname = usePathname();

  return (
    <section className="flex h-full flex-col gap-2 pt-4">
      {sidebarData.map((item) => (
        <div key={item.id}>
          <h4 className="text-gray text-sm uppercase">{item.title}</h4>
          <div className="mt-3">
            {item.links.map((link: SidebarLink) => {
              // If you want even more route gating logic, do it here:
              // e.g. let isAllowedRoute = ...
              const isActive =
                (pathname.includes(link.route) && link.route.length > 1) ||
                pathname === link.route;

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

  // From your auth cookie
  const { data: authData } = useAuthCookie();
  const userType = authData?.userType;

  // We store the fetched sidebar data here
  const [sidebarData, setSidebarData] = useState<Sidebar[]>([]);

  /**
   * On mount (and whenever userType?.role_id changes),
   * fetch the user’s sidebar data from Supabase.
   */
  useEffect(() => {
    const fetchData = async () => {
      if (!userType?.role_id) {
        // If no role_id, we can bail or set empty array
        setSidebarData([]);
        return;
      }

      try {
        const data = await getSidebarData(userType.role_id);
        setSidebarData(data);
      } catch (err) {
        console.error("Error fetching sidebar data:", err);
        setSidebarData([]);
      }
    };

    fetchData();
  }, [userType?.role_id]);

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
        className="overflow-y-auto border-r border-zinc-300 bg-[#0E0E0E] dark:border-zinc-800"
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
          {/* The entire NavContent is wrapped in SheetClose
              so that selecting a link closes the side nav */}
          <SheetClose asChild>
            <NavContent sidebarData={sidebarData} />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
