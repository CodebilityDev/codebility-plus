// Helper function to get badge prefix from skill category name
import type { CurrentUserProfile } from "@/types/global/current-user";

export function getBadgePrefix(name: string): string {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("frontend")) return "fe";
  if (lowerName.includes("backend")) return "be";
  if (lowerName.includes("mobile")) return "md";
  if (lowerName.includes("ui") || lowerName.includes("ux")) return "uiux";
  return name.substring(0, 2).toLowerCase();
}

export function getSidebarRoleId(
  user: CurrentUserProfile | null,
): number | null {
  if (!user) return null;

  if (user.internal_status === "INACTIVE" || user.availability_status === false) {
    return -1;
  }

  return user.role_id ?? null;
}
