"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSidebarData, Sidebar, SidebarLink } from "@/constants/sidebar";
import { useNavStore } from "@/hooks/use-sidebar";
import { Roles } from "@/types/home/codev";
import { createClientClientComponent } from "@/utils/supabase/client";

const LeftSidebar = () => {
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  const { isToggleOpen, toggleNav } = useNavStore();
  const pathname = usePathname();

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
      .channel("role-changes")
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
    <section className="background-navbar sticky left-0 top-0 z-20 flex h-screen flex-col gap-14 overflow-y-auto p-6 shadow-lg max-lg:hidden">
      <div className="flex justify-stretch gap-4 max-lg:hidden">
        <div
          className={`transition-all ${!isToggleOpen ? "flex-0" : "flex-1"} flex overflow-hidden`}
        >
          <Link href="/">
            <Image
              src="/assets/svgs/codebility-white.svg"
              width={147}
              height={30}
              alt="Codebility white logo"
              className={`hidden h-[40px] transition-all dark:block ${!isToggleOpen && "w-0"}`}
            />
            <Image
              src="/assets/svgs/codebility-black.svg"
              width={147}
              height={30}
              alt="Codebility black logo"
              className={`h-[40px] transition-all dark:hidden ${!isToggleOpen && "w-0"}`}
            />
          </Link>
        </div>

        <Image
          onClick={toggleNav}
          src="/assets/svgs/icon-codebility.svg"
          width={30}
          height={40}
          alt="logo"
          className={`toggle-logo-btn ${isToggleOpen ? "close-nav" : "open-nav mx-auto"}`}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 max-lg:hidden">
        {sidebarData.map((item: Sidebar) => (
          <div key={item.id} className={`${!isToggleOpen ? "mt-0" : "mt-5"}`}>
            <h4
              className={`text-gray text-sm uppercase ${!isToggleOpen ? "hidden" : "block"}`}
            >
              {item.title}
            </h4>
            <div className="mt-3 flex flex-1 flex-col gap-2 max-lg:hidden">
              {item.links.map((link: SidebarLink) => {
                const allowedRoutes = ["/settings", "/orgchart"];
                const isAdminOrUser =
                  userRole?.name === "ADMIN" || userRole?.name === "USER";
                const isAllowedRoute =
                  isAdminOrUser && allowedRoutes.includes(link.route);

                // Check if the permission exists in the role
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
                    <Link
                      href={link.route}
                      key={link.label}
                      className={`${
                        isActive
                          ? "primary-gradient text-light-900 rounded-lg"
                          : "text-dark300_light900"
                      } flex items-center justify-start gap-4 rounded-sm bg-transparent px-4 py-3 duration-100 hover:bg-[#F5F5F5] dark:hover:bg-[#131417]`}
                    >
                      <Image
                        src={link.imgURL}
                        alt={link.label}
                        width={18}
                        height={18}
                        className={`${isActive ? "" : "invert-colors"} h-[18px] w-[18px]`}
                      />
                      <p className={`${isToggleOpen ? "block" : "hidden"}`}>
                        {link.label}
                      </p>
                    </Link>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LeftSidebar;
