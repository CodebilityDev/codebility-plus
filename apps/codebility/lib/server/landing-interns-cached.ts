import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClientAnon } from "@/utils/supabase/anon";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const LANDING_INTERN_SELECT =
  "id, first_name, last_name, display_position, image_url, role_id";

export type LandingInternsPage = {
  TEAM_MEMBERS: Array<{
    id: string;
    name: string;
    role: "Intern" | "Codev" | "Member";
    image?: string;
    display_position?: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type LandingInternRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_position: string | null;
  image_url: string | null;
  role_id: number | null;
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

function roleName(roleId: number | undefined): "Intern" | "Codev" | "Member" {
  if (roleId === 4) return "Intern";
  if (roleId === 10) return "Codev";
  return "Member";
}

export async function getLandingInternsPage(
  supabase: SupabaseClient,
  options?: {
    page?: number;
    limit?: number;
  },
): Promise<LandingInternsPage | null> {
  const page = parsePositiveInt(options?.page, DEFAULT_PAGE);
  const limit = parsePositiveInt(options?.limit, DEFAULT_LIMIT, MAX_LIMIT);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from("codev")
    .select(LANDING_INTERN_SELECT, { count: "exact" })
    .eq("availability_status", true)
    .in("role_id", [4, 10])
    .order("landing_rank_score", { ascending: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Supabase query error (landing-interns):", error);
    return null;
  }

  const total = count ?? 0;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const rows = (data ?? []) as LandingInternRow[];

  return {
    TEAM_MEMBERS: rows.map((row) => ({
      id: row.id,
      name: `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim(),
      role: roleName(row.role_id ?? undefined),
      image: row.image_url ?? undefined,
      display_position: row.display_position ?? undefined,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export const getCachedLandingInternsPage = unstable_cache(
  async (page: number, limit: number) =>
    getLandingInternsPage(createClientAnon(), { page, limit }),
  ["landing-interns"],
  { revalidate: 3600, tags: ["landing-interns"] },
);
