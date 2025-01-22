import pathsConfig from "@/config/paths.config";
import { Sidebar } from "@/types";

export const sidebarData: Sidebar[] = [
  {
    id: "1",
    title: "Menu",
    links: [
      {
        route: pathsConfig.app.home,
        imgURL: "/assets/svgs/icon-dashboard.svg",
        label: "Dashboard",
        permission: "dashboard",
      },
      {
        route: pathsConfig.app.tasks,
        imgURL: "/assets/svgs/icon-task.svg",
        label: "My Tasks",
        permission: "tasks",
      },
      {
        route: pathsConfig.app.kanban,
        imgURL: "/assets/svgs/icon-kanban.svg",
        label: "Kanban",
        permission: "kanban",
      },
      {
        route: pathsConfig.app.time_tracker,
        imgURL: "/assets/svgs/icon-time-tracker.svg",
        label: "Time Tracker",
        permission: "time_tracker",
      },
    ],
  },
  {
    id: "2",
    title: "Codevs",
    links: [
      {
        route: pathsConfig.app.interns,
        imgURL: "/assets/svgs/icon-interns.svg",
        label: "Interns",
        permission: "interns",
      },
      {
        route: pathsConfig.app.orgchart,
        imgURL: "/assets/svgs/icon-org-chart.svg",
        label: "Org Chart",
        permission: "orgchart",
      },
    ],
  },
  {
    id: "3",
    title: "Management",
    links: [
      {
        route: pathsConfig.app.applicants,
        imgURL: "/assets/svgs/icon-applicant.svg",
        label: "Applicants",
        permission: "applicants",
      },
      {
        route: pathsConfig.app.in_hose,
        imgURL: "/assets/svgs/icon-applicant2.svg",
        label: "In-House",
        permission: "in_house",
      },
      {
        route: pathsConfig.app.clients,
        imgURL: "/assets/svgs/icon-clients.svg",
        label: "Clients",
        permission: "clients",
      },
      {
        route: pathsConfig.app.projects,
        imgURL: "/assets/svgs/icon-projects.svg",
        label: "Projects",
        permission: "projects",
      },
      {
        route: pathsConfig.app.settings,
        imgURL: "/assets/svgs/icon-cog.svg",
        label: "Settings",
        permission: "settings",
      },
    ],
  },
];
