"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSidebarData, Sidebar, SidebarLink } from "@/constants/sidebar";
import useHideSidebarOnResize from "@/hooks/useHideSidebarOnResize";
import { Roles } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@codevs/ui/sheet";

const NavContent = ({
  sidebarData,
  userRole,
}: {
  sidebarData: Sidebar[];
  userRole: Roles | null;
}) => {
  const pathname = usePathname();

  return (
    <section className="flex h-full flex-col gap-2 pt-4">
      {sidebarData.map((item) => (
        <div key={item.id}>
          <h4 className="text-gray text-sm uppercase">{item.title}</h4>
          <div className="mt-3">
            {item.links.map((link: SidebarLink) => {
              const allowedRoutes = ["/settings", "/orgchart"];
              const isAdminOrUser =
                userRole?.name === "ADMIN" || userRole?.name === "USER";
              const isAllowedRoute =
                isAdminOrUser && allowedRoutes.includes(link.route);

              const hasPermission =
                link.permission && userRole
                  ? (userRole[link.permission as keyof Roles] ?? false)
                  : false;

              const accessRoutes = hasPermission || isAllowedRoute;
              const isActive =
                (pathname.includes(link.route) && link.route.length > 1) ||
                pathname === link.route;

              if (accessRoutes) {
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
              }
              return null;
            })}
          </div>
        </div>
      ))}
    </section>
  );
};

const MobileNav = () => {
  const { isSheetOpen, setIsSheetOpen } = useHideSidebarOnResize();
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  const [sidebarData, setSidebarData] = useState<Sidebar[]>([]);
  const [userRole, setUserRole] = useState<Roles | null>(null);

  useEffect(() => {
    if (!supabase) return;

    const fetchUserData = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          console.error("Auth error:", authError);
          return;
        }

        // Get the user's role from the codev table
        const { data: userData, error: roleError } = await supabase
          .from("codev")
          .select("role_id")
          .eq("id", user.id)
          .single();

        if (roleError || !userData) {
          console.error("Role fetch error:", roleError);
          return;
        }

        // Get the complete role details including permissions
        const { data: roleData, error: roleDetailsError } = await supabase
          .from("roles")
          .select(
            `
            id,
            name,
            orgchart,
            settings,
            resume,
            services,
            permissions,
            roles,
            projects,
            clients,
            inhouse,
            applicants,
            interns,
            time_tracker,
            kanban,
            dashboard
          `,
          )
          .eq("id", userData.role_id)
          .single();

        if (roleDetailsError || !roleData) {
          console.error("Role details error:", roleDetailsError);
          return;
        }

        setUserRole(roleData as Roles);

        // Fetch sidebar data with the role
        const sidebarItems = await getSidebarData(roleData.id);
        setSidebarData(sidebarItems);
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchUserData();

    // Set up real-time subscription for role changes
    const channel = supabase
      .channel("mobile-role-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "codev",
          filter: `role_id=eq.${userRole?.id}`,
        },
        () => {
          fetchUserData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

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
          <SheetClose asChild>
            <NavContent sidebarData={sidebarData} userRole={userRole} />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
