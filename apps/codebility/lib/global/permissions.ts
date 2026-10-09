import { cache } from "react";
import { getCurrentCodev } from "@/lib/global/current-codev";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import { getSidebarRoleId } from "@/utils/global/codev";
import { PERMISSION_COLUMNS, PERMISSION_KEYS, isFullAccess, normalizeProjectRole } from "@/constants/global/permissions";
import type { PermissionKey, ProjectAccess, ProjectRole, RolePermissions } from "@/types/global/permissions";

export const NO_PERMISSIONS: RolePermissions = PERMISSION_KEYS.reduce(
  (acc, key) => {
    acc[key] = false;
    return acc;
  },
  {} as RolePermissions,
);

export const getAccess = cache(
  async (): Promise<{
    roleId: number | null;
    hasFullAccess: boolean;
    permissions: RolePermissions;
  }> => {
    const codev = await getCurrentCodev();
    const sidebarRoleId = getSidebarRoleId(codev);
    const roleId = sidebarRoleId === null || sidebarRoleId === -1 ? null : sidebarRoleId;

    if (roleId === null) {
      return { roleId: null, hasFullAccess: false, permissions: NO_PERMISSIONS };
    }

    const supabase = await createClientServerComponent();

    const { data } = await supabase
      .from("roles")
      .select(PERMISSION_COLUMNS)
      .eq("id", roleId)
      .single();

    if (!data) {
      return { roleId: null, hasFullAccess: false, permissions: NO_PERMISSIONS };
    }

    return {
      roleId,
      hasFullAccess: isFullAccess(roleId),
      permissions: PERMISSION_KEYS.reduce(
        (acc, key) => {
          acc[key] = Boolean(data[key]);
          return acc;
        },
        {} as RolePermissions,
      ),
    };
  },
);

export async function getPermissions(): Promise<RolePermissions> {
  return (await getAccess()).permissions;
}

export async function requirePermission(permission: PermissionKey): Promise<void> {
  const permissions = await getPermissions();
  if (!permissions[permission]) {
    throw new Error(`Forbidden: missing permission "${permission}"`);
  }
}

export async function requireFullAccess(): Promise<void> {
  const { hasFullAccess } = await getAccess();
  if (!hasFullAccess) {
    throw new Error("Forbidden: full access required");
  }
}

export const getProjectAccess = cache(
  async (projectId: string): Promise<ProjectAccess> => {
    const codev = await getCurrentCodev();

    if (!codev) {
      return { isMember: false, role: null, isTeamLeader: false };
    }

    const supabase = await createClientServerComponent();

    const { data } = await supabase
      .from("project_members")
      .select("role")
      .eq("project_id", projectId)
      .eq("codev_id", codev.id)
      .maybeSingle();

    if (!data) {
      return { isMember: false, role: null, isTeamLeader: false };
    }

    const role = normalizeProjectRole(data.role);
    return {
      isMember: true,
      role,
      isTeamLeader: role === "team_leader",
    };
  },
);

export async function requireProjectAccess(
  projectId: string,
  requiredRole?: ProjectRole,
): Promise<void> {
  const access = await getProjectAccess(projectId);

  if (!access.isMember) {
    throw new Error("Forbidden: not a member of this project");
  }

  if (requiredRole === "team_leader" && !access.isTeamLeader) {
    throw new Error("Forbidden: team leader role required");
  }
}

export async function resolveProjectIds(entities: {
  taskIds?: string[];
  columnIds?: string[];
  sprintId?: string;
}): Promise<string[]> {
  const supabase = await createClientServerComponent();
  const projectIds = new Set<string>();

  if (entities.taskIds?.length) {
    const { data: columns } = await supabase
      .from("tasks")
      .select("kanban_column_id")
      .in("id", entities.taskIds);

    if (columns?.length) {
      const columnIds = [...new Set(columns.map((c) => c.kanban_column_id).filter(Boolean))];

      const { data: boards } = await supabase
        .from("kanban_columns")
        .select("board_id")
        .in("id", columnIds);

      if (boards?.length) {
        const boardIds = [...new Set(boards.map((b) => b.board_id).filter(Boolean))];

        const { data: projects } = await supabase
          .from("kanban_boards")
          .select("project_id")
          .in("id", boardIds);

        projects?.forEach((p) => p.project_id && projectIds.add(p.project_id));
      }
    }
  }

  if (entities.columnIds?.length) {
    const { data: boards } = await supabase
      .from("kanban_columns")
      .select("board_id")
      .in("id", entities.columnIds);

    if (boards?.length) {
      const boardIds = [...new Set(boards.map((b) => b.board_id).filter(Boolean))];

      const { data: projects } = await supabase
        .from("kanban_boards")
        .select("project_id")
        .in("id", boardIds);

      projects?.forEach((p) => p.project_id && projectIds.add(p.project_id));
    }
  }

  if (entities.sprintId) {
    const { data: sprint } = await supabase
      .from("kanban_sprints")
      .select("project_id")
      .eq("id", entities.sprintId)
      .single();

    if (sprint?.project_id) {
      projectIds.add(sprint.project_id);
    }
  }

  return [...projectIds];
}

export async function requireProjectAccessForEntities(
  entities: { taskIds?: string[]; columnIds?: string[]; sprintId?: string },
  requiredRole?: ProjectRole,
): Promise<void> {
  const projectIds = await resolveProjectIds(entities);

  for (const projectId of projectIds) {
    await requireProjectAccess(projectId, requiredRole);
  }
}

export const getAccessibleProjectIds = cache(async (): Promise<string[] | null> => {
  const { hasFullAccess } = await getAccess();

  if (hasFullAccess) {
    return null;
  }

  const codev = await getCurrentCodev();

  if (!codev) {
    return [];
  }

  const supabase = await createClientServerComponent();

  const { data } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("codev_id", codev.id);

  if (!data) {
    return [];
  }

  const projectIds = data
    .map((row) => row.project_id)
    .filter((projectId): projectId is string => projectId !== null);

  return [...new Set(projectIds)];
});