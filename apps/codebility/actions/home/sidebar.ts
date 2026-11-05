"use server";

import pathsConfig from "@/constants/global/paths";
import { requiresFullAccess } from "@/constants/global/permissions";
import { getAccess } from "@/lib/global/permissions";
import { logPerf } from "@/lib/global/timing";
import type { Sidebar } from "@/types/home/home";
import type { PermissionKey, ProxyAccess } from "@/types/global/permissions";


export const getSidebarData = async (access?: ProxyAccess): Promise<Sidebar[]> => {
  const startedAt = performance.now();
  const { permissions, hasFullAccess } = access ?? (await getAccess());

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

  logPerf(access ? "sidebar.header" : "sidebar.query", startedAt);
  return sidebarData;
};
