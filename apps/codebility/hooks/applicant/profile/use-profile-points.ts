import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProfilePointsResponse } from "@/types/applicant/profile/profile";

export const profilePointsKey = (codevId?: string) => [
  "profilePoints",
  codevId,
];

async function fetchProfilePoints(
  codevId: string,
): Promise<ProfilePointsResponse> {
  const response = await fetch(`/api/profile-points/${codevId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch profile points (${response.status})`);
  }

  return response.json() as Promise<ProfilePointsResponse>;
}

/**
 * Shared query for /api/profile-points/[codevId].
 *
 * Several components render together and need the same payload — four on the
 * dashboard, eight on the profile settings page. Going through one query key
 * means they share a single request instead of each issuing its own, which
 * matters more than usual here because that endpoint recomputes and persists
 * profile points on every call.
 */
export function useProfilePoints(codevId?: string) {
  return useQuery({
    queryKey: profilePointsKey(codevId),
    queryFn: () => {
      if (!codevId) {
        throw new Error("useProfilePoints requires a codevId");
      }
      return fetchProfilePoints(codevId);
    },
    enabled: Boolean(codevId),
  });
}

/**
 * Call after a mutation that changes profile completeness so every component
 * reading this query re-renders with fresh points.
 */
export function useInvalidateProfilePoints() {
  const queryClient = useQueryClient();

  return (codevId?: string) =>
    queryClient.invalidateQueries({ queryKey: profilePointsKey(codevId) });
}
