import type { PERMISSION_KEYS } from "@/constants/global/permissions";

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export type RolePermissions = Record<PermissionKey, boolean>;

export type ProjectRole = "team_leader" | "member";

export interface ProjectAccess {
  isMember: boolean;
  role: ProjectRole | null;
  isTeamLeader: boolean;
}