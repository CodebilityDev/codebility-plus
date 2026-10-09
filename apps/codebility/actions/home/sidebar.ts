"use server";

import pathsConfig from "@/constants/global/paths";
import { requiresFullAccess } from "@/constants/global/permissions";
import { getAccess } from "@/lib/global/permissions";
import type { Sidebar } from "@/types/home/home";
import type { PermissionKey } from "@/types/global/permissions";


export const getSidebarData = async (): Promise<Sidebar[]> => {
  const { permissions, hasFullAccess } = await getAccess();

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
        {
          route: pathsConfig.app.kanban,
          imgURL: "/assets/svgs/icon-kanban.svg",
          label: "Kanban",
          permission: "kanban" as PermissionKey,
        },
        {
          route: pathsConfig.app.projects,
          imgURL: "/assets/svgs/icon-kanban.svg",
          label: "Projects",
          permission: "projects" as PermissionKey,
        },
      ],
    },
  ]
    .map((section) => ({
      ...section,
      links: section.links.filter((link) =>
        requiresFullAccess(link.route) ? hasFullAccess : permissions[link.permission],
      ),
    }))
    .filter((section) => section.links.length > 0);

  return sidebarData;
};
