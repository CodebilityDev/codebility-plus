"use server";

import pathsConfig from "@/config/paths.config";
import { createClientServerComponent } from "@/utils/supabase/server";



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

type RolePermissions = {
  dashboard: boolean;
  kanban: boolean;
  time_tracker: boolean;
  interns: boolean;
  applicants: boolean;
  inhouse: boolean;
  clients: boolean;
  projects: boolean;
  settings: boolean;
  orgchart: boolean;
};

type PermissionKey = keyof RolePermissions;

export const getSidebarData = async (
  roleId: number | null,
): Promise<Sidebar[]> => {
  if (!roleId) {
    return [];
  }

  /* const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);
 */
  const supabase = await createClientServerComponent();

  // Fetch role permissions
  const { data: rolePermissions, error } = await supabase
    .from("roles")
    .select(
      `
      dashboard,
      kanban,
      time_tracker,
      interns,
      applicants,
      inhouse,
      clients,
      projects,
      settings,
      orgchart
    `,
    )
    .eq("id", roleId)
    .single();

  if (error || !rolePermissions) {
    console.error("Failed to fetch role permissions:", error);
    return [];
  }

  const hasPermission = (permission: PermissionKey): boolean => {
    return !!rolePermissions[permission];
  };

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
        {
          route: pathsConfig.app.tasks,
          imgURL: "/assets/svgs/icon-task.svg",
          label: "My Tasks",
          permission: "time_tracker" as PermissionKey,
        },
        {
          route: pathsConfig.app.kanban,
          imgURL: "/assets/svgs/icon-kanban.svg",
          label: "Kanban",
          permission: "kanban" as PermissionKey,
        },
        {
          route: pathsConfig.app.time_tracker,
          imgURL: "/assets/svgs/icon-time-tracker.svg",
          label: "Time Tracker",
          permission: "time_tracker" as PermissionKey,
        },
      ].filter((link) => hasPermission(link.permission)),
    },
    {
      id: "2",
      title: "Codevs",
      links: [
        {
          route: pathsConfig.app.interns,
          imgURL: "/assets/svgs/icon-interns.svg",
          label: "Codevs",
          permission: "interns" as PermissionKey,
        },
        {
          route: pathsConfig.app.my_team,
          imgURL: "/assets/svgs/icon-my-team-white.svg", // Replace with your icon path
          label: "My Team",
          permission: "interns" as PermissionKey, // Using "interns" permission for now
        },
        {
          route: pathsConfig.app.orgchart,
          imgURL: "/assets/svgs/icon-org-chart.svg",
          label: "Org Chart",
          permission: "orgchart" as PermissionKey,
        },
      ].filter((link) => hasPermission(link.permission)),
    },
    {
      id: "3",
      title: "Management",
      links: [
        {
          route: pathsConfig.app.admin_dashboard,
          imgURL: "/assets/svgs/icon-admin-dashboard.svg",
          label: "Dashboard",
          permission: "applicants" as PermissionKey,
        },
        {
          route: pathsConfig.app.applicants,
          imgURL: "/assets/svgs/icon-applicant.svg",
          label: "Applicants",
          permission: "applicants" as PermissionKey,
        },
        {
          route: pathsConfig.app.in_hose,
          imgURL: "/assets/svgs/icon-applicant2.svg",
          label: "In-House",
          permission: "inhouse" as PermissionKey,
        },
        {
          route: pathsConfig.app.clients,
          imgURL: "/assets/svgs/icon-clients.svg",
          label: "Clients",
          permission: "clients" as PermissionKey,
        },
        {
          route: pathsConfig.app.projects,
          imgURL: "/assets/svgs/icon-projects.svg",
          label: "Projects",
          permission: "projects" as PermissionKey,
        },
        {
          route: pathsConfig.app.settings,
          imgURL: "/assets/svgs/icon-cog.svg",
          label: "Settings",
          permission: "settings" as PermissionKey,
        },
      ].filter((link) => hasPermission(link.permission)),
    },
  ];

  return sidebarData;
};
