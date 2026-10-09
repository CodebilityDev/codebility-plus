import type { PermissionKey, ProjectRole } from "@/types/global/permissions";

export const PERMISSION_KEYS = [
  "dashboard",
  "kanban",
  "time_tracker",
  "interns",
  "applicants",
  "inhouse",
  "clients",
  "projects",
  "resume",
  "settings",
  "orgchart",
  "overflow",
] as const;

export const PERMISSION_COLUMNS = PERMISSION_KEYS.join(", ");

export const ROUTE_PERMISSION_MAP: Record<string, PermissionKey> = {
  "/home/applicants": "applicants",
  "/home/kanban": "kanban",
  "/home/projects": "projects",
};

export const FULL_ACCESS_ROUTES = ["/home/applicants"] as const;

export function requiresFullAccess(pathname: string): boolean {
  return FULL_ACCESS_ROUTES.some((route) => pathname.startsWith(route));
}

export const FULL_ACCESS_ROLE_IDS = [1] as const;

export function isFullAccess(roleId: number | null | undefined): boolean {
  return typeof roleId === "number" && (FULL_ACCESS_ROLE_IDS as readonly number[]).includes(roleId);
}

export const PROJECT_ROLES = ["team_leader", "member"] as const;

export function normalizeProjectRole(role: string | null): ProjectRole {
  return role === "team_leader" ? "team_leader" : "member";
}