import { getSidebarData } from "@/actions/home/sidebar";
import { getCurrentCodev } from "@/lib/home/current-codev";

import LeftSidebarClient from "@/components/home/LeftSidebarClient";
import { getSidebarRoleId } from "@/utils/home/home";


export default async function LeftSidebarServer() {
  const user = await getCurrentCodev();
  const sidebarData = await getSidebarData(getSidebarRoleId(user));

  return <LeftSidebarClient initialSidebarData={sidebarData} />;
}
