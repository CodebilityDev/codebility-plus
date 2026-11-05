import { cacheLife, cacheTag } from "next/cache";

import {
  PERMISSION_COLUMNS,
  PERMISSION_KEYS,
} from "@/constants/global/permissions";
import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { createClientAnon } from "@/lib/global/supabase-anon";
import type { RolePermissions } from "@/types/global/permissions";

export interface RolePermissionsRecord {
  roleName: string | null;
  permissions: RolePermissions;
}

export async function getRolePermissions(
  roleId: number,
): Promise<RolePermissionsRecord | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.roles);

  const { data } = await createClientAnon()
    .from("roles")
    .select(PERMISSION_COLUMNS + ", name")
    .eq("id", roleId)
    .single();

  if (!data) {
    return null;
  }

  const roleRecord = data as unknown as Record<string, unknown>;

  return {
    roleName: (roleRecord.name as string | null) ?? null,
    permissions: PERMISSION_KEYS.reduce(
      (acc, key) => {
        acc[key] = Boolean(roleRecord[key]);
        return acc;
      },
      {} as RolePermissions,
    ),
  };
}
