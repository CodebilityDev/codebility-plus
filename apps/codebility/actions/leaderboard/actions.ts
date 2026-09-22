"use server";

import { revalidateTag } from "next/cache";

/**
 * Drops the cached all-time technical leaderboard.
 *
 * The board is served from `unstable_cache` so a page load does not repeat the
 * whole codev_points aggregation. Without this, a realtime points change would
 * update the open tab but the next server render would still paint the stale
 * cached board, so postgres realtime is what invalidates the cache too.
 */
export async function revalidateTechnicalLeaderboard() {
  revalidateTag("technical-leaderboard");
}
