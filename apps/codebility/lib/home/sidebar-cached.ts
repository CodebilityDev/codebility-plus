import { cache } from "react";

import { getSidebarData } from "@/actions/home/sidebar";

export const getCachedSidebarData = cache(getSidebarData);
