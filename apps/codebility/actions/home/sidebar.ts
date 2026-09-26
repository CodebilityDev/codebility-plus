"use server";

import pathsConfig from "@/constants/global/paths";
import { createClientServerComponent } from "@/lib/global/supabase-server";

export type SidebarLink = {
  route: string;
  imgURL: string;
  label: string;
  permission: PermissionKey;
};

export type Sidebar = {
  id: string;
  title: string;
  links: SidebarLink[];
};

// Each key is a boolean column on the `roles` table. Add a key here, in the
// select below, and in middleware.ts when a new private page gets a permission.
type RolePermissions = {
  dashboard: boolean;
  applicants: boolean;
};

type PermissionKey = keyof RolePermissions;

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
    rolePermissions = (data as RolePermissions | null) ?? NO_PERMISSIONS;
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
