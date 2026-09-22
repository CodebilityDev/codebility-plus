import { unstable_cache } from "next/cache";
import { createClientAnon } from "@/utils/supabase/anon";

/**
 * Reference data for the /home dashboard. Every table here is public-read and
 * shared by all users, so it goes through `unstable_cache` with the anon client
 * rather than being refetched per user on every render.
 */

export type SkillCategoryRow = { id: string; name: string };

export type LevelRow = {
  id: string;
  skill_category_id: string;
  level: number;
  min_points: number;
  max_points: number | null;
};

export type NewsBannerRow = {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error" | "announcement";
  image_url: string | null;
  priority: number;
  start_date: string;
  end_date: string | null;
};

/** Project Manager is scored separately and never shown in the points overview. */
const EXCLUDED_CATEGORY = "Project Manager";

export const getCachedSkillCategories = unstable_cache(
  async (): Promise<SkillCategoryRow[]> => {
    const { data, error } = await createClientAnon()
      .from("skill_category")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("Supabase query error (skill-categories):", error);
      return [];
    }

    return ((data ?? []) as SkillCategoryRow[]).filter(
      (category) => category.name !== EXCLUDED_CATEGORY,
    );
  },
  ["dashboard-skill-categories"],
  { revalidate: 3600, tags: ["skill-categories"] },
);

export const getCachedLevels = unstable_cache(
  async (): Promise<LevelRow[]> => {
    const { data, error } = await createClientAnon()
      .from("levels")
      .select("id, skill_category_id, level, min_points, max_points")
      .order("level", { ascending: true });

    if (error) {
      console.error("Supabase query error (levels):", error);
      return [];
    }

    return (data ?? []) as LevelRow[];
  },
  ["dashboard-levels"],
  { revalidate: 3600, tags: ["levels"] },
);

/**
 * All active banners, unfiltered by date. The start/end window is applied at
 * render time so a cached entry never freezes "now" into the query.
 */
const getCachedActiveBanners = unstable_cache(
  async (): Promise<NewsBannerRow[]> => {
    const { data, error } = await createClientAnon()
      .from("news_banners")
      .select(
        "id, title, message, type, image_url, priority, start_date, end_date",
      )
      .eq("is_active", true)
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase query error (news-banners):", error);
      return [];
    }

    return (data ?? []) as NewsBannerRow[];
  },
  ["dashboard-news-banners"],
  { revalidate: 300, tags: ["news-banners"] },
);

export async function getCurrentNewsBanners(): Promise<NewsBannerRow[]> {
  const now = Date.now();

  return (await getCachedActiveBanners()).filter((banner) => {
    if (new Date(banner.start_date).getTime() > now) return false;
    if (banner.end_date && new Date(banner.end_date).getTime() < now) {
      return false;
    }
    return true;
  });
}
