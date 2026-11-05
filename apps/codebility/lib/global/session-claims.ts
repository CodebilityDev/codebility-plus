import { PERMISSION_KEYS } from "@/constants/global/permissions";
import type { RolePermissions } from "@/types/global/permissions";

export const PERMISSION_CLAIM_VERSION = 1;

export interface CustomClaims {
  mask: number | null;
  version: number | null;
  status: string | null;
  roleId: number | null;
  hasMfa: boolean;
}

export function readCustomClaims(
  claims: Record<string, unknown>,
): CustomClaims {
  const toNumber = (value: unknown): number | null =>
    typeof value === "number" && Number.isFinite(value) ? value : null;

  return {
    mask: toNumber(claims.pm),
    version: toNumber(claims.pv),
    status: typeof claims.st === "string" ? claims.st : null,
    roleId: toNumber(claims.rid),
    hasMfa: claims.mfa === true,
  };
}

export function decodePermissionMask(mask: number): RolePermissions {
  const permissions = {} as RolePermissions;

  PERMISSION_KEYS.forEach((key, index) => {
    permissions[key] = (mask & (1 << index)) !== 0;
  });

  return permissions;
}
