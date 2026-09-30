"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentCodevAction } from "@/actions/global/current-user";

/**
 * The signed-in user. Kept out of the cache: sign-out is a soft navigation, so
 * a retained entry could be served to the next session. A fresh read on mount
 * costs one server action and avoids rendering the previous user.
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => getCurrentCodevAction(),
    staleTime: 0,
    gcTime: 0,
  });
}
