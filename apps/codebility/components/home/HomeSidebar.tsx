import { getCachedSidebarData } from "@/lib/home/sidebar-cached";

import LeftSidebarClient from "@/components/home/LeftSidebarClient";
import type { ProxyAccess } from "@/types/global/permissions";

export default async function HomeSidebar({ access }: { access?: ProxyAccess }) {
  const sidebarData = await getCachedSidebarData(access);

  return <LeftSidebarClient sidebarData={sidebarData} />;
}
