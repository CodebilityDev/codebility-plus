import { cacheLife, cacheTag } from "next/cache";

import { createClientAnon } from "@/lib/global/supabase-anon";
import { getBadgePrefix } from "@/utils/global/codev";
import type { CodevBadgeSkillCategory } from "@/types/global/codev";

export async function getSkillCategories(): Promise<CodevBadgeSkillCategory[]> {
  "use cache";
  cacheLife("days");
  cacheTag("skill-categories");

  const { data, error } = await createClientAnon()
    .from("skill_category")
    .select("id, name");

  if (error) {
    console.error("Error fetching skill categories:", error);
    return [];
  }

  return (data ?? []).map((category) => ({
    ...category,
    badge_prefix: getBadgePrefix(category.name ?? ""),
  }));
}
