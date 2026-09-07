import { NextRequest, NextResponse } from "next/server";
import { getCachedLandingInternsPage } from "@/lib/server/landing-interns-cached";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
    const limit = parsePositiveInt(
      searchParams.get("limit"),
      DEFAULT_LIMIT,
      MAX_LIMIT,
    );

    const data = await getCachedLandingInternsPage(page, limit);

    if (!data) {
      return NextResponse.json(
        {
          TEAM_MEMBERS: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
          error: "DB error",
        },
        {
          status: 500,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
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
