"use client";

import { useQuery } from "@tanstack/react-query";
import { getSidebarData } from "@/actions/home/sidebar";
import { useCurrentUser } from "@/hooks/global/use-current-user";
import { getSidebarRoleId } from "@/utils/home/home";

export function useSidebarData() {
  const { data: user } = useCurrentUser();
  const roleId = getSidebarRoleId(user ?? null);

  return useQuery({
    queryKey: ["sidebar", roleId],
    queryFn: () => getSidebarData(roleId),
    enabled: roleId !== null,
  });
}
