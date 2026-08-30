import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Codev } from "@/types/home/codev";
import type { CodevsProfilesPage } from "@/types/marketing/codevs-profiles";
import { createClientAnon } from "@/utils/supabase/anon";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 50;
const ADMIN_ROLE_ID = 1;

const CODEVS_PROFILES_SELECT = `
  id,
  first_name,
  last_name,
  image_url,
  display_position,
  availability_status,
  internal_status,
  level,
  codev_points (
    id,
    skill_category_id,
    points
  )
`;

export type { CodevsProfilesPage } from "@/types/marketing/codevs-profiles";

type CodevsProfileRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  display_position: string | null;
  availability_status: boolean | null;
  internal_status: string | null;
  level: Record<string, number> | null;
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

function mapRow(row: CodevsProfileRow): Codev {
  return {
    id: row.id,
    first_name: row.first_name ?? "",
    last_name: row.last_name ?? "",
    image_url: row.image_url ?? undefined,
    display_position: row.display_position ?? undefined,
    availability_status: row.availability_status ?? false,
    internal_status: row.internal_status ?? undefined,
    level: row.level ?? undefined,
    codev_points: row.codev_points ?? [],
  } as Codev;
}

export async function getCodevsProfilePositions(
  supabase: SupabaseClient,
): Promise<string[] | null> {
  const { data, error } = await supabase
    .from("codev")
    .select("display_position")
    .eq("application_status", "passed")
    .eq("availability_status", true)
    .neq("role_id", ADMIN_ROLE_ID)
    .not("display_position", "is", null);

  if (error) {
    console.error("Supabase query error (codevs-profile-positions):", error);
    return null;
  }

  const positions = [
    ...new Set(
      (data ?? [])
        .map((row: { display_position: string | null }) => row.display_position)
        .filter((value): value is string => Boolean(value)),
    ),
  ].sort((a, b) => a.localeCompare(b));

  return positions;
}

export async function getCodevsProfilesPage(
  supabase: SupabaseClient,
  options?: {
    position?: string;
    page?: number;
    limit?: number;
  },
): Promise<CodevsProfilesPage | null> {
  const position = options?.position?.trim() ?? "";
  const page = parsePositiveInt(options?.page, DEFAULT_PAGE);
  const limit = parsePositiveInt(options?.limit, DEFAULT_LIMIT, MAX_LIMIT);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const positions = await getCodevsProfilePositions(supabase);
  if (!positions) return null;

  let query = supabase
    .from("codev")
    .select(CODEVS_PROFILES_SELECT, { count: "exact" })
    .eq("application_status", "passed")
    .eq("availability_status", true)
    .neq("role_id", ADMIN_ROLE_ID)
    .order("landing_rank_score", { ascending: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (position) {
    query = query.eq("display_position", position);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Supabase query error (codevs-profiles):", error);
    return null;
  }

  const total = count ?? 0;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const rows = (data ?? []) as CodevsProfileRow[];

  return {
    codevs: rows.map(mapRow),
    pagination: { page, limit, total, totalPages },
    positions,
    position,
  };
}

export const getCachedCodevsProfilePositions = unstable_cache(
  async () => getCodevsProfilePositions(createClientAnon()),
  ["codevs-profile-positions"],
  { revalidate: 3600, tags: ["codevs-profiles"] },
);

export const getCachedCodevsProfilesPage = unstable_cache(
  async (position: string, page: number, limit: number) =>
    getCodevsProfilesPage(createClientAnon(), {
      position: position || undefined,
      page,
      limit,
    }),
  ["codevs-profiles"],
  { revalidate: 3600, tags: ["codevs-profiles"] },
);
