import { NextRequest, NextResponse } from "next/server";
import { getCachedCareersJobListingsPage } from "@/lib/global/careers-job-listings-cached";
import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT, cacheHeaders } from "@/constants/api/careers-job-listings/careers-job-listings";
import { parsePositiveInt, emptyPage } from "@/utils/api/careers-job-listings/careers-job-listings";


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
