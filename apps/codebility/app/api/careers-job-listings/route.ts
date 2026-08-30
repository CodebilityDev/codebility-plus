import { NextRequest, NextResponse } from "next/server";
import { getCachedCareersJobListingsPage } from "@/lib/server/careers-job-listings-cached";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 4;
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

function emptyPage(
  department: string,
  type: string,
  level: string,
  page: number,
  limit: number,
) {
  return {
    jobs: [],
    pagination: { page, limit, total: 0, totalPages: 0 },
    department,
    type,
    level,
  };
}

const cacheHeaders = {
  "Cache-Control":
    "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const department = searchParams.get("department")?.trim() ?? "";
    const type = searchParams.get("type")?.trim() ?? "";
    const level = searchParams.get("level")?.trim() ?? "";
    const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
    const limit = parsePositiveInt(
      searchParams.get("limit"),
      DEFAULT_LIMIT,
      MAX_LIMIT,
    );

    const data = await getCachedCareersJobListingsPage(
      department,
      type,
      level,
      page,
      limit,
    );

    if (!data) {
      return NextResponse.json(
        emptyPage(department, type, level, page, limit),
        { status: 500, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(data, { headers: cacheHeaders });
  } catch (err) {
    console.error("Unexpected error in /api/careers-job-listings:", err);
    return NextResponse.json(emptyPage("", "", "", 1, DEFAULT_LIMIT), {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
