import { connection } from "next/server";
import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getCachedProfilesListingPage } from "@/lib/global/profiles-listing-cached";
import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT, cacheHeaders } from "@/constants/api/profiles-listing/profiles-listing";
import { parsePositiveInt, emptyPage } from "@/utils/api/profiles-listing/profiles-listing";


export async function GET(request: NextRequest) {
  await connection();
  try {
    const { searchParams } = request.nextUrl;
    const position = searchParams.get("position")?.trim() ?? "";
    const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
    const limit = parsePositiveInt(
      searchParams.get("limit"),
      DEFAULT_LIMIT,
      MAX_LIMIT,
    );

    const data = await getCachedProfilesListingPage(position, page, limit);

    if (!data) {
      return NextResponse.json(emptyPage(position, page, limit), {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      });
    }

    return NextResponse.json(data, { headers: cacheHeaders });
  } catch (err) {
    console.error("Unexpected error in /api/profiles-listing:", err);
    return NextResponse.json(emptyPage("", 1, DEFAULT_LIMIT), {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
}