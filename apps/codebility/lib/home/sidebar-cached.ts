import { cache } from "react";

import { getSidebarData } from "@/actions/home/sidebar";
import type { ProxyAccess } from "@/types/global/permissions";

export const getCachedSidebarData = cache((access?: ProxyAccess) =>
  getSidebarData(access),
);
