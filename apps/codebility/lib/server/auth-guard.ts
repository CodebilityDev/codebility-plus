import { cache } from "react";

import { createClientServerComponent } from "@/utils/supabase/server";
import { getCurrentCodev } from "./current-codev";

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
 * @returns The authenticated user and a supabase instance bound to their cookies.
 * @throws Error with message "Unauthorized" if missing.
 *
 * Resolves through `getCurrentCodev`, which is React `cache()`d, so the
 * `auth.getUser()` round-trip and the `codev` row read happen once per request
 * no matter how many guarded functions this request calls. Previously each call
 * issued its own `auth.getUser()`; a request that guarded twice paid twice.
 *
 * The returned `supabase` still carries the caller's cookies, so RLS remains the
 * enforcement layer. This function only decides "is anyone signed in".
 */
export const requireUser = cache(async () => {
  const supabase = await createClientServerComponent();
  const currentUser = await getCurrentCodev();

  if (!currentUser) {
    throw new Error("Unauthorized");
  }

  // Shaped like the previous return so existing destructuring keeps working.
  // `id` and `role_id` are the only auth fields any caller reads.
  return {
    user: { id: currentUser.id, email: currentUser.email_address },
    currentUser,
    supabase,
    roleId: currentUser.role_id ?? null,
  };
});

/**
 * Ensures the caller has the required role permission.
 * Role permission corresponds to columns in the 'roles' table.
 */
export async function requireRole(permissionKey: RolePermissionKey) {
  const { user, supabase, roleId } = await requireUser();

  if (!roleId) {
    throw new Error("Forbidden");
  }

  // Admins bypass
  if (roleId === 1) {
    return { user, supabase, roleId };
  }

  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .select(permissionKey)
    .eq("id", roleId)
    .single();

  if (roleError || !roleData || !(roleData as any)[permissionKey]) {
    throw new Error("Forbidden");
  }

  return { user, supabase, roleId };
}

/**
 * Ensures the caller is a member of the specified project.
 */
export async function requireProjectMember(projectId: string) {
  const { user, supabase, roleId } = await requireUser();

  // Admins bypass
  if (roleId === 1) {
    return { user, supabase, roleId };
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

  return { user, supabase, roleId };
}

/**
 * Helper specifically for self-mutating actions.
 * Enforces that the caller is either mutating their own data, or has an optional fallback role (e.g., admin).
 */
export async function requireSelfOrRole(targetUserId: string, fallbackRoleKey?: RolePermissionKey) {
  const { user, supabase, roleId } = await requireUser();

  if (user.id === targetUserId) {
    return { user, supabase };
  }

  // If not self, verify fallback role if provided
  if (fallbackRoleKey) {
    if (roleId === 1) {
      return { user, supabase, roleId };
    }

    if (roleId) {
      const { data: roleData } = await supabase
        .from("roles")
        .select(fallbackRoleKey)
        .eq("id", roleId)
        .single();

      if (roleData && (roleData as any)[fallbackRoleKey]) {
        return { user, supabase, roleId };
      }
    }
  }

  throw new Error("Forbidden");
}
