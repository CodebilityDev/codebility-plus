import { getSidebarData } from "@/constants/sidebar";
import { getCurrentCodev } from "@/lib/server/current-codev";

import LeftSidebarClient from "./LeftSidebarClient";

function getSidebarRoleId(
  user: Awaited<ReturnType<typeof getCurrentCodev>>,
): number | null {
  if (!user) return null;

  // -1 is the restricted sidebar for suspended accounts.
  if (user.internal_status === "INACTIVE" || user.availability_status === false) {
    return -1;
  }

  return user.role_id ?? null;
}

export default async function LeftSidebarServer() {
  const user = await getCurrentCodev();
  const sidebarData = await getSidebarData(getSidebarRoleId(user));

  return <LeftSidebarClient initialSidebarData={sidebarData} />;
}
