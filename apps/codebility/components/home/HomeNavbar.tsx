import { getCurrentCodev } from "@/lib/global/current-codev";
import { getSidebarRoleId } from "@/utils/home/home";
import { getCachedSidebarData } from "@/lib/home/sidebar-cached";

import Navbar from "@/components/home/Navbar";

export default async function HomeNavbar() {
  const currentUser = await getCurrentCodev();
  const sidebarData = await getCachedSidebarData(
    getSidebarRoleId(currentUser),
  );

  return <Navbar currentUser={currentUser} sidebarData={sidebarData} />;
}
