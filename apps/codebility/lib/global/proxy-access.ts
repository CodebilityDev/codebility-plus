import { PERMISSION_KEYS } from "@/constants/global/permissions";
import type { ProxyAccess, RolePermissions } from "@/types/global/permissions";

export const PROXY_ACCESS_HEADER = "x-codev-access";

export function encodeProxyAccess(access: ProxyAccess): string {
  return btoa(JSON.stringify(access));
}

export function decodeProxyAccess(
  value: string | null,
): ProxyAccess | undefined {
  if (!value) return undefined;

  try {
    const parsed = JSON.parse(atob(value)) as Partial<ProxyAccess>;
    const permissions = {} as RolePermissions;

    for (const key of PERMISSION_KEYS) {
      permissions[key] = Boolean(parsed.permissions?.[key]);
    }

    return { permissions, hasFullAccess: Boolean(parsed.hasFullAccess) };
  } catch {
    return undefined;
  }
}
