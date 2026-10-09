"use server";

import { getPermissions } from "@/lib/global/permissions";
import type { RolePermissions } from "@/types/global/permissions";

export async function getPermissionsAction(): Promise<RolePermissions> {
  return getPermissions();
}