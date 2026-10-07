import { getCurrentCodev } from "@/lib/global/current-codev";
import { getSidebarRoleId } from "@/utils/home/home";
import { getCachedSidebarData } from "@/lib/home/sidebar-cached";

import LeftSidebarClient from "@/components/home/LeftSidebarClient";

export default async function HomeSidebar() {
  const currentUser = await getCurrentCodev();
  const sidebarData = await getCachedSidebarData(
    getSidebarRoleId(currentUser),
  );

  return <LeftSidebarClient sidebarData={sidebarData} />;
}
