import { NextRequest, NextResponse } from "next/server";
import { getCachedLandingInternsPage } from "@/lib/global/landing-interns-cached";
import { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from "@/constants/api/landing-interns/landing-interns";
import { parsePositiveInt } from "@/utils/api/landing-interns/landing-interns";


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
