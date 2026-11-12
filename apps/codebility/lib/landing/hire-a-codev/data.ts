import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import type {
  HireTalentFilterValue,
  HireTalentTech,
} from "@/constants/landing/hire-a-codev/content";
import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { getSkillCategories } from "@/lib/global/skill-categories-cached";
import { createClientAnon } from "@/lib/global/supabase-anon";
import type { Json } from "@/types/global/supabase";
import type { HireTalentProfile } from "@/types/landing/hire-a-codev/profile";
import { asLevelRecord } from "@/utils/global/codev-level";

const HIRE_TALENT_LIMIT = 4;
const ADMIN_ROLE_ID = 1;

const HIRE_TALENT_SELECT = `
  id,
  first_name,
  last_name,
  image_url,
  display_position,
  availability_status,
  level,
  tech_stacks
`;

interface HireTalentRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  display_position: string | null;
  availability_status: boolean | null;
  level: Json | null;
  tech_stacks: string[] | null;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function categoryLabel(name: string) {
  return name
    .replace(/\s+(Developer|Designer|Engineer)$/i, "")
    .trim();
}

const TECH_ALIASES: Record<HireTalentTech, string[]> = {
  React: ["react", "reactjs"],
  "Next.js": ["nextjs"],
  "Node.js": ["nodejs"],
  Python: ["python"],
  "PHP / WordPress": ["php", "wordpress"],
  Shopify: ["shopify"],
  "React Native": ["reactnative"],
  Figma: ["figma"],
  n8n: ["n8n"],
};

function normalizeStack(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function matchesTech(profile: HireTalentProfile, tech: HireTalentTech) {
  const aliases = TECH_ALIASES[tech];

  return profile.tech.some((stack) =>
    aliases.includes(normalizeStack(stack)),
  );
}

function matchesFilter(
  profile: HireTalentProfile,
  filter: HireTalentFilterValue,
) {
  if (filter === "all") return true;

  const role = profile.role.toLowerCase();
  const levels = profile.levels.map((level) => level.name.toLowerCase());

  if (filter === "full-stack") return role.includes("full stack");
  if (filter === "frontend") return role.includes("frontend");
  if (filter === "backend") return role.includes("backend");
  if (filter === "mobile")
    return role.includes("mobile") || levels.includes("mobile");
  if (filter === "ui-ux")
    return role.includes("ui/ux") || levels.includes("ui/ux");
  if (filter === "qa") return role.includes("qa") || levels.includes("qa");

  return role.includes("ai") || levels.includes("ai");
}

async function getCachedHireTalentPool(): Promise<HireTalentProfile[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.profileDetail);
  cacheTag(CACHE_TAGS.codevsProfiles);

  const [result, skillCategories] = await Promise.all([
    createClientAnon()
      .from("codev")
      .select(HIRE_TALENT_SELECT)
      .eq("application_status", "passed")
      .eq("availability_status", true)
      .neq("role_id", ADMIN_ROLE_ID)
      .not("display_position", "ilike", "%Manager%")
      .order("landing_rank_score", { ascending: false, nullsFirst: false })
      .order("id", { ascending: true }),
    getSkillCategories(),
  ]);

  if (result.error) {
    console.error("Supabase query error (hire-talent-profiles):", result.error);
    return [];
  }

  const categoryById = new Map(
    skillCategories.map((category) => [category.id, category]),
  );
  const levelOrder = ["Backend", "Mobile", "Frontend", "UI/UX", "QA"];

  return (result.data as unknown as HireTalentRow[]).map((codev) => {
    const name = `${codev.first_name ?? ""} ${codev.last_name ?? ""}`.trim();
    const levels = Object.entries(asLevelRecord(codev.level ?? undefined))
      .flatMap(([categoryId, value]) => {
        const category = categoryById.get(categoryId);
        const level = Number(value);

        if (!category || !Number.isFinite(level) || level <= 0) return [];

        return [
          {
            id: categoryId,
            name: categoryLabel(category.name),
            level,
          },
        ];
      })
      .sort((a, b) => {
        const levelDifference = b.level - a.level;
        if (levelDifference !== 0) return levelDifference;

        const aIndex = levelOrder.indexOf(a.name);
        const bIndex = levelOrder.indexOf(b.name);
        return (aIndex === -1 ? levelOrder.length : aIndex) -
          (bIndex === -1 ? levelOrder.length : bIndex);
      })
      .slice(0, 3);

    return {
      id: codev.id,
      name,
      role: codev.display_position?.trim() ?? "Software Developer",
      imageSrc: codev.image_url?.trim() ?? undefined,
      initials: initials(name),
      available: Boolean(codev.availability_status),
      levels,
      tech: (codev.tech_stacks ?? [])
        .map((stack) => stack.trim())
        .filter(Boolean),
    };
  });
}

export async function getCachedHireTalentProfiles(
  filter: HireTalentFilterValue = "all",
  tech?: HireTalentTech,
): Promise<HireTalentProfile[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.profileDetail);
  cacheTag(CACHE_TAGS.codevsProfiles);

  const profiles = await getCachedHireTalentPool();

  return profiles
    .filter((profile) => matchesFilter(profile, filter))
    .filter((profile) => (tech ? matchesTech(profile, tech) : true))
    .slice(0, HIRE_TALENT_LIMIT);
}
