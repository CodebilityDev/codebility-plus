import { getSidebarData, type Sidebar } from "@/constants/sidebar";
import { getCurrentCodev } from "@/lib/server/current-codev";

import LeftSidebarClient from "./LeftSidebarClient";

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

/**
 * `sidebarData` is computed once in the /home layout and passed in. This used to
 * call `getSidebarData` itself, which is not request-deduped, so every render
 * issued a second identical `roles` query alongside the layout's.
 */
export default async function LeftSidebarServer({
  sidebarData,
}: {
  sidebarData?: Sidebar[];
}) {
  if (sidebarData) return <LeftSidebarClient initialSidebarData={sidebarData} />;

  const user = await getCurrentCodev();
  const resolved = await getSidebarData(getSidebarRoleId(user));

  return <LeftSidebarClient initialSidebarData={resolved} />;
}
