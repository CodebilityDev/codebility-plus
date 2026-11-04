import { getCurrentCodev } from "@/lib/global/current-codev";
import { readHomeAccess } from "@/lib/home/proxy-access";
import { getCachedSidebarData } from "@/lib/home/sidebar-cached";

import Navbar from "@/components/home/Navbar";

export default async function HomeNavbar() {
  const access = await readHomeAccess();
  const currentUser = await getCurrentCodev();
  const sidebarData = await getCachedSidebarData(access);

  return <Navbar currentUser={currentUser} sidebarData={sidebarData} />;
}
