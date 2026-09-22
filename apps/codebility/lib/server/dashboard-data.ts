import { cache } from "react";
import type { Codev } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";
import { getCurrentCodev } from "./current-codev";
import {
  getCachedLevels,
  getCachedSkillCategories,
  type LevelRow,
  type SkillCategoryRow,
} from "./dashboard-reference-cached";
import {
  computeProfilePoints,
  type ProfileCompletionDetail,
} from "./profile-points";

/**
 * Everything /home renders, fetched once per request on the server.
 *
 * Before this existed each dashboard card ran its own client-side chain, which
 * meant three duplicate `/api/profile-points` round-trips (each of which
 * rewrites the profile_points table), two `skill_category` reads and a second
 * `auth.getUser()` on top of the store hydrate. All of it now happens here in
 * one pass, and shared reference data comes from the cached readers.
 */

/** The /home layout already reads this row for the sidebar and user store. */
export type DashboardUser = Codev;

export type DashboardProject = {
  role: string;
  joined_at: string;
  project: {
    id: string;
    name: string;
    status: string;
    main_image: string | null;
    kanban_display?: boolean;
  };
};

export type DashboardData = {
  user: DashboardUser;
  /** Skill category name -> points earned. */
  pointsByCategory: Record<string, number>;
  /** Skill category name -> current level. */
  levelsByCategory: Record<string, number>;
  attendancePoints: number;
  profilePoints: number;
  profileCompletion: Record<string, ProfileCompletionDetail>;
  /** Skill + attendance + profile points, used by the role roadmap. */
  totalPoints: number;
  projects: DashboardProject[];
};

const ACTIVE_PROJECT_STATUSES = ["active", "inprogress", "pending"];

function mapPointsByCategory(
  categories: SkillCategoryRow[],
  rows: Array<{ skill_category_id: string; points: number | null }>,
) {
  return categories.reduce<Record<string, number>>((acc, category) => {
    const match = rows.find((row) => row.skill_category_id === category.id);
    acc[category.name] = match?.points ?? 0;
    return acc;
  }, {});
}

function mapLevelsByCategory(
  categories: SkillCategoryRow[],
  levels: LevelRow[],
  pointsByCategory: Record<string, number>,
) {
  return categories.reduce<Record<string, number>>((acc, category) => {
    const categoryPoints = pointsByCategory[category.name] ?? 0;
    const categoryLevels = levels.filter(
      (level) => level.skill_category_id === category.id,
    );

    acc[category.name] =
      categoryLevels.find(
        (level) =>
          categoryPoints >= level.min_points &&
          (level.max_points === null || categoryPoints <= level.max_points),
      )?.level ?? 1;

    return acc;
  }, {});
}

/**
 * Deduped per request, so any number of server components on the page can call
 * this and still only pay for one set of queries.
 */
export const getDashboardData = cache(
  async (): Promise<DashboardData | null> => {
    const [supabase, user] = await Promise.all([
      createClientServerComponent(),
      getCurrentCodev(),
    ]);

    if (!user) return null;

    const codevId = user.id;

    const [
      skillPointsResult,
      attendanceResult,
      projectsResult,
      profileResult,
      categories,
      levels,
    ] = await Promise.all([
      supabase
        .from("codev_points")
        .select("skill_category_id, points")
        .eq("codev_id", codevId),
      supabase
        .from("attendance_points")
        .select("points")
        .eq("codev_id", codevId)
        .maybeSingle(),
      supabase
        .from("project_members")
        .select(
          "role, joined_at, projects!inner(id, name, status, main_image, kanban_display)",
        )
        .eq("codev_id", codevId)
        .in("projects.status", ACTIVE_PROJECT_STATUSES)
        .order("joined_at", { ascending: false }),
      computeProfilePoints(supabase, codevId, user as unknown as Record<string, unknown>),
      getCachedSkillCategories(),
      getCachedLevels(),
    ]);

    if (skillPointsResult.error) {
      console.error(
        "Error fetching dashboard skill points:",
        skillPointsResult.error,
      );
    }

    if (projectsResult.error) {
      console.error(
        "Error fetching dashboard projects:",
        projectsResult.error,
      );
    }

    const skillPointRows = (skillPointsResult.data ?? []) as Array<{
      skill_category_id: string;
      points: number | null;
    }>;

    const pointsByCategory = mapPointsByCategory(categories, skillPointRows);
    const levelsByCategory = mapLevelsByCategory(
      categories,
      levels,
      pointsByCategory,
    );

    const attendancePoints = attendanceResult.data?.points ?? 0;
    const profilePoints = profileResult?.totalPoints ?? 0;
    const skillPointsTotal = skillPointRows.reduce(
      (sum, row) => sum + (row.points ?? 0),
      0,
    );

    const projects: DashboardProject[] = (
      (projectsResult.data ?? []) as unknown as Array<{
        role: string;
        joined_at: string;
        projects: DashboardProject["project"];
      }>
    )
      .filter((row) =>
        ACTIVE_PROJECT_STATUSES.includes(
          row.projects?.status?.toLowerCase() ?? "",
        ),
      )
      .map((row) => ({
        role: row.role,
        joined_at: row.joined_at,
        project: {
          id: row.projects.id,
          name: row.projects.name,
          status: row.projects.status,
          main_image: row.projects.main_image,
          kanban_display: row.projects.kanban_display,
        },
      }));

    return {
      user,
      pointsByCategory,
      levelsByCategory,
      attendancePoints,
      profilePoints,
      profileCompletion: profileResult?.completionDetails ?? {},
      totalPoints: skillPointsTotal + attendancePoints + profilePoints,
      projects,
    };
  },
);
