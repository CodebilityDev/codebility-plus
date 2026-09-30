import type { getCurrentCodev } from "@/lib/global/current-codev";

export function getSidebarRoleId(
  user: Awaited<ReturnType<typeof getCurrentCodev>>,
): number | null {
  if (!user) return null;

  // -1 is the restricted sidebar for suspended accounts.
  if (user.internal_status === "INACTIVE" || user.availability_status === false) {
    return -1;
  }

  return user.role_id ?? null;
}
