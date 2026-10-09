import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { createClientAnon } from "@/lib/global/supabase-anon";
import { getBadgePrefix } from "@/utils/global/codev";
import type { CodevBadgeSkillCategory } from "@/types/global/codev";

export async function getSkillCategories(): Promise<CodevBadgeSkillCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.skillCategories);

  const { data, error } = await createClientAnon()
    .from("skill_category")
    .select("id, name");

  if (error) {
    console.error("Error fetching skill categories:", error);
    return [];
  }

  return data.map((category) => ({
    ...category,
    badge_prefix: getBadgePrefix(category.name),
  }));
}
