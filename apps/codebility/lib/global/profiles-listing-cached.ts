import { cacheLife, cacheTag } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Codev } from "@/types/global/codev";
import type { ProfilesListingPage } from "@/types/global/profiles-listing";
import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { createClientAnon } from "@/lib/global/supabase-anon";
import type { ProfilesListingRow } from "@/types/global/lib";


const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;
const MIN_QUALIFIED_POINTS = 100;

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

async function fetchQualifiedCodevIds(
  supabase: SupabaseClient,
): Promise<string[] | null> {
  const { data, error } = await supabase
    .from("codev_total_points")
    .select("codev_id")
    .gte("skill_points", MIN_QUALIFIED_POINTS);

  if (error) {
    console.error("Supabase query error (profiles-listing points):", error);
    return null;
  }

  return (data as { codev_id: string | null }[])
    .map((row) => row.codev_id)
    .filter((id): id is string => Boolean(id));
}

async function fetchPositions(
  supabase: SupabaseClient,
  codevIds: string[],
): Promise<string[] | null> {
  if (codevIds.length === 0) return [];

  const { data, error } = await supabase
    .from("codev")
    .select("display_position")
    .in("id", codevIds)
    .eq("application_status", "passed")
    .eq("availability_status", true)
    .not("display_position", "is", null);

  if (error) {
    console.error("Supabase query error (profiles-listing positions):", error);
    return null;
  }

  return [
    ...new Set(
      (data as { display_position: string | null }[])
        .map((row) => row.display_position)
        .filter((value): value is string => Boolean(value)),
    ),
  ].sort((a, b) => a.localeCompare(b));
}

async function fetchProfilesPage(
  supabase: SupabaseClient,
  codevIds: string[],
  position: string,
  from: number,
  to: number,
): Promise<{ codevs: Codev[]; total: number } | null> {
  if (codevIds.length === 0) return { codevs: [], total: 0 };

  let query = supabase
    .from("codev")
    .select(PROFILES_LISTING_SELECT, { count: "exact" })
    .in("id", codevIds)
    .eq("application_status", "passed")
    .eq("availability_status", true)
    .order("landing_rank_score", { ascending: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (position) {
    query = query.eq("display_position", position);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Supabase query error (profiles-listing):", error);
    return null;
  }

  return {
    codevs: (data as ProfilesListingRow[]).map(mapRow),
    total: count ?? 0,
  };
}

function buildListingPage(
  codevs: Codev[],
  total: number,
  positions: string[],
  position: string,
  page: number,
  limit: number,
): ProfilesListingPage {
  return {
    codevs,
    pagination: {
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / limit),
    },
    positions,
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
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const codevIds = await fetchQualifiedCodevIds(supabase);
  if (!codevIds) return null;

  const [positions, result] = await Promise.all([
    fetchPositions(supabase, codevIds),
    fetchProfilesPage(supabase, codevIds, position, from, to),
  ]);

  if (!positions || !result) return null;

  return buildListingPage(
    result.codevs,
    result.total,
    positions,
    position,
    page,
    limit,
  );
}

async function getCachedQualifiedCodevIds() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.profilesListing);
  return fetchQualifiedCodevIds(createClientAnon());
}

async function getCachedQualifiedPositions() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.profilesListing);
  const codevIds = await getCachedQualifiedCodevIds();
  if (!codevIds) return null;
  return fetchPositions(createClientAnon(), codevIds);
}

export async function getCachedProfilesListingPositions(): Promise<string[]> {
  return (await getCachedQualifiedPositions()) ?? [];
}

export async function getCachedProfilesListingPage(
  position: string,
  page: number,
  limit: number,
) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.profilesListing);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const codevIds = await getCachedQualifiedCodevIds();
  if (!codevIds) return null;

  const [positions, result] = await Promise.all([
    getCachedQualifiedPositions(),
    fetchProfilesPage(createClientAnon(), codevIds, position, from, to),
  ]);

  if (!positions || !result) return null;

  return buildListingPage(
    result.codevs,
    result.total,
    positions,
    position,
    page,
    limit,
  );
}

async function fetchProfileProjects(codevId: string) {
  const supabase = createClientAnon();
  const { data: members, error: memberError } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("codev_id", codevId);

  if (memberError || members.length === 0) return [];

  const { data: projects, error: projectError } = await supabase
    .from("projects")
    .select("id, name, main_image")
    .in(
      "id",
      members.map((row) => row.project_id).filter((id): id is string => id !== null),
    );

  if (projectError) return [];

  return projects.map((project) => ({
    project_id: project.id,
    name: project.name,
    main_image: project.main_image,
  }));
}

async function fetchProfileRating(codevId: string) {
  const { data, error } = await createClientAnon()
    .rpc("calculate_member_rating_score", { member_uuid: codevId })
    .single();

  if (error) return 0;
  if (typeof data === "number") return data;
  return (data as { calculate_member_rating_score?: number } | null)
    ?.calculate_member_rating_score ?? 0;
}

export async function getCachedProfileProjects(codevId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.profilesListing);
  return fetchProfileProjects(codevId);
}

export async function getCachedProfileRating(codevId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.profilesListing);
  return fetchProfileRating(codevId);
}
