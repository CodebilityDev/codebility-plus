import { NextRequest, NextResponse } from "next/server";
import { parseServicesCategory } from "@/utils/global/services-categories";
import { getCachedServicesProjectById, getCachedServicesProjectsPage } from "@/lib/global/services-projects-cached";
import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT, cacheHeaders } from "@/constants/api/services-projects/services-projects";
import { parsePositiveInt, emptyPage } from "@/utils/api/services-projects/services-projects";


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
