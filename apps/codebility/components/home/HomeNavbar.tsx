import { getCurrentCodev } from "@/lib/global/current-codev";
import { getCachedSidebarData } from "@/lib/home/sidebar-cached";

import Navbar from "@/components/home/Navbar";
import type { ProxyAccess } from "@/types/global/permissions";

export default async function HomeNavbar({ access }: { access?: ProxyAccess }) {
  const currentUser = await getCurrentCodev();
  const sidebarData = await getCachedSidebarData(access);

  return <Navbar currentUser={currentUser} sidebarData={sidebarData} />;
}
