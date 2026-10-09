import { getCachedSidebarData } from "@/lib/home/sidebar-cached";

import LeftSidebarClient from "@/components/home/LeftSidebarClient";

export default async function HomeSidebar() {
  const sidebarData = await getCachedSidebarData();

  return <LeftSidebarClient sidebarData={sidebarData} />;
}
