import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClientAnon } from "@/utils/supabase/anon";
import { getMonthRange, getWeekRange } from "@/utils/leaderboard-utils";

export type TimeFilter = "all" | "weekly" | "monthly";

export type TechnicalLeader = {
  codev_id: string;
  first_name: string;
  total_points: number;
  latest_update: string;
};

/**
 * All-time totals come from the codev_points ledger, NOT from the tasks table.
 *
 * codev_points is append-only: points are added when a task is approved and are
 * never removed. The tasks table is mutable, so recomputing all-time totals from
 * it silently drops every point whose originating task was later deleted,
 * un-archived, or had its skill_category cleared. Time-ranged views below still
 * derive from tasks, where the approval date is the whole point of the query.
 */
async function getAllTimeLeaders(
  supabase: SupabaseClient,
  category: string,
  limit: number,
): Promise<TechnicalLeader[] | null> {
  const { data, error } = await supabase
    .from("codev_points")
    .select(
      `
      codev_id,
      points,
      created_at,
      codev:codev_id!inner(first_name),
      skill_category:skill_category_id!inner(name)
    `,
    )
    .eq("skill_category.name", category)
    .not("codev.first_name", "is", null);

  if (error) {
    console.error("Error fetching all-time technical leaderboard:", error);
    return null;
  }

  // codev_points holds one row per (codev, skill category), but aggregate
  // defensively in case duplicate rows exist for a pair.
  const totals = new Map<string, TechnicalLeader>();

  for (const entry of (data ?? []) as any[]) {
    const userId = entry.codev_id;
    if (!userId) continue;

    const points = entry.points || 0;
    const existing = totals.get(userId);

    if (existing) {
      existing.total_points += points;
      if (entry.created_at && entry.created_at > existing.latest_update) {
        existing.latest_update = entry.created_at;
      }
    } else {
      totals.set(userId, {
        codev_id: userId,
        first_name: entry.codev?.first_name || "Unknown",
        total_points: points,
        latest_update: entry.created_at || new Date(0).toISOString(),
      });
    }
  }

  return Array.from(totals.values())
    .filter((leader) => leader.total_points > 0)
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, limit);
}

async function getRangedLeaders(
  supabase: SupabaseClient,
  category: string,
  timeFilter: Exclude<TimeFilter, "all">,
  limit: number,
): Promise<TechnicalLeader[] | null> {
  const { startDate, endDate } =
    timeFilter === "weekly" ? getWeekRange() : getMonthRange();

  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      points,
      approved_at,
      codev_id,
      sidekick_ids,
      codev:codev_id(first_name),
      skill_category:skill_category_id!inner(name)
    `,
    )
    .eq("skill_category.name", category)
    .eq("is_archive", true)
    .gte("approved_at", startDate.toISOString())
    .lte("approved_at", endDate.toISOString());

  if (error) {
    console.error(
      `Error fetching ${timeFilter} technical leaderboard tasks:`,
      error,
    );
    return null;
  }

  const totals = new Map<
    string,
    { total_points: number; latest_update: string; first_name?: string }
  >();
  const involvedUserIds = new Set<string>();

  const addPoints = (
    userId: string,
    points: number,
    approvedAt: string | null,
    firstName?: string,
  ) => {
    involvedUserIds.add(userId);
    const existing = totals.get(userId);

    if (existing) {
      existing.total_points += points;
      if (approvedAt && approvedAt > existing.latest_update) {
        existing.latest_update = approvedAt;
      }
    } else {
      totals.set(userId, {
        total_points: points,
        latest_update: approvedAt || new Date(0).toISOString(),
        first_name: firstName,
      });
    }
  };

  for (const task of (data ?? []) as any[]) {
    const points = task.points || 0;
    const sidekickPoints = Math.floor(points * 0.5);

    if (task.codev_id) {
      addPoints(task.codev_id, points, task.approved_at, task.codev?.first_name);
    }

    if (Array.isArray(task.sidekick_ids)) {
      for (const sidekickId of task.sidekick_ids) {
        addPoints(sidekickId, sidekickPoints, task.approved_at);
      }
    }
  }

  // Sidekicks come through without a joined name; fill those in.
  const missingNameIds = Array.from(involvedUserIds).filter(
    (id) => !totals.get(id)?.first_name,
  );

  if (missingNameIds.length > 0) {
    const { data: namesData } = await supabase
      .from("codev")
      .select("id, first_name")
      .in("id", missingNameIds);

    for (const row of namesData ?? []) {
      const entry = totals.get(row.id);
      if (entry) entry.first_name = row.first_name;
    }
  }

  return Array.from(totals.entries())
    .map(([id, entry]) => ({
      codev_id: id,
      first_name: entry.first_name || "Unknown",
      total_points: entry.total_points,
      latest_update: entry.latest_update,
    }))
    .filter((leader) => leader.total_points > 0)
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, limit);
}

/** Returns null when the underlying query fails. */
export async function getTechnicalLeaderboard(
  supabase: SupabaseClient,
  {
    category,
    timeFilter,
    limit,
  }: { category: string; timeFilter: TimeFilter; limit: number },
): Promise<TechnicalLeader[] | null> {
  return timeFilter === "all"
    ? getAllTimeLeaders(supabase, category, limit)
    : getRangedLeaders(supabase, category, timeFilter, limit);
}

/**
 * The default dashboard view. codev_points is public-read and the board is the
 * same for every viewer, so this one is safe to cache globally — unlike the
 * weekly/monthly views, which read the project-scoped tasks table.
 */
export const getCachedAllTimeTechnicalLeaderboard = unstable_cache(
  async (category: string, limit: number) =>
    getAllTimeLeaders(createClientAnon(), category, limit),
  ["technical-leaderboard-all-time"],
  { revalidate: 300, tags: ["technical-leaderboard"] },
);
