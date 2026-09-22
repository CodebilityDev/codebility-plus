import { NextRequest, NextResponse } from "next/server";
import { createClientAnon } from "@/utils/supabase/anon";

const cacheHeaders = {
  "Cache-Control":
    "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const supabase = createClientAnon();

    const { data, error } = await supabase
      .rpc("calculate_member_rating_score", { member_uuid: id })
      .single();

    if (error) {
      console.error("Error fetching profile rating:", error);
      return NextResponse.json(
        { rating: 0 },
        { status: 500, headers: { "Cache-Control": "no-store" } },
      );
    }

    const rating =
      typeof data === "number"
        ? data
        : ((data as { calculate_member_rating_score?: number } | null)
            ?.calculate_member_rating_score ?? 0);

    return NextResponse.json({ rating: rating ?? 0 }, { headers: cacheHeaders });
  } catch (err) {
    console.error("Unexpected error in /api/profile-rating:", err);
    return NextResponse.json(
      { rating: 0 },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
