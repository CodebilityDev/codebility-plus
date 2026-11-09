import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { getSkillCategories } from "@/lib/global/skill-categories-cached";
import { createClientAnon } from "@/lib/global/supabase-anon";
import type { CodevBadgeSkillCategory } from "@/types/global/codev";
import type { HeroCodev, HeroCodevSearchResult } from "@/types/landing/hero-codevs";
import type { Database } from "@/types/global/supabase";

const HERO_LIMIT = 8;
const ADMIN_ROLE_ID = 1;

const HERO_CODEV_SELECT = `
  id,
  first_name,
  last_name,
  image_url,
  display_position,
  availability_status,
  tech_stacks,
  codev_points (
    skill_category_id,
    points
  )
`;

interface HeroCodevRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  display_position: string | null;
  availability_status: boolean | null;
  tech_stacks: string[] | null;
  codev_points:
    | {
        skill_category_id: string | null;
        points: number | null;
      }[]
    | null;
}

function positivePage(value: number): number {
  return Number.isFinite(value) && value >= 1 ? Math.floor(value) : 1;
}

function cleanSearchTerm(value: string): string {
  return value
    .trim()
    .slice(0, 80)
    .replace(/[",(){}%_\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSearchFilter(term: string): string | undefined {
  if (!term) return undefined;

  const pattern = `%${term}%`;
  const normalized = term.toLowerCase();
  const techTerms = [
    normalized,
    normalized.replace(/[.\s/_-]+/g, ""),
  ].filter((value, index, values) => value && values.indexOf(value) === index);

  return [
    `first_name.ilike.${pattern}`,
    `last_name.ilike.${pattern}`,
    `display_position.ilike.${pattern}`,
    ...techTerms.map((value) => `tech_stacks.cs.{"${value}"}`),
  ].join(",");
}

function formatSkill(value: string): string {
  return value
    .replace(/\s+(Developer|Designer|Engineer)$/i, "")
    .replace(/^Quality Assurance$/i, "QA")
    .trim();
}

function toInitials(first: string, last: string): string {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "CD";
}

function mapHeroCodev(
  row: HeroCodevRow,
  skillCategories: CodevBadgeSkillCategory[],
): HeroCodev {
  const first = row.first_name?.trim() ?? "";
  const last = row.last_name?.trim() ?? "";
  const name = `${first} ${last}`.trim() || "CoDev";
  const categoryNames = new Map(
    skillCategories.map((category) => [category.id, category.name]),
  );
  const rankedSkills = (row.codev_points ?? [])
    .filter((point) => point.skill_category_id)
    .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
    .map((point) => categoryNames.get(point.skill_category_id ?? ""))
    .filter((value): value is string => Boolean(value))
    .map(formatSkill);
  const skills = [...new Set(rankedSkills)].slice(0, 3);

  return {
    id: row.id,
    name,
    role: row.display_position?.trim() ? row.display_position.trim() : "CoDev",
    initials: toInitials(first, last),
    imageSrc: row.image_url ?? undefined,
    skills:
      skills.length > 0
        ? skills
        : [...new Set((row.tech_stacks ?? []).filter(Boolean))].slice(0, 3),
    verified: true,
  };
}

async function queryHeroCodevs(
  supabase: SupabaseClient<Database>,
  options: { search?: string; page: number; limit: number },
): Promise<{ rows: HeroCodevRow[]; total: number } | null> {
  const page = positivePage(options.page);
  const limit = options.limit;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const filter = buildSearchFilter(options.search ?? "");

  let query = supabase
    .from("codev")
    .select(
      HERO_CODEV_SELECT,
      options.search ? { count: "exact" as const } : undefined,
    )
    .eq("application_status", "passed")
    .eq("availability_status", true)
    .neq("role_id", ADMIN_ROLE_ID)
    .order("landing_rank_score", { ascending: false })
    .order("id", { ascending: true });

  if (filter) {
    query = query.or(filter);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("Supabase query error (hero-codevs):", error);
    return null;
  }

  return {
    rows: data as unknown as HeroCodevRow[],
    total: count ?? 0,
  };
}

export async function getCachedHeroCodevs(): Promise<HeroCodev[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.codevsProfiles);

  const [result, skillCategories] = await Promise.all([
    queryHeroCodevs(createClientAnon(), { page: 1, limit: HERO_LIMIT }),
    getSkillCategories(),
  ]);

  if (!result) return [];

  return result.rows.map((row) => mapHeroCodev(row, skillCategories));
}

export async function searchHeroCodevs(
  query: string,
  page: number,
): Promise<HeroCodevSearchResult> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.codevsProfiles);

  const search = cleanSearchTerm(query);
  const currentPage = positivePage(page);
  const [result, skillCategories] = await Promise.all([
    queryHeroCodevs(createClientAnon(), {
      search,
      page: currentPage,
      limit: HERO_LIMIT,
    }),
    getSkillCategories(),
  ]);

  if (!result) {
    return {
      codevs: [],
      page: currentPage,
      limit: HERO_LIMIT,
      total: 0,
      totalPages: 0,
      query: search,
    };
  }

  return {
    codevs: result.rows.map((row) => mapHeroCodev(row, skillCategories)),
    page: currentPage,
    limit: HERO_LIMIT,
    total: result.total,
    totalPages:
      result.total === 0 ? 0 : Math.ceil(result.total / HERO_LIMIT),
    query: search,
  };
}
