import { createClientServerComponent } from "@/utils/supabase/server";

export type RolePermissionKey =
  | "dashboard"
  | "kanban"
  | "time_tracker"
  | "interns"
  | "applicants"
  | "inhouse"
  | "clients"
  | "projects"
  | "settings"
  | "orgchart"
  | "resume";

/**
 * Ensures the caller is authenticated.
 * @returns The authenticated user object and a supabase instance.
 * @throws Error with message "Unauthorized" if missing.
 */
export async function requireUser() {
  const supabase = await createClientServerComponent();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }
  return { user, supabase };
}

/**
 * Ensures the caller has the required role permission.
 * Role permission corresponds to columns in the 'roles' table.
 */
export async function requireRole(permissionKey: RolePermissionKey) {
  const { user, supabase } = await requireUser();

  const { data: codevData, error: codevError } = await supabase
    .from("codev")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (codevError || !codevData?.role_id) {
    throw new Error("Forbidden");
  }

  // Admins bypass
  if (codevData.role_id === 1) {
    return { user, supabase, roleId: codevData.role_id };
  }

  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .select(permissionKey)
    .eq("id", codevData.role_id)
    .single();

  if (roleError || !roleData || !(roleData as any)[permissionKey]) {
    throw new Error("Forbidden");
  }

  return { user, supabase, roleId: codevData.role_id };
}

/**
 * Ensures the caller is a member of the specified project.
 */
export async function requireProjectMember(projectId: string) {
  const { user, supabase } = await requireUser();

  const { data: codevData } = await supabase
    .from("codev")
    .select("role_id")
    .eq("id", user.id)
    .single();

  // Admins bypass
  if (codevData?.role_id === 1) {
    return { user, supabase, roleId: codevData.role_id };
  }

  const { data: memberData, error: memberError } = await supabase
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("codev_id", user.id)
    .maybeSingle();

  if (memberError || !memberData) {
    throw new Error("Forbidden");
  }

  return { user, supabase, roleId: codevData?.role_id };
}

/**
 * Helper specifically for self-mutating actions.
 * Enforces that the caller is either mutating their own data, or has an optional fallback role (e.g., admin).
 */
export async function requireSelfOrRole(targetUserId: string, fallbackRoleKey?: RolePermissionKey) {
  const { user, supabase } = await requireUser();

  if (user.id === targetUserId) {
    return { user, supabase };
  }

  // If not self, verify fallback role if provided
  if (fallbackRoleKey) {
    const { data: codevData } = await supabase
      .from("codev")
      .select("role_id")
      .eq("id", user.id)
      .single();

    if (codevData?.role_id === 1) {
      return { user, supabase, roleId: codevData.role_id };
    }

    if (codevData?.role_id) {
      const { data: roleData } = await supabase
        .from("roles")
        .select(fallbackRoleKey)
        .eq("id", codevData.role_id)
        .single();

      if (roleData && (roleData as any)[fallbackRoleKey]) {
        return { user, supabase, roleId: codevData.role_id };
      }
    }
  }

  throw new Error("Forbidden");
}
