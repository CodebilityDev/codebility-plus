import { NextRequest, NextResponse } from "next/server";
import { parseServicesCategory } from "@/lib/services/services-categories";
import {
  getCachedServicesProjectById,
  getCachedServicesProjectsPage,
} from "@/lib/server/services-projects-cached";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
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

function emptyPage(category: string, page: number, limit: number) {
  return {
    projects: [],
    pagination: { page, limit, total: 0, totalPages: 0 },
    category,
  };
}

const cacheHeaders = {
  "Cache-Control":
    "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const projectId = searchParams.get("id");

    if (projectId) {
      const data = await getCachedServicesProjectById(projectId);
      if (!data) {
        return NextResponse.json(
          { error: "Not found" },
          { status: 404, headers: { "Cache-Control": "no-store" } },
        );
      }
      return NextResponse.json(data, { headers: cacheHeaders });
    }

    const category = parseServicesCategory(searchParams.get("category"));
    const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
    const limit = parsePositiveInt(
      searchParams.get("limit"),
      DEFAULT_LIMIT,
      MAX_LIMIT,
    );

    const data = await getCachedServicesProjectsPage(category, page, limit);

    if (!data) {
      return NextResponse.json(emptyPage(category, page, limit), {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      });
    }

    return NextResponse.json(data, { headers: cacheHeaders });
  } catch (err) {
    console.error("Unexpected error in /api/services-projects:", err);
    return NextResponse.json(emptyPage("all", 1, DEFAULT_LIMIT), {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
