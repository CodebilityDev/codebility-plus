import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Codev } from "@/types/home/codev";
import type { ProfilesListingPage } from "@/types/marketing/profiles-listing";
import { getQualifiedCodevs } from "@/utils/codev-qualification";
import { prioritizeCodevs } from "@/utils/codev-priority";
import { createClientAnon } from "@/utils/supabase/anon";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;

const PROFILES_LISTING_SELECT = `
  id,
  first_name,
  last_name,
  image_url,
  display_position,
  availability_status,
  internal_status,
  application_status,
  level,
  years_of_experience,
  work_experience ( id ),
  codev_points (
    id,
    skill_category_id,
    points
  )
`;

type ProfilesListingRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  display_position: string | null;
  availability_status: boolean | null;
  internal_status: string | null;
  application_status: string | null;
  level: Record<string, number> | null;
  years_of_experience: number | null;
  work_experience: Array<{ id: string }> | null;
  codev_points: Array<{
    id: string;
    skill_category_id: string;
    points: number;
  }> | null;
};

function parsePositiveInt(
  value: number | undefined,
  fallback: number,
  max?: number,
): number {
  if (value === undefined || !Number.isFinite(value) || value < 1) {
    return fallback;
  }
  if (max !== undefined) return Math.min(value, max);
  return value;
}

function mapRow(row: ProfilesListingRow): Codev {
  return {
    id: row.id,
    first_name: row.first_name ?? "",
    last_name: row.last_name ?? "",
    image_url: row.image_url ?? undefined,
    display_position: row.display_position ?? undefined,
    availability_status: row.availability_status ?? false,
    internal_status: row.internal_status ?? undefined,
    application_status: row.application_status ?? undefined,
    level: row.level ?? undefined,
    years_of_experience: row.years_of_experience ?? undefined,
    work_experience: (row.work_experience ?? []).map((exp) => ({
      id: exp.id,
    })) as Codev["work_experience"],
    codev_points: row.codev_points ?? [],
  } as Codev;
}

async function fetchQualifiedProfiles(
  supabase: SupabaseClient,
): Promise<Codev[] | null> {
  const { data, error } = await supabase
    .from("codev")
    .select(PROFILES_LISTING_SELECT)
    .eq("application_status", "passed");

  if (error) {
    console.error("Supabase query error (profiles-listing):", error);
    return null;
  }

  const rows = (data ?? []) as ProfilesListingRow[];
  const codevs = rows.map(mapRow);
  const qualified = getQualifiedCodevs(codevs);
  return prioritizeCodevs(qualified);
}

function getPositions(codevs: Codev[]): string[] {
  return [
    ...new Set(
      codevs
        .map((codev) => codev.display_position)
        .filter((value): value is string => Boolean(value)),
    ),
  ].sort((a, b) => a.localeCompare(b));
}

function paginateCodevs(
  codevs: Codev[],
  position: string,
  page: number,
  limit: number,
): ProfilesListingPage {
  const filtered = position
    ? codevs.filter((codev) => codev.display_position === position)
    : codevs;

  const total = filtered.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const from = (page - 1) * limit;
  const slice = filtered.slice(from, from + limit);

  return {
    codevs: slice,
    pagination: { page, limit, total, totalPages },
    positions: getPositions(codevs),
    position,
  };
}

export async function getProfilesListingPage(
  supabase: SupabaseClient,
  options?: {
    position?: string;
    page?: number;
    limit?: number;
  },
): Promise<ProfilesListingPage | null> {
  const position = options?.position?.trim() ?? "";
  const page = parsePositiveInt(options?.page, DEFAULT_PAGE);
  const limit = parsePositiveInt(options?.limit, DEFAULT_LIMIT, MAX_LIMIT);

  const qualified = await fetchQualifiedProfiles(supabase);
  if (!qualified) return null;

  return paginateCodevs(qualified, position, page, limit);
}

const getCachedQualifiedProfiles = unstable_cache(
  async () => fetchQualifiedProfiles(createClientAnon()),
  ["profiles-listing-qualified"],
  { revalidate: 3600, tags: ["profiles-listing"] },
);

export const getCachedProfilesListingPage = unstable_cache(
  async (position: string, page: number, limit: number) => {
    const qualified = await getCachedQualifiedProfiles();
    if (!qualified) return null;
    return paginateCodevs(qualified, position, page, limit);
  },
  ["profiles-listing"],
  { revalidate: 3600, tags: ["profiles-listing"] },
);

export type { ProfilesListingPage } from "@/types/marketing/profiles-listing";
