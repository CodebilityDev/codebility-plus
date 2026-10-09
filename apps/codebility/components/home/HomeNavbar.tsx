import { getCurrentCodev } from "@/lib/global/current-codev";
import { getCachedSidebarData } from "@/lib/home/sidebar-cached";

import Navbar from "@/components/home/Navbar";

export default async function HomeNavbar() {
  const currentUser = await getCurrentCodev();
  const sidebarData = await getCachedSidebarData();

  return <Navbar currentUser={currentUser} sidebarData={sidebarData} />;
}
