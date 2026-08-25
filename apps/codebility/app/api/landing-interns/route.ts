import { NextRequest, NextResponse } from "next/server";
import { createClientAnon } from "@/utils/supabase/anon";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const LANDING_INTERN_SELECT =
  "id, first_name, last_name, display_position, image_url, role_id";

function parsePositiveInt(
  value: string | null,
  fallback: number,
  max?: number,
): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  if (max !== undefined) return Math.min(parsed, max);
  return parsed;
}

function roleName(roleId: number | undefined): "Intern" | "Codev" | "Member" {
  if (roleId === 4) return "Intern";
  if (roleId === 10) return "Codev";
  return "Member";
}

type LandingInternRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_position: string | null;
  image_url: string | null;
  role_id: number | null;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
    const limit = parsePositiveInt(
      searchParams.get("limit"),
      DEFAULT_LIMIT,
      MAX_LIMIT,
    );

    const supabase = createClientAnon();
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
      return NextResponse.json(
        {
          TEAM_MEMBERS: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
          error: error.message ?? "DB error",
        },
        {
          status: 500,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const total = count ?? 0;
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
    const rows = (data ?? []) as LandingInternRow[];

    return NextResponse.json(
      {
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
      },
      {
        headers: {
          "Cache-Control":
            "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (err) {
    console.error("Unexpected error in /api/landing-interns:", err);
    return NextResponse.json(
      {
        TEAM_MEMBERS: [],
        pagination: { page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0 },
        error: "Unexpected server error",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
