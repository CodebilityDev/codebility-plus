import { readHomeAccess } from "@/lib/home/proxy-access";
import { getCachedSidebarData } from "@/lib/home/sidebar-cached";

import LeftSidebarClient from "@/components/home/LeftSidebarClient";

export default async function HomeSidebar() {
  const access = await readHomeAccess();
  const sidebarData = await getCachedSidebarData(access);

  return <LeftSidebarClient sidebarData={sidebarData} />;
}
