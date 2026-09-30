"use server";

import pathsConfig from "@/constants/global/paths";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import type { Sidebar, RolePermissions, PermissionKey } from "@/types/home/home";


const NO_PERMISSIONS: RolePermissions = { dashboard: false, applicants: false };
const INACTIVE_PERMISSIONS: RolePermissions = { dashboard: true, applicants: false };

export const getSidebarData = async (
  roleId: number | null,
): Promise<Sidebar[]> => {
  if (!roleId) {
    return [];
  }

  let rolePermissions: RolePermissions;
  if (roleId == -1) {
    rolePermissions = INACTIVE_PERMISSIONS;
  } else {
    const supabase = await createClientServerComponent();
    const { data, error } = await supabase
      .from("roles")
      .select("dashboard, applicants")
      .eq("id", roleId)
      .single();

    if (error || !data) {
      console.error("Failed to fetch role permissions:", error);
    }
    rolePermissions = {
      dashboard: data?.dashboard ?? false,
      applicants: data?.applicants ?? false,
    };
  }

  const sidebarData: Sidebar[] = [
    {
      id: "1",
      title: "Menu",
      links: [
        {
          route: pathsConfig.app.home,
          imgURL: "/assets/svgs/icon-dashboard.svg",
          label: "Home",
          permission: "dashboard" as PermissionKey,
        },
      ],
    },
    {
      id: "2",
      title: "Management",
      links: [
        {
          route: pathsConfig.app.applicants,
          imgURL: "/assets/svgs/icon-applicant.svg",
          label: "Applicants",
          permission: "applicants" as PermissionKey,
        },
      ],
    },
  ]
    .map((section) => ({
      ...section,
      links: section.links.filter((link) => rolePermissions[link.permission]),
    }))
    .filter((section) => section.links.length > 0);

  return sidebarData;
};