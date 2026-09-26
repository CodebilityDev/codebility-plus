import { NextRequest, NextResponse } from "next/server";
import { getCachedCodevsProfilesPage } from "@/lib/global/codevs-profiles-cached";
import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT, cacheHeaders } from "@/constants/api/codevs-profiles/codevs-profiles";
import { parsePositiveInt, emptyPage } from "@/utils/api/codevs-profiles/codevs-profiles";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const position = searchParams.get("position")?.trim() ?? "";
    const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
    const limit = parsePositiveInt(
      searchParams.get("limit"),
      DEFAULT_LIMIT,
      MAX_LIMIT,
    );

    const data = await getCachedCodevsProfilesPage(position, page, limit);

    if (!data) {
      return NextResponse.json(emptyPage(position, page, limit), {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      });
    }

    return NextResponse.json(data, { headers: cacheHeaders });
  } catch (err) {
    console.error("Unexpected error in /api/codevs-profiles:", err);
    return NextResponse.json(emptyPage("", 1, DEFAULT_LIMIT), {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
