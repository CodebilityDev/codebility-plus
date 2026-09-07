import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface CodevPointsResponse {
  skillPoints: Array<Record<string, unknown>>;
  attendancePoints: number;
  totalSkillPoints: number;
  totalPoints: number;
}

export const codevPointsKey = (codevId?: string) => ["codevPoints", codevId];

async function fetchCodevPoints(
  codevId: string,
): Promise<CodevPointsResponse> {
  const response = await fetch(`/api/codev/${codevId}/points`);

  if (!response.ok) {
    throw new Error(`Failed to fetch codev points (${response.status})`);
  }

  return response.json();
}

/**
 * Shared query for /api/codev/[codevId]/points, keyed per codev.
 *
 * The team views fetch this for every member in a list and again when a member
 * detail modal opens, so keying per codev lets the second read hit the cache
 * instead of repeating a request that also writes an attendance_points row.
 */
export function useCodevPoints(codevId?: string) {
  return useQuery({
    queryKey: codevPointsKey(codevId),
    queryFn: () => {
      if (!codevId) {
        throw new Error("useCodevPoints requires a codevId");
      }
      return fetchCodevPoints(codevId);
    },
    enabled: Boolean(codevId),
  });
}

export function useInvalidateCodevPoints() {
  const queryClient = useQueryClient();

  return (codevId?: string) =>
    queryClient.invalidateQueries({ queryKey: codevPointsKey(codevId) });
}
